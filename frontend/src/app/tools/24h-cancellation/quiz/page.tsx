'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Clock, MapPin, HelpCircle, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function TwentyFourHourCancellationQuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    bookingDateTimeLocal: '',
    departureDateTimeLocal: '',
    originAirportIATA: '',
    bookingChannel: ''
  });
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [airports, setAirports] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(getApiUrl('tools/24h-cancellation/questions'))
      .then(res => res.json())
      .then(data => {
        setQuizQuestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
        setError("Failed to load quiz sequence.");
        setIsLoading(false);
      });
  }, []);

  const handleInput = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextStep = () => {
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      submitQuiz(answers.bookingChannel);
    }
  };

  const submitQuiz = async (channel: string) => {
    setIsLoading(true);
    setError(null);
    setStep(99);

    try {
      const payload = {
        bookingDateTimeLocal: new Date(answers.bookingDateTimeLocal).toISOString(),
        departureDateTimeLocal: new Date(answers.departureDateTimeLocal).toISOString(),
        originAirportIATA: answers.originAirportIATA.toUpperCase(),
        bookingChannel: channel || answers.bookingChannel
      };

      const response = await fetch(getApiUrl('tools/24h-cancellation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to calculate outcome');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setStep(quizQuestions.length - 1); // Go back to last step on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirportSearch = (query: string) => {
    setSearchQuery(query);
    if (!query || query.length < 2) {
      setAirports([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(getApiUrl(`airports/search?q=${encodeURIComponent(query)}`));
        const data = await res.json();
        setAirports(data);
        setShowDropdown(true);
      } catch (e) {
        console.error('Failed to fetch airports', e);
      }
    }, 300);
  };

  const selectAirport = (iata: string, label: string) => {
    handleInput('originAirportIATA', iata);
    setSearchQuery(label);
    setShowDropdown(false);
  };

  const renderResultIcon = (risk: string) => {
    if (risk === 'safe') return <CheckCircle2 className="h-12 w-12 text-brand-success" />;
    if (risk === 'not_applicable') return <AlertTriangle className="h-12 w-12 text-brand-warning-dark" />;
    return <HelpCircle className="h-12 w-12 text-foreground/60" />;
  };

  const renderResultColor = (risk: string) => {
    if (risk === 'safe') return 'bg-brand-success/10 border-brand-success/20 text-brand-success';
    if (risk === 'not_applicable') return 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning-dark';
    return 'bg-brand-secondary-low border-border-subtle text-foreground/60';
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
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Calculating Eligibility...</h2>
              </div>
            ) : step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center animate-in zoom-in-95 duration-500">
             <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6`}>
              {renderResultIcon(result.output.outcomeRisk)}
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">{result.storyline.headline}</h2>
            
            <div className={`mt-6 p-8 rounded-card border mb-10 text-left shadow-sm ${renderResultColor(result.output.outcomeRisk)}`}>
               <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50 text-foreground">Verdict</p>
               <p className="text-2xl font-extrabold mb-3 leading-tight">{result.storyline.verdict}</p>
               <p className="text-sm font-medium leading-relaxed opacity-90">{result.storyline.lossSummary}</p>
            </div>

            <div className="text-left bg-brand-secondary-low/30 p-8 rounded-card border border-border-subtle mb-10">
              <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4">Why this happens:</h4>
              <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-6">{result.storyline.whyThisHappens}</p>
              
              {result.storyline.whatHappensNext?.length > 0 && (
                <>
                  <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-4 mt-8">What Happens Next:</h4>
                  <ul className="space-y-3">
                    {result.storyline.whatHappensNext.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-foreground/70">
                         <div className="w-5 h-5 flex-shrink-0 bg-foreground/10 rounded-full flex items-center justify-center text-[10px] font-extrabold text-foreground">{i+1}</div>
                         {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {result.intel && (
               <div className="text-left bg-card p-8 rounded-card border border-brand-primary/20 mb-10 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 text-brand-primary group-hover:scale-110 transition-transform">
                   <ShieldCheck className="w-12 h-12" />
                 </div>
                 <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> Policy Intelligence Match
                 </h4>
                 <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-4">{result.intel.summary}</p>
                 <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Source: {result.intel.citation.source} (Verified: {result.intel.citation.verified})</p>
               </div>
            )}

            <div className="flex flex-col gap-4">
               <button onClick={() => { setStep(0); setAnswers({}); setResult(null); setSearchQuery(''); }} className="text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                 Check Another Flight
               </button>
            </div>
          </div>
        ) : step < 99 && (
          <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-10">
               <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6" />
               </div>
               <h1 className="text-xl font-extrabold text-foreground tracking-tight">24-Hour Cancellation Window</h1>
            </div>
            
            <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight leading-snug">{quizQuestions[step].question}</h2>
            
            {quizQuestions[step].inputType === 'datetime-local' && (
              <>
                <Input 
                  type="datetime-local" 
                  value={answers[quizQuestions[step].mapsTo]}
                  onChange={(e) => handleInput(quizQuestions[step].mapsTo, e.target.value)}
                  leftIcon={<Clock className="w-4 h-4" />}
                  className="mb-8"
                />
                <Button
                  disabled={!answers[quizQuestions[step].mapsTo]}
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}

            {quizQuestions[step].inputType === 'autocomplete' && (
              <>
                <div className="relative mb-8">
                  <Input 
                    type="text" 
                    placeholder={quizQuestions[step].placeholder}
                    value={searchQuery}
                    onChange={(e) => handleAirportSearch(e.target.value)}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                  {showDropdown && airports.length > 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-card border border-border-subtle rounded-card shadow-premium max-h-60 overflow-y-auto">
                      {airports.map((airport, idx) => (
                        <li 
                          key={idx} 
                          className="p-4 hover:bg-brand-primary/5 cursor-pointer border-b border-border-subtle last:border-0 font-bold text-foreground/80 hover:text-brand-primary transition-colors text-sm"
                          onClick={() => selectAirport(airport.iata, airport.label)}
                        >
                          {airport.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button
                  disabled={!answers[quizQuestions[step].mapsTo] || answers[quizQuestions[step].mapsTo].length !== 3}
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}

            {quizQuestions[step].inputType === 'radio' && quizQuestions[step].options && (
              <div className="space-y-3 mb-8">
                {quizQuestions[step].options.map((option: any) => (
                   <button
                   key={option.value}
                   onClick={() => {
                     handleInput(quizQuestions[step].mapsTo, option.value);
                     submitQuiz(option.value);
                   }}
                   className="w-full text-left p-6 rounded-button border border-border-subtle bg-background hover:border-brand-primary hover:bg-brand-primary/5 transition-all group active:scale-[0.98] shadow-sm flex items-center justify-between"
                 >
                   <span className="font-bold text-foreground group-hover:text-brand-primary transition-colors">
                     {option.label}
                   </span>
                   <ArrowRight className="h-5 w-5 text-foreground/20 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                 </button>
                ))}
              </div>
            )}
          </div>
        )}
      </>
      )}
      </div>
    </div>
  );
}
