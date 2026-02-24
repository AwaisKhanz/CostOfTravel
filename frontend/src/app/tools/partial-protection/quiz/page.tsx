"use client";

import React, { useState, useEffect } from 'react';
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

export default function PartialProtectionQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    tripCosts: {
      airfare: '',
      hotel: '',
      cruise: '',
      excursions: '',
      baggageFees: '',
      petFees: ''
    },
    protectionType: '',
    protectionProviderId: '',
    bookingDateLocal: '',
    insurancePurchaseDateLocal: '',
    cancellationReason: ''
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleInput = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleCostInput = (category: string, value: string) => {
    setAnswers({
      ...answers,
      tripCosts: {
        ...answers.tripCosts,
        [category]: value
      }
    });
  };

  const nextStep = () => {
    const currentQ = quizQuestions[step];
    
    // Check if next step is skipped by condition
    let nextIdx = step + 1;
    while (nextIdx < quizQuestions.length) {
      const q = quizQuestions[nextIdx];
      if (!q.condition || q.condition(answers)) {
        break;
      }
      nextIdx++;
    }

    if (nextIdx < quizQuestions.length) {
      setStep(nextIdx);
    } else {
      submitQuiz();
    }
  };

  const prevStep = () => {
    let prevIdx = step - 1;
    while (prevIdx >= 0) {
      const q = quizQuestions[prevIdx];
      if (!q.condition || q.condition(answers)) {
        break;
      }
      prevIdx--;
    }
    if (prevIdx >= 0) setStep(prevIdx);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    setError(null);
    setStep(99);

    const formattedAnswers = {
      ...answers,
      tripCosts: Object.fromEntries(
        Object.entries(answers.tripCosts).map(([k, v]) => [k, parseFloat(v as string) || 0])
      )
    };

    try {
      const res = await fetch(getApiUrl('tools/partial-protection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedAnswers),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Calculation failed");
      }

      const data = await res.json();
      setResult(data);
      
      trackEvent('tool_complete', { 
        toolId: 'partial_protection', 
        scenario: data.output.scenario,
        outcomeRisk: data.output.outcomeRisk 
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
                value={answers.tripCosts[field.name]}
                onChange={(e) => handleCostInput(field.name, e.target.value)}
                leftIcon={<DollarSign className="w-4 h-4" />}
              />
            ))}
          </div>
        )}

        {q.inputType === "radio" && (
          <div className="space-y-3">
            {q.options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => handleInput(q.mapsTo, opt.value)}
                className={`w-full p-5 text-left rounded-button border transition-all flex items-center justify-between group ${
                  answers[q.mapsTo] === opt.value
                    ? 'border-brand-primary bg-brand-primary/10 shadow-sm'
                    : 'border-border-subtle bg-background hover:border-brand-primary/30'
                }`}
              >
                <span className={`font-bold ${answers[q.mapsTo] === opt.value ? 'text-brand-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
                {answers[q.mapsTo] === opt.value && <CheckCircle2 className="h-5 w-5 text-brand-primary" />}
              </button>
            ))}
          </div>
        )}

        {q.inputType === "select" && (
          <div className="space-y-3">
            <select 
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              className="w-full p-5 bg-background border border-border-subtle rounded-button font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none"
            >
              <option value="" disabled>Select Provider...</option>
              {q.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {q.inputType === "date" && (
          <Input
            type="date"
            value={answers[q.mapsTo]}
            onChange={(e) => handleInput(q.mapsTo, e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
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
            disabled={!answers[q.mapsTo] && q.inputType !== "multi-currency"}
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
                onClick={() => { setStep(0); setResult(null); }}
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
