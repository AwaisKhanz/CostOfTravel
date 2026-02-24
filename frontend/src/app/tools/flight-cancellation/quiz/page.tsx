"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Calendar,
  MapPin,
  Plane
} from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolResult } from '@/components/tools/ToolResult';
import { trackEvent } from '@/lib/tracking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function FlightCancellationQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    airline: '',
    fareClassId: '',
    bookingDateTimeLocal: '',
    departureDateTimeLocal: '',
    ticketPrice: '',
    originAirportIATA: ''
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(getApiUrl('tools/flight-cancellation/questions'));
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
    setCalculating(true);
    setError(null);
    setStep(99);

    const payload = {
      ...answers,
      ticketPrice: Number(answers.ticketPrice),
      originAirportIATA: answers.originAirportIATA?.toUpperCase().trim()
    };

    trackEvent('tool_submit', { toolId: 'flight-cancellation', airline: payload.airline });

    try {
      const res = await fetch(getApiUrl('tools/flight-cancellation'), {
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
        toolId: 'flight-cancellation', 
        scenario: data.output.scenario,
        outcomeRisk: data.output.outcomeRisk 
      });
      
      const riskEvent = `outcome_${data.output.outcomeRisk}` as any;
      trackEvent(riskEvent, { toolId: 'flight-cancellation' });

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
    
    return (
      <div className="bg-card p-10 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-extrabold text-foreground mb-10 tracking-tight leading-tight flex items-center gap-4">
           <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary text-xs font-black">
             {step + 1}
           </span>
           {q.question}
        </h2>
        
        <div className="space-y-8">
          {q.inputType === "select" && (
            <div className="relative">
               <select 
                title={q.question}
                className="w-full p-5 bg-background border border-border-subtle rounded-button font-bold text-foreground focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none transition-all"
                value={answers[q.mapsTo]}
                onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              >
                <option value="">Select Carrier...</option>
                {q.options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          )}

          {q.inputType === "radio" && (
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleInput(q.mapsTo, opt.value)}
                  className={`p-6 rounded-button border text-left transition-all font-bold flex items-center justify-between group active:scale-[0.98] ${
                    answers[q.mapsTo] === opt.value
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                      : 'border-border-subtle bg-background hover:border-brand-primary/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  {answers[q.mapsTo] === opt.value && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          )}

          {q.inputType === "datetime-local" && (
            <Input 
              type="datetime-local"
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
            />
          )}

          {q.inputType === "number" && (
            <Input 
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
          )}

          {q.inputType === "text" && (
            <Input 
              type="text"
              maxLength={3}
              placeholder={q.placeholder}
              value={answers[q.mapsTo]}
              onChange={(e) => handleInput(q.mapsTo, e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              className="uppercase"
            />
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4">
          <Button 
            onClick={nextStep}
            disabled={!answers[q.mapsTo] || (q.mapsTo === 'originAirportIATA' && answers[q.mapsTo].length !== 3)}
            className="w-full"
            rightIcon={step === quizQuestions.length - 1 ? <ShieldCheck className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          >
            {step === quizQuestions.length - 1 ? 'Calculate Loss' : 'Continue'}
          </Button>

          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="py-4 text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <ToolLayout 
      title="Cancellation Review"
      description="Deterministic verification of fare recovery rules."
      toolId="flight-cancellation"
    >
      <div className="max-w-xl mx-auto py-12">
        {isLoading && step === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
             <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
             <p className="mt-4 font-black text-foreground/20 tracking-[0.3em] text-[10px] uppercase">loading_policies...</p>
          </div>
        ) : (
          <>
            {step < 99 && (
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

            {error && (
              <div className="mb-6 p-4 bg-brand-danger/10 text-brand-danger rounded-button border border-brand-danger/20 font-bold text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {step === 99 && calculating ? (
               <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
                  <Loader2 className="w-16 h-16 text-brand-primary mx-auto mb-6 animate-spin" />
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse mb-4">Reconciling Fare Data...</h2>
                  <p className="text-xs text-foreground/40 font-black uppercase tracking-widest">Applying carrier penalty rules...</p>
               </div>
            ) : result ? (
              <div className="animate-in zoom-in-95 duration-500">
                <ToolResult result={result} />
                <div className="mt-12 text-center">
                   <button 
                    onClick={() => {
                      setStep(0);
                      setResult(null);
                      setAnswers({
                        airline: '',
                        fareClassId: '',
                        bookingDateTimeLocal: '',
                        departureDateTimeLocal: '',
                        ticketPrice: '',
                        originAirportIATA: ''
                      });
                    }}
                    className="text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2 mx-auto hover:underline"
                   >
                     Check Another Flight
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
