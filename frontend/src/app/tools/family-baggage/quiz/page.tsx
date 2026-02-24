"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Briefcase, ArrowRight, ArrowLeft, Loader2, Info, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Weight, Ruler, Users, Layers, ShoppingCart, Plane, ShieldCheck } from 'lucide-react';
import { ToolResult } from '@/components/tools/ToolResult';
import { getApiUrl } from '@/lib/api-config';
import { trackEvent } from '@/lib/tracking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  airline: z.string().min(1, "Please select an airline"),
  numberOfPassengers: z.union([z.number(), z.string().length(0)]).refine(v => v !== "", "Required"),
  bagsPerPassenger: z.union([z.number(), z.string().length(0)]).refine(v => v !== "", "Required"),
  bagWeightKg: z.union([z.number(), z.string().length(0)]).refine(v => v !== "", "Required"),
  bagLinearSizeCm: z.union([z.number(), z.string().length(0)]).refine(v => v !== "", "Required"),
  routeType: z.union([z.literal("domestic"), z.literal("international")]),
  purchaseChannel: z.union([z.literal("online"), z.literal("airport")])
});

export default function FamilyBaggageQuiz() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      airline: "",
      numberOfPassengers: 1 as any,
      bagsPerPassenger: 1 as any,
      bagWeightKg: 20 as any,
      bagLinearSizeCm: 150 as any,
      routeType: "domestic",
      purchaseChannel: "online"
    }
  });

  const watchAll = watch();

  useEffect(() => {
    fetch(getApiUrl('tools/family-baggage/questions'))
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(true); // Wait for animations
        setTimeout(() => setIsLoading(false), 500);
      });
      
    trackEvent('tool_view', { toolId: 'family_baggage' });
  }, []);

  const onNext = () => setStep(s => s + 1);
  const onBack = () => setStep(s => s - 1);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    trackEvent('tool_submit', { toolId: 'family_baggage', ...data });
    
    try {
      const res = await fetch(getApiUrl('tools/family-baggage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resultData = await res.json();
      setResult(resultData);
      
      trackEvent('tool_complete', { 
        toolId: 'family_baggage', 
        scenario: resultData.output.scenario,
        outcomeRisk: resultData.output.outcomeRisk
      });

      if (resultData.output.outcomeRisk === 'safe') trackEvent('outcome_safe', { toolId: 'family_baggage' });
      if (resultData.output.outcomeRisk === 'partial_loss') trackEvent('outcome_partial_loss', { toolId: 'family_baggage' });
      if (resultData.output.outcomeRisk === 'high_cost') trackEvent('outcome_high_cost', { toolId: 'family_baggage' });
      if (resultData.output.outcomeRisk === 'cannot_determine') trackEvent('outcome_cannot_determine', { toolId: 'family_baggage' });

    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        <p className="mt-4 font-black text-foreground/20 tracking-[0.3em] text-[10px] uppercase">initializing_engine...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 animate-in zoom-in-95 duration-500">
        <ToolResult
          result={result}
        />
        <div className="mt-12 flex justify-center">
          <Button 
            onClick={() => {
              setResult(null);
              setStep(1);
            }}
            variant="secondary"
            className="px-10"
          >
            Reset Auditor
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions.find(q => q.step === step);
  if (!currentQuestion) return null;

  const getStepIcon = (mapsTo: string) => {
    switch (mapsTo) {
        case 'airline': return <Plane className="w-4 h-4" />;
        case 'numberOfPassengers': return <Users className="w-4 h-4" />;
        case 'bagsPerPassenger': return <Layers className="w-4 h-4" />;
        case 'bagWeightKg': return <Weight className="w-4 h-4" />;
        case 'bagLinearSizeCm': return <Ruler className="w-4 h-4" />;
        case 'purchaseChannel': return <ShoppingCart className="w-4 h-4" />;
        default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Step {step} of {questions.length}</span>
          </div>
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{Math.round((step / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-brand-secondary-low rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-primary transition-all duration-700 ease-out"
            style={{ width: `${(step / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-card border border-border-subtle rounded-card p-10 shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-extrabold mb-10 tracking-tight leading-tight">{currentQuestion.question}</h2>

        <div className="space-y-8">
          {currentQuestion.inputType === 'select' && (
            <div className="relative">
               <select 
                {...register(currentQuestion.mapsTo)}
                className="w-full p-5 bg-background border border-border-subtle rounded-button font-bold text-foreground focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none transition-all"
              >
                <option value="">Select Carrier...</option>
                {currentQuestion.options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          )}

          {currentQuestion.inputType === 'number' && (
            <Input 
              type="number"
              {...register(currentQuestion.mapsTo, { valueAsNumber: true })}
              placeholder={currentQuestion.placeholder}
              leftIcon={getStepIcon(currentQuestion.mapsTo)}
              onChange={(e) => {
                const val = e.target.value;
                setValue(currentQuestion.mapsTo, val === "" ? "" : Number(val));
              }}
            />
          )}

          {currentQuestion.inputType === 'radio' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue(currentQuestion.mapsTo, opt.value)}
                  className={`p-6 rounded-button border text-left transition-all font-bold flex items-center justify-between group active:scale-[0.98] ${
                    watchAll[currentQuestion.mapsTo as keyof typeof watchAll] === opt.value
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                      : 'border-border-subtle bg-background hover:border-brand-primary/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  {watchAll[currentQuestion.mapsTo as keyof typeof watchAll] === opt.value && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          )}

          {errors[currentQuestion.mapsTo as keyof typeof errors] && (
            <p className="text-xs font-black uppercase tracking-widest text-brand-danger flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
               <AlertCircle className="w-4 h-4" /> {errors[currentQuestion.mapsTo as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <Button 
            onClick={step === questions.length ? handleSubmit(onSubmit) : onNext}
            isLoading={isSubmitting}
            className="w-full"
            rightIcon={step === questions.length ? <ShieldCheck className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          >
            {step === questions.length ? 'Run Risk Audit' : 'Continue'}
          </Button>

          {step > 1 && (
            <button 
              onClick={onBack}
              className="py-4 text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-10 flex gap-4 p-6 bg-brand-secondary-low/30 rounded-card border border-border-subtle animate-in fade-in delay-500 duration-700">
        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Computational Model</h4>
          <p className="text-xs text-foreground/60 font-medium leading-relaxed">
            The baggage engine computes fees based on current airline tariffs. Mixed bag dimensions are calculated based on the standard bag entry provided. All calculations assume standard economy fares unless otherwise specified.
          </p>
        </div>
      </div>
    </div>
  );
}
