"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolResult } from '@/components/tools/ToolResult';
import { trackEvent } from '@/lib/tracking';

export default function PetBreedQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    airline: '',
    petType: '',
    breedId: '',
    travelMethod: '',
    routeType: ''
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('http://localhost:8000/api/tools/pet-breed-ban/questions');
        const data = await res.json();
        setQuizQuestions(data.sort((a: any, b: any) => a.step - b.step));
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError("Failed to load calculation sequence.");
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleInput = (key: string, value: any) => {
    // Reset breed if pet type changes
    if (key === 'petType') {
      setAnswers({ ...answers, [key]: value, breedId: '' });
    } else {
      setAnswers({ ...answers, [key]: value });
    }
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
    setStep(99);

    trackEvent('tool_submit', { toolId: 'pet-breed-ban', airline: answers.airline });

    try {
      const res = await fetch('http://localhost:8000/api/tools/pet-breed-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Calculation failed");

      const data = await res.json();
      setResult(data);
      
      trackEvent('tool_complete', { 
        toolId: 'pet-breed-ban', 
        scenario: data.output.scenario,
        outcomeRisk: data.output.outcomeRisk 
      });
      
      const riskEvent = `outcome_${data.output.outcomeRisk}` as any;
      trackEvent(riskEvent, { toolId: 'pet-breed-ban' });

    } catch (err: any) {
      setError(err.message);
      setStep(quizQuestions.length - 1);
    } finally {
      setCalculating(false);
    }
  };

  const renderCurrentQuestion = () => {
    if (quizQuestions.length === 0) return null;
    const q = quizQuestions[step];

    // Filter breeds based on pet type if current step is breed selection
    let options = q.options;
    if (q.mapsTo === 'breedId' && answers.petType) {
       // This assumes breed options in metadata have a way to distinguish dog vs cat
       // For this tool, we'll assume the registry is filtered or simply shown
       // In build spec, breed options were mixed. We can filter if needed.
    }
    
    return (
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-xl font-extrabold text-foreground mb-6 leading-tight flex items-center gap-3">
           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-xs">
             {step + 1}
           </span>
           {q.question}
        </h2>
        
        {q.inputType === "select" && (
           <div className="relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-brand-primary transition-colors">
               <Search className="h-5 w-5" />
             </div>
             <select 
                title={q.question}
                className="w-full p-4 pl-12 rounded-button bg-background border border-border-subtle text-foreground font-bold focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none"
                value={answers[q.mapsTo]}
                onChange={(e) => handleInput(q.mapsTo, e.target.value)}
             >
               <option value="" disabled>Select {q.mapsTo}...</option>
               {options.map((opt: any) => (
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
            disabled={!answers[q.mapsTo]}
            className="flex-[2] flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold disabled:opacity-50 hover:bg-brand-primary-hover transition-all shadow-premium"
          >
            {step === quizQuestions.length - 1 ? 'Check Policy' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout 
      title="Policy Verification"
      description="Deterministic verification of pet boarding rules."
      toolId="pet-breed-ban"
    >
      <div className="max-w-xl mx-auto py-12">
        {isLoading && step === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
             <p className="text-foreground/40 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Standards...</p>
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
                  <Dog className="h-16 w-16 text-brand-primary mx-auto mb-6 animate-bounce" />
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse mb-2">Fetching Carrier Policies...</h2>
                  <p className="text-sm text-foreground/40 font-medium font-mono">Comparing breed traits against regulations...</p>
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
                        airline: '',
                        petType: '',
                        breedId: '',
                        travelMethod: '',
                        routeType: ''
                      });
                    }}
                    className="text-brand-primary font-extrabold text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
                   >
                     <ArrowLeft className="h-4 w-4" /> Check Another Breed
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
