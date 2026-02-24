"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  DollarSign,
  Users,
  Loader2,
  MapPin,
  Plane,
  Info,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  airline: z.string().min(1, "Airline is required"),
  departureDateTimeLocal: z.string().min(1, "Departure date and time is required"),
  routeType: z.string().min(1, "Route type is required"),
  hasCheckedInOnline: z.union([z.boolean(), z.string().min(1, "Required")]).refine(v => v !== null && v !== '', "Required"),
  passengerCount: z.union([z.number(), z.string().length(0)]).refine(v => v !== "", "Passenger count is required")
}).refine((data) => {
  const departureData = new Date(data.departureDateTimeLocal);
  const now = new Date();
  return departureData > now;
}, {
  message: "Departure date must be in the future",
  path: ["departureDateTimeLocal"]
});

type FormData = z.infer<typeof schema>;

export default function BudgetCheckinQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      airline: '',
      departureDateTimeLocal: '',
      routeType: '',
      hasCheckedInOnline: '' as any,
      passengerCount: '' as any
    }
  });

  const watchAll = watch();

  useEffect(() => {
    fetch(getApiUrl('tools/budget-checkin/questions'))
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.step - b.step);
        setQuizQuestions(sorted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
        setError("Failed to load quiz sequence.");
        setIsLoading(false);
      });
  }, []);

  const nextStep = async () => {
    const currentQ = quizQuestions[step];
    const field = currentQ.mapsTo as keyof FormData;
    const isValid = await trigger(field);

    if (isValid) {
      if (step < quizQuestions.length - 1) {
        setStep(step + 1);
      } else {
        handleSubmit(submitQuiz)();
      }
    }
  };

  const submitQuiz = async (formData: FormData) => {
    setCalculating(true);
    setError(null);
    setStep(99);

    try {
      const payload = {
        ...formData,
        hasCheckedInOnline: formData.hasCheckedInOnline === "true" || formData.hasCheckedInOnline === true,
        passengerCount: Number(formData.passengerCount)
      };

      const response = await fetch(getApiUrl('tools/budget-checkin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Something went wrong');
      setResult(resData);
    } catch (err: any) {
      setError(err.message);
      setStep(quizQuestions.length - 1); 
    } finally {
      setCalculating(false);
    }
  };

  const renderResultIcon = (risk: string) => {
    switch (risk) {
      case 'safe': return <CheckCircle2 className="h-12 w-12 text-brand-success" />;
      case 'fee_applies': return <AlertTriangle className="h-12 w-12 text-brand-warning-dark" />;
      case 'cannot_determine': return <AlertCircle className="h-12 w-12 text-brand-danger" />;
      default: return <ShieldCheck className="h-12 w-12 text-foreground/40" />;
    }
  };

  const renderCurrentQuestion = () => {
    if (quizQuestions.length === 0) return null;
    const q = quizQuestions[step];
    
    return (
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight leading-tight">{q.question}</h2>
        
        {q.inputType === "select" && (
           <div className="space-y-3 relative">
             <select 
                title={q.question}
                className="w-full p-5 bg-background border border-border-subtle rounded-button font-bold text-foreground focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none transition-all"
                {...register(q.mapsTo as keyof FormData)}
              >
                <option value="">Select Carrier...</option>
                {q.options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
              {errors[q.mapsTo as keyof FormData] && (
                <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
                </p>
              )}
            </div>
        )}

        {q.inputType === "radio" && (
          <div className="space-y-3">
            {q.options.map((opt: any) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    const val = opt.value === "true" ? true : opt.value === "false" ? false : opt.value;
                    setValue(q.mapsTo as keyof FormData, val as any);
                  }}
                  className={`p-6 rounded-button border text-left transition-all font-bold flex items-center justify-between group active:scale-[0.98] ${
                    String(watchAll[q.mapsTo as keyof FormData]) === String(opt.value)
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                      : 'border-border-subtle bg-background hover:border-brand-primary/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  {String(watchAll[q.mapsTo as keyof FormData]) === String(opt.value) && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
              {errors[q.mapsTo as keyof FormData] && (
                <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
                </p>
              )}
            </div>
        )}

        {q.inputType === "datetime-local" && (
          <div className="space-y-2">
            <Input 
              type="datetime-local"
              {...register(q.mapsTo as keyof FormData)}
              leftIcon={<Clock className="w-4 h-4" />}
            />
            {errors[q.mapsTo as keyof FormData] && (
                <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
                </p>
              )}
          </div>
        )}

        {q.inputType === "number" && (
          <div className="space-y-2">
              <Input 
                type="number"
                step="1"
                min="1"
                max="9"
                placeholder="1"
                {...register(q.mapsTo as keyof FormData, { valueAsNumber: true })}
                leftIcon={<Users className="w-4 h-4" />}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(q.mapsTo as keyof FormData, val === "" ? 1 : Number(val));
                }}
              />
              {errors[q.mapsTo as keyof FormData] && (
                <p className="text-brand-danger text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> {errors[q.mapsTo as keyof FormData]?.message}
                </p>
              )}
            </div>
        )}

        <div className="mt-12">
          <Button 
            onClick={nextStep}
            className="w-full"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {step === quizQuestions.length - 1 ? 'Calculate Deadline' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        {isLoading && !calculating ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
             <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
             <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Initializing Auditor...</h2>
          </div>
        ) : (
          <>
            {step < 99 && quizQuestions.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">
                  <span>Step {step + 1} of {quizQuestions.length}</span>
                  <span className="text-brand-primary">{Math.round(((step + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-brand-secondary-low h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-primary h-full transition-all duration-700 ease-out"
                    style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {error && <div className="mb-6 p-4 bg-brand-danger/10 text-brand-danger rounded-button border border-brand-danger/20 font-bold text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

            {step === 99 && calculating ? (
              <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
                <Loader2 className="w-16 h-16 text-brand-primary mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Checking Deadlines...</h2>
              </div>
            ) : step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center animate-in zoom-in-95 duration-500">
             <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6`}>
              {renderResultIcon(result.output.outcomeRisk)}
            </div>
            
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
              {result.storyline.headline}
            </h2>
            <p className="text-xl font-bold text-foreground mb-2">
              {result.storyline.verdict}
            </p>
            <p className={`font-extrabold text-2xl mb-6 ${result.output.feeApplies ? 'text-brand-danger' : 'text-brand-success'}`}>
              {result.storyline.lossSummary}
            </p>
            
            <div className="bg-brand-secondary-low/30 p-8 rounded-card text-left mb-8 border border-border-subtle relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-brand-primary group-hover:scale-110 transition-transform">
                <Clock className="w-12 h-12" />
              </div>
              <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Clock className="h-4 w-4" /> Deadline Enforcement
              </h3>
              <p className="text-foreground/80 text-sm font-medium leading-relaxed mb-6">
                {result.storyline.whyThisHappens}
              </p>
              
              {result.output.outcomeRisk === "safe" && !result.output.hasCheckedInOnline && (
                 <div className="mt-4 p-4 bg-brand-success/10 border border-brand-success/20 rounded-button flex items-start gap-3">
                   <ShieldCheck className="h-5 w-5 text-brand-success flex-shrink-0 mt-0.5" />
                   <div>
                      <p className="font-bold text-brand-success text-sm">Action Required</p>
                      <p className="text-brand-success/80 text-xs mt-1">
                         You have approximately {Math.floor(result.output.hoursRemaining)} hours left to check in for free. 
                      </p>
                   </div>
                 </div>
              )}
            </div>

            <div className="text-left border-t border-border-subtle pt-8">
               <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4">What happens next</h3>
               <ul className="space-y-4">
                 {result.storyline.whatHappensNext.map((stepItem: string, i: number) => (
                   <li key={i} className="flex gap-3 text-foreground/80 text-sm font-medium">
                     <div className="bg-foreground/10 text-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-extrabold text-[10px]">
                       {i + 1}
                     </div>
                     <span className="mt-0.5">{stepItem}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {result.intel && (
              <div className="mt-10 p-6 bg-card border border-brand-primary/20 rounded-card text-left shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-primary group-hover:scale-110 transition-transform">
                   <ShieldCheck className="w-12 h-12" />
                 </div>
                 <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> Policy Insight
                 </p>
                 <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-4">{result.intel.summary}</p>
                 <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Source: {result.intel.citation.source} • Verified: {result.intel.citation.verified}</p>
              </div>
            )}

            <button                    onClick={() => {
                      setStep(0);
                      setResult(null);
                      setValue('airline', '');
                      setValue('hasCheckedInOnline', '' as any);
                      setValue('passengerCount', '' as any);
                      setValue('departureDateTimeLocal', '');
                      setValue('routeType', '');
                    }}
className="mt-10 text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors hover:underline"
            >
              Check Another Flight
            </button>
          </div>
            ) : (
              renderCurrentQuestion()
            )}
          </>
        )}
      </div>
    </div>
  );
}
