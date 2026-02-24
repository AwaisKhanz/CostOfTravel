"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  DollarSign,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ToolResult } from '@/components/tools/ToolResult';
import { trackEvent } from '@/lib/tracking';
import { getApiUrl } from '@/lib/api-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  tripCosts: z.object({
    airfare: z.union([z.number(), z.string().length(0)]),
    hotel: z.union([z.number(), z.string().length(0)]),
    cruise: z.union([z.number(), z.string().length(0)]),
    excursions: z.union([z.number(), z.string().length(0)]),
    baggageFees: z.union([z.number(), z.string().length(0)]),
    petFees: z.union([z.number(), z.string().length(0)])
  }),
  protectionType: z.string().min(1, "Please select protection type"),
  protectionProviderId: z.string().min(1, "Please select provider"),
  bookingDateLocal: z.string().min(1, "Booking date is required"),
  insurancePurchaseDateLocal: z.string().min(1, "Insurance purchase date is required"),
  cancellationReason: z.string().min(1, "Cancellation reason is required")
}).refine((data) => {
  if (data.protectionType !== 'insurance' || !data.insurancePurchaseDateLocal) return true;
  const booking = new Date(data.bookingDateLocal);
  const insurance = new Date(data.insurancePurchaseDateLocal);
  return booking <= insurance;
}, {
  message: "Trip must be booked on or before insurance purchase date",
  path: ["bookingDateLocal"]
});

type FormData = z.infer<typeof schema>;

export default function PartialProtectionQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripCosts: {
        airfare: 0,
        hotel: 0,
        cruise: 0,
        excursions: 0,
        baggageFees: 0,
        petFees: 0
      },
      protectionType: '',
      protectionProviderId: '',
      bookingDateLocal: '',
      insurancePurchaseDateLocal: '',
      cancellationReason: ''
    }
  });

  const watchAll = watch();

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(getApiUrl('tools/partial-protection/questions'));
        if (!res.ok) throw new Error("Failed to load questions");
        const data = await res.json();
        setQuizQuestions(data.sort((a: any, b: any) => a.step - b.step));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
    trackEvent('tool_view', { toolId: 'partial_protection' });
  }, []);

  const nextStep = async () => {
    const currentQ = quizQuestions[step];
    
    // Validate current field if applicable
    if (currentQ.mapsTo && currentQ.inputType !== "multi-currency") {
      const isValid = await trigger(currentQ.mapsTo as keyof FormData);
      if (!isValid) return;
    }

    if (currentQ.inputType === "multi-currency") {
        // Just trigger validation for tripCosts object
        const isValid = await trigger('tripCosts');
        if (!isValid) return;
    }

    // Check if next step is skipped by condition
    let nextIdx = step + 1;
    while (nextIdx < quizQuestions.length) {
      const q = quizQuestions[nextIdx];
      // Note: conditions might need to be evaluated based on watchAll
      if (!q.condition || q.condition(watchAll)) {
        break;
      }
      nextIdx++;
    }

    if (nextIdx < quizQuestions.length) {
      setStep(nextIdx);
    } else {
      handleSubmit(submitQuiz)();
    }
  };

  const prevStep = () => {
    let prevIdx = step - 1;
    while (prevIdx >= 0) {
      const q = quizQuestions[prevIdx];
      if (!q.condition || q.condition(watchAll)) {
        break;
      }
      prevIdx--;
    }
    if (prevIdx >= 0) setStep(prevIdx);
  };

  const submitQuiz = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setStep(99);

    const formattedAnswers = {
      ...formData,
      tripCosts: Object.fromEntries(
        Object.entries(formData.tripCosts).map(([k, v]) => [k, parseFloat(v as string) || 0])
      )
    };

    try {
      const response = await fetch(getApiUrl('tools/partial-protection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedAnswers),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Calculation failed");
      }

      const resData = await response.json();
      setResult(resData);
      
      trackEvent('tool_complete', { 
        toolId: 'partial_protection', 
        scenario: resData.output.scenario,
        outcomeRisk: resData.output.outcomeRisk 
      });

    } catch (err: any) {
      setError(err.message);
      setStep(quizQuestions.length - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
        <p className="font-bold text-foreground/40 tracking-widest text-xs uppercase">Initializing_auditor...</p>
      </div>
    );
  }

  const renderCurrentQuestion = () => {
    if (quizQuestions.length === 0) return null;
    const q = quizQuestions[step];
    
    return (
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight">{q.question}</h2>
        
        {q.inputType === "multi-currency" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {q.fields.map((field: any) => (
              <Input
                key={field.name}
                label={field.label}
                type="number"
                placeholder="0.00"
                {...register(`tripCosts.${field.name as keyof FormData['tripCosts']}` as const, { valueAsNumber: true })}
                leftIcon={<DollarSign className="w-4 h-4" />}
                className="mb-1"
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(`tripCosts.${field.name as keyof FormData['tripCosts']}` as const, val === "" ? 0 : Number(val));
                }}
              />
            ))}
          </div>
        )}

        {q.inputType === "radio" && (
          <div className="space-y-3">
            {q.options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => {
                  const val = opt.value === "true" ? true : opt.value === "false" ? false : opt.value;
                  setValue(q.mapsTo as keyof FormData, val as any);
                }}
                className={`w-full p-5 text-left rounded-button border transition-all flex items-center justify-between group ${
                  String(watchAll[q.mapsTo as keyof FormData]) === String(opt.value)
                    ? 'border-brand-primary bg-brand-primary/10 shadow-sm'
                    : 'border-border-subtle bg-background hover:border-brand-primary/30'
                }`}
              >
                <span className={`font-bold ${String(watchAll[q.mapsTo as keyof FormData]) === String(opt.value) ? 'text-brand-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
                {String(watchAll[q.mapsTo as keyof FormData]) === String(opt.value) && <CheckCircle2 className="h-5 w-5 text-brand-primary" />}
              </button>
            ))}
            {errors[q.mapsTo as keyof FormData] && (
               <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                 <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
               </p>
             )}
          </div>
        )}

        {q.inputType === "select" && (
          <div className="space-y-3">
            <select 
              {...register(q.mapsTo as keyof FormData)}
              className="w-full p-5 bg-background border border-border-subtle rounded-button font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none"
            >
              <option value="" disabled>Select Provider...</option>
              {q.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors[q.mapsTo as keyof FormData] && (
               <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                 <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
               </p>
             )}
          </div>
        )}

        {q.inputType === "date" && (
          <>
            <Input
              type="date"
              {...register(q.mapsTo as keyof FormData)}
              leftIcon={<Calendar className="w-4 h-4" />}
              className="mb-1"
            />
            {errors[q.mapsTo as keyof FormData] && (
                <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
                </p>
            )}
          </>
        )}

        <div className="mt-12 flex gap-4">
          {step > 0 && (
            <Button 
              variant="secondary"
              onClick={prevStep}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button 
            onClick={nextStep}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="flex-[2]"
          >
            {step === quizQuestions.length - 1 ? 'Calculate Protection' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-xl w-full">
        {step < 99 && (
          <div className="mb-12">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">
              <span>Step {step + 1} of {quizQuestions.length}</span>
              <span className="text-brand-primary">{Math.round(((step + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full h-1 bg-brand-secondary-low rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-700 ease-out"
                style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-brand-danger/10 border border-brand-danger/20 rounded-button text-brand-danger text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {step === 99 && isSubmitting ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
            <Loader2 className="w-16 h-16 text-brand-primary mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Running Financial Audit...</h2>
            <p className="text-sm text-foreground/40 font-bold mt-2">Reconciling category coverage triggers.</p>
          </div>
        ) : result ? (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <ToolResult result={result} />
            <div className="text-center">
              <button 
                onClick={() => { setStep(0); setResult(null); setValue('tripCosts', { airfare: '', hotel: '', cruise: '', excursions: '', baggageFees: '', petFees: '' }); setValue('protectionType', ''); setValue('protectionProviderId', ''); setValue('bookingDateLocal', ''); setValue('insurancePurchaseDateLocal', ''); setValue('cancellationReason', ''); }}
                className="text-brand-primary font-bold hover:underline"
              >
                Start New Audit
              </button>
            </div>
          </div>
        ) : (
          renderCurrentQuestion()
        )}
      </div>
    </div>
  );
}
