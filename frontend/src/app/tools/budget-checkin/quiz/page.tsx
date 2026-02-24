"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';

export default function BudgetCheckinQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    airline: '',
    departureDateTimeLocal: '',
    routeType: '',
    hasCheckedInOnline: '',
    passengerCount: 1
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleInput = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => {
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    setStep(99); 
    setError(null);

    try {
      const payload = {
        ...answers,
        hasCheckedInOnline: answers.hasCheckedInOnline === "true",
        passengerCount: Number(answers.passengerCount)
      };

      const res = await fetch(getApiUrl('tools/budget-checkin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setStep(quizQuestions.length - 1); 
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-extrabold text-foreground mb-6 leading-tight">{q.question}</h2>
        
        {q.inputType === "select" && (
           <div className="space-y-3">
             <select 
                title={q.question}
                className="w-full p-4 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                value={answers[q.mapsTo]}
                onChange={(e) => handleInput(q.mapsTo, e.target.value)}
             >
               <option value="" disabled>Select an option...</option>
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
                  className={`w-full p-5 text-left rounded-button border transition-all ${
                  answers[q.mapsTo] === opt.value
                    ? 'border-brand-primary bg-brand-primary/10 shadow-sm'
                    : 'border-border-subtle bg-background hover:border-brand-primary/30'
                  }`}
               >
                 <span className={`font-bold ${answers[q.mapsTo] === opt.value ? 'text-brand-primary' : 'text-foreground'}`}>
                   {opt.label}
                 </span>
               </button>
            ))}
          </div>
        )}

        {q.inputType === "datetime-local" && (
          <div className="space-y-4">
            <input 
              type="datetime-local"
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
              min="1"
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

        <div className="mt-8">
          <button 
            onClick={nextStep}
            disabled={!answers[q.mapsTo]}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold disabled:opacity-50 hover:bg-brand-primary-hover transition-all shadow-premium"
          >
            {step === quizQuestions.length - 1 ? 'Calculate Deadline' : 'Next Step'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        {isLoading && step === 0 ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
             <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Loading Quiz...</h2>
          </div>
        ) : (
          <>
            {step < 99 && quizQuestions.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between text-xs font-extrabold text-foreground/40 mb-3 uppercase tracking-[0.2em]">
                  <span>Step {step + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((step) / quizQuestions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-brand-secondary-low h-2.5 rounded-full overflow-hidden border border-border-subtle shadow-inner">
                  <div 
                    className="bg-brand-primary h-full transition-all duration-700 rounded-full"
                    style={{ width: `${((step) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {error && <div className="mb-6 p-4 bg-brand-danger/10 text-brand-danger rounded-button border border-brand-danger/20 font-bold">{error}</div>}

            {step === 99 && isLoading ? (
              <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Checking Deadlines...</h2>
              </div>
            ) : step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
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
            
            <div className="bg-brand-secondary-low p-6 rounded-button text-left mb-8 border border-border-subtle">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                 <Clock className="h-5 w-5 text-brand-primary" />
                 Deadline Enforcement
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                {result.storyline.whyThisHappens}
              </p>
              
              {result.output.outcomeRisk === "safe" && !result.output.hasCheckedIn && (
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

            <div className="text-left border-t border-border-subtle pt-6">
               <h3 className="font-bold text-foreground mb-4">What happens next</h3>
               <ul className="space-y-3">
                 {result.storyline.whatHappensNext.map((stepItem: string, i: number) => (
                   <li key={i} className="flex gap-3 text-foreground/80 text-sm">
                     <div className="bg-brand-primary/10 text-brand-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                       {i + 1}
                     </div>
                     <span className="mt-0.5">{stepItem}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {result.intel && (
              <div className="mt-8 p-4 bg-background border border-border-subtle rounded-button text-left">
                <p className="font-bold text-foreground mb-1 text-sm">Policy Insight</p>
                 <p className="text-foreground/60 text-xs mb-3">{result.intel.summary}</p>
                 <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-wider">Source: {result.intel.citation.source} • Verified: {result.intel.citation.verified}</p>
              </div>
            )}

            <button 
              onClick={() => {
                setStep(0);
                setResult(null);
                setAnswers({ airline: '', departureDateTimeLocal: '', routeType: '', hasCheckedInOnline: '', passengerCount: 1 });
              }}
              className="mt-8 text-brand-primary font-bold hover:underline"
            >
              Start Over
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
