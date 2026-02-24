"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Clock, Baby, ArrowLeft, XCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolResult } from '@/components/tools/ToolResult';
import { trackEvent } from '@/lib/tracking';

export default function PregnancyQuizPage() {
  const router = useRouter();
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    transportType: '',
    carrier: '',
    departureDateLocal: '',
    weeksPregnantAtDeparture: 0,
    isMultiplePregnancy: false,
    hasMedicalCertificate: false
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(getApiUrl('tools/pregnancy-cutoff/questions'));
        const data = await res.json();
        setQuizQuestions(data.sort((a: any, b: any) => a.step - b.step));
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError("Failed to load eligibility sequence.");
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleInput = (key: string, value: any) => {
    // Handle boolean strings from radio buttons
    let finalValue = value;
    if (value === "true") finalValue = true;
    if (value === "false") finalValue = false;
    
    setAnswers({ ...answers, [key]: finalValue });
  };

  const nextStep = () => {
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setCalculating(true);
    setError(null);
    setStep(99); // Transition to calculation state

    const payload = {
      ...answers,
      weeksPregnantAtDeparture: Number(answers.weeksPregnantAtDeparture)
    };

    trackEvent('tool_submit', { toolId: 'pregnancy-cutoff', carrier: payload.carrier });

    try {
      const res = await fetch(getApiUrl('tools/pregnancy-cutoff'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Calculation failed");
      }

      const data = await res.json();
      setResult(data);
      
      trackEvent('tool_complete', { 
        toolId: 'pregnancy-cutoff', 
        scenario: data.output.scenario,
        outcomeRisk: data.output.outcomeRisk 
      });
      
      const riskEvent = `outcome_${data.output.outcomeRisk}` as any;
      trackEvent(riskEvent, { toolId: 'pregnancy-cutoff' });

    } catch (err: any) {
      console.error('Calculation failed:', err);
      setError(err.message);
      setStep(quizQuestions.length - 1);
    } finally {
      setCalculating(false);
    }
  };

  const renderCurrentQuestion = () => {
    if (quizQuestions.length === 0) return null;
    const q = quizQuestions[step];
    
    return (
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-extrabold text-foreground mb-6 leading-tight flex items-center gap-3">
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-xs">
             {step + 1}
           </span>
           {q.question}
        </h2>
        
        {q.inputType === "select" && (
           <div className="space-y-3">
             <select 
                title={q.question}
                className="w-full p-4 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                value={answers[q.mapsTo]}
                onChange={(e) => handleInput(q.mapsTo, e.target.value)}
             >
               <option value="" disabled>Select carrier...</option>
               {q.options.map((opt: any) => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
               ))}
             </select>
           </div>
        )}

        {q.inputType === "radio" && (
          <div className="space-y-3">
            {q.options.map((opt: any) => (
               <button
                  key={opt.value}
                  onClick={() => handleInput(q.mapsTo, opt.value)}
                  className={`w-full p-5 text-left rounded-button border transition-all flex items-center justify-between group ${
                  String(answers[q.mapsTo]) === opt.value
                    ? 'border-brand-primary bg-brand-primary/10 shadow-sm'
                    : 'border-border-subtle bg-background hover:border-brand-primary/30'
                  }`}
               >
                 <span className={`font-bold ${String(answers[q.mapsTo]) === opt.value ? 'text-brand-primary' : 'text-foreground'}`}>
                   {opt.label}
                 </span>
                 {String(answers[q.mapsTo]) === opt.value && <CheckCircle2 className="h-5 w-5 text-brand-primary" />}
               </button>
            ))}
          </div>
        )}

        {q.inputType === "datetime-local" && (
          <div className="space-y-4">
            <input 
              type="date"
              title={q.question}
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              className="w-full p-4 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
        )}

        {q.inputType === "number" && (
          <div className="space-y-4">
            <input 
              type="number"
              min="0"
              max="45"
              title={q.question}
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              className="w-full p-4 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
             {q.validation && (
              <p className="text-xs text-foreground/40 font-bold">{q.validation}</p>
            )}
          </div>
        )}

        <div className="mt-10 flex gap-4">
          {step > 0 && (
             <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 flex items-center justify-center gap-2 p-4 rounded-button bg-brand-secondary text-on-brand-secondary font-extrabold hover:bg-brand-secondary-hover transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button 
            onClick={nextStep}
            disabled={answers[q.mapsTo] === '' || (q.inputType === 'select' && !answers[q.mapsTo])}
            className="flex-[2] flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold disabled:opacity-50 hover:bg-brand-primary-hover transition-all shadow-premium"
          >
            {step === quizQuestions.length - 1 ? 'Verify Eligibility' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout 
      title="Eligibility Quiz"
      description="Deterministic policy checking for pregnancy travel."
      toolId="pregnancy-cutoff"
    >
      <div className="max-w-xl mx-auto py-12">
        {isLoading && step === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
             <p className="text-foreground/40 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Scenarios...</p>
          </div>
        ) : (
          <>
            {step < 99 && (
              <div className="mb-10">
                <div className="flex justify-between text-[10px] font-extrabold text-foreground/40 mb-3 uppercase tracking-[0.2em]">
                  <span>Step {step + 1} of {quizQuestions.length}</span>
                  <span className="text-brand-primary">{Math.round(((step + 1) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-brand-secondary-low h-1.5 rounded-full overflow-hidden border border-border-subtle">
                  <div 
                    className="bg-brand-primary h-full transition-all duration-700 ease-out"
                    style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-brand-danger/10 text-brand-danger rounded-button border border-brand-danger/20 font-bold text-sm flex items-center gap-3">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {step === 99 && calculating ? (
               <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
                  <Baby className="h-16 w-16 text-brand-primary mx-auto mb-6 animate-bounce" />
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse mb-2">Analyzing Carrier Rules...</h2>
                  <p className="text-sm text-foreground/40 font-medium font-mono">Running deterministic scenario mapping...</p>
               </div>
            ) : result ? (
              <div className="animate-in zoom-in-95 duration-500">
                <ToolResult result={result} />
                <div className="mt-8 text-center">
                   <button 
                    onClick={() => {
                      setStep(0);
                      setResult(null);
                      setAnswers({
                        transportType: '',
                        carrier: '',
                        departureDateLocal: '',
                        weeksPregnantAtDeparture: 0,
                        isMultiplePregnancy: false,
                        hasMedicalCertificate: false
                      });
                    }}
                    className="text-brand-primary font-extrabold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
                   >
                     <ArrowLeft className="h-4 w-4" /> Start New Eligibility Check
                   </button>
                </div>
              </div>
            ) : (
              renderCurrentQuestion()
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
