"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Loader2, DollarSign, Calendar } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CruisePenaltyQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    cruiseLine: '',
    sailDateLocal: '',
    cancellationDateLocal: '',
    totalTripCost: '',
    fareType: ''
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(getApiUrl('tools/cruise-penalty/questions'))
      .then(res => res.json())
      .then(data => {
         // Sort by step just to be safe
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

  const handleInput = (key: string, value: string | number) => {
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
    setStep(99); // processing state
    setError(null);

    try {
      // Cast trip cost to number to enforce type safety per spec
      const payload = {
        ...answers,
        totalTripCost: Number(answers.totalTripCost)
      };

      const res = await fetch(getApiUrl('tools/cruise-penalty'), {
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
      setStep(quizQuestions.length - 1); // go back to last step
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultIcon = (risk: string) => {
    switch (risk) {
      case 'safe': return <CheckCircle2 className="h-12 w-12 text-brand-success" />;
      case 'partial_loss': return <AlertTriangle className="h-12 w-12 text-brand-warning-dark" />;
      case 'full_loss': return <AlertCircle className="h-12 w-12 text-brand-danger" />;
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
           <div className="space-y-3">
             <select 
                title={q.question}
                className="w-full p-5 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all appearance-none"
                value={answers[q.mapsTo]}
                onChange={(e) => handleInput(q.mapsTo, e.target.value)}
             >
               <option value="" disabled>Select Cruise Line...</option>
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

        {q.inputType === "date" && (
          <Input 
            type="date"
            value={answers[q.mapsTo]}
            onChange={(e) => handleInput(q.mapsTo, e.target.value)}
            error={q.validation}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        )}

        {q.inputType === "currency" && (
          <Input 
            type="number"
            placeholder="0.00"
            value={answers[q.mapsTo]}
            onChange={(e) => handleInput(q.mapsTo, e.target.value)}
            leftIcon={<DollarSign className="w-4 h-4" />}
          />
        )}

        <div className="mt-12">
          <Button 
            onClick={nextStep}
            disabled={!answers[q.mapsTo]}
            className="w-full"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {step === quizQuestions.length - 1 ? 'Calculate Penalty' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        {isLoading && step === 0 ? (
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

            {step === 99 && isLoading ? (
              <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
                <Loader2 className="w-16 h-16 text-brand-primary mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Calculating Schedule...</h2>
              </div>
            ) : step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center animate-in zoom-in-95 duration-500">
             <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6`}>
              {renderResultIcon(result.output.outcomeRisk)}
            </div>
            
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
              {result.storyline.headline}
            </h2>
            <p className="text-xl font-bold text-foreground mb-2">
              {result.storyline.verdict}
            </p>
            <p className="text-brand-danger font-extrabold text-2xl mb-6">
              {result.storyline.lossSummary}
            </p>
            
            <div className="bg-brand-secondary-low/30 p-8 rounded-card text-left mb-8 border border-border-subtle relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-brand-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4" /> How this was calculated
              </h3>
              <p className="text-foreground/80 text-sm font-medium leading-relaxed mb-6">
                {result.storyline.whyThisHappens}
              </p>
              
               {/* NEXT CLIFF INSIGHT UI */}
              {result.output.nextPenaltyCliffPercent && (
                 <div className="mt-4 p-4 bg-brand-warning-dark/10 border border-brand-warning-dark/20 rounded-button flex items-start gap-3">
                   <TrendingUp className="h-5 w-5 text-brand-warning-dark flex-shrink-0 mt-0.5" />
                   <div>
                      <p className="font-bold text-brand-warning-dark text-sm">Upcoming Penalty Increase</p>
                      <p className="text-brand-warning-dark/80 text-xs mt-1">
                         Your penalty increases to {result.output.nextPenaltyCliffPercent}% in {result.output.daysUntilNextCliff} days.
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

            <button 
              onClick={() => {
                setStep(0);
                setResult(null);
                setAnswers({ cruiseLine: '', sailDateLocal: '', cancellationDateLocal: '', totalTripCost: '', fareType: '' });
              }}
              className="mt-10 text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors hover:underline"
            >
              Check Another Cruise
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
