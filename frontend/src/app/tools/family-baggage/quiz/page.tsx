"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Briefcase, ArrowRight, ArrowLeft, Loader2, Info, CheckCircle2, AlertTriangle, XOctagon, HelpCircle } from 'lucide-react';
import { ToolResult } from '@/components/tools/ToolResult';
import { getApiUrl } from '@/lib/api-config';
import { trackEvent } from '@/lib/tracking';

const schema = z.object({
  airline: z.string().min(1, "Please select an airline"),
  numberOfPassengers: z.number().min(1, "Minimum 1 passenger required"),
  bagsPerPassenger: z.number().min(0, "Cannot be negative"),
  bagWeightKg: z.number().min(0, "Weight cannot be negative"),
  bagLinearSizeCm: z.number().min(0, "Size cannot be negative"),
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
      numberOfPassengers: 1,
      bagsPerPassenger: 1,
      bagWeightKg: 20,
      bagLinearSizeCm: 150,
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
        <p className="mt-4 font-bold text-foreground/50 tracking-widest text-xs uppercase">initializing_engine...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <ToolResult
          result={result}
        />
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => {
              setResult(null);
              setStep(1);
            }}
            className="px-8 py-4 bg-brand-secondary-low text-foreground rounded-button font-bold hover:bg-brand-secondary hover:text-on-brand-secondary transition-all"
          >
            Reset Auditor
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions.find(q => q.step === step);
  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Step {step} of {questions.length}</span>
        </div>
        <div className="w-full h-1.5 bg-brand-secondary-low rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-card border border-border-subtle rounded-card p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight">{currentQuestion.question}</h2>

        <div className="space-y-6">
          {currentQuestion.inputType === 'select' && (
            <select 
              {...register(currentQuestion.mapsTo)}
              className="w-full p-4 bg-background border border-border-subtle rounded-button font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none"
            >
              <option value="">Select Airline...</option>
              {currentQuestion.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {currentQuestion.inputType === 'number' && (
            <input 
              type="number"
              {...register(currentQuestion.mapsTo, { valueAsNumber: true })}
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 bg-background border border-border-subtle rounded-button font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none"
            />
          )}

          {currentQuestion.inputType === 'radio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue(currentQuestion.mapsTo, opt.value)}
                  className={`p-4 rounded-button border text-left transition-all font-bold ${
                    watchAll[currentQuestion.mapsTo as keyof typeof watchAll] === opt.value
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                      : 'border-border-subtle bg-card hover:border-brand-primary/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {errors[currentQuestion.mapsTo as keyof typeof errors] && (
            <p className="text-sm font-bold text-brand-danger flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" /> {errors[currentQuestion.mapsTo as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>

        <div className="mt-12 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-foreground/40 font-bold hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          
          <button 
            onClick={step === questions.length ? handleSubmit(onSubmit) : onNext}
            disabled={isSubmitting}
            className="px-8 py-4 bg-brand-primary text-on-brand-primary rounded-button font-extrabold shadow-premium hover:bg-brand-primary-hover transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {step === questions.length ? 'Run Risk Audit' : 'Next Step'} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4 p-4 bg-brand-secondary-low rounded-xl border border-border-subtle">
        <Info className="w-5 h-5 text-brand-primary flex-shrink-0" />
        <p className="text-xs text-foreground/50 font-medium leading-relaxed">
          The baggage engine computes fees based on current airline tariffs. Mixed bag dimensions are calculated based on the standard bag entry provided. All calculations assume standard economy fares unless otherwise specified.
        </p>
      </div>
    </div>
  );
}
