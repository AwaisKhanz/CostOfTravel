'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

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
    fetch('http://localhost:8000/api/tools/24h-cancellation/questions')
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

      const response = await fetch('http://localhost:8000/api/tools/24h-cancellation', {
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
        const res = await fetch(`http://localhost:8000/api/airports/search?q=${encodeURIComponent(query)}`);
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
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight animate-pulse">Calculating Eligibility...</h2>
              </div>
            ) : step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
             <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6`}>
              {renderResultIcon(result.output.outcomeRisk)}
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">{result.storyline.headline}</h2>
            
            <div className={`mt-6 p-8 rounded-2xl border mb-10 text-left ${renderResultColor(result.output.outcomeRisk)}`}>
               <p className="text-xs font-extrabold uppercase tracking-widest mb-2">Verdict</p>
               <p className="text-2xl font-extrabold mb-3">{result.storyline.verdict}</p>
               <p className="text-sm font-medium leading-relaxed opacity-90">{result.storyline.lossSummary}</p>
            </div>

            <div className="text-left bg-brand-secondary-low p-6 rounded-2xl border border-border-subtle mb-10">
              <h4 className="text-sm font-extrabold text-foreground mb-2">Why this happens:</h4>
              <p className="text-sm text-foreground/60 font-medium mb-4">{result.storyline.whyThisHappens}</p>
              
              {result.storyline.whatHappensNext?.length > 0 && (
                <>
                  <h4 className="text-sm font-extrabold text-foreground mb-2 mt-6">What Happens Next:</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    {result.storyline.whatHappensNext.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-foreground/60 font-medium">{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {result.intel && (
               <div className="text-left bg-card p-6 rounded-2xl border border-border-subtle mb-10 shadow-sm">
                 <h4 className="text-sm font-extrabold text-brand-primary mb-2 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> Policy Intelligence Match
                 </h4>
                 <p className="text-sm text-foreground/80 font-medium mb-2">{result.intel.summary}</p>
                 <p className="text-xs text-foreground/40 font-mono">Source: {result.intel.citation.source} (Verified: {result.intel.citation.verified})</p>
               </div>
            )}

            <div className="flex flex-col gap-4">
               <button onClick={() => { setStep(0); setAnswers({}); setResult(null); setSearchQuery(''); }} className="text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                 Check Another Flight
               </button>
            </div>
          </div>
        ) : step < 99 && (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium">
            <div className="flex items-center gap-3 mb-8">
               <ShieldCheck className="h-8 w-8 text-brand-primary" />
               <h1 className="text-2xl font-extrabold text-foreground tracking-tight">24-Hour Cancellation Window</h1>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-6 leading-snug">{quizQuestions[step].question}</h2>
            
            {quizQuestions[step].inputType === 'datetime-local' && (
              <>
                <input 
                  type="datetime-local" 
                  value={answers[quizQuestions[step].mapsTo]}
                  onChange={(e) => handleInput(quizQuestions[step].mapsTo, e.target.value)}
                  className="w-full p-4 bg-brand-secondary-low border border-border-subtle rounded-button focus:ring-2 focus:ring-brand-primary transition-all font-mono font-bold text-foreground mb-8" 
                />
                <button
                  disabled={!answers[quizQuestions[step].mapsTo]}
                  onClick={nextStep}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold disabled:opacity-50 hover:bg-brand-primary-hover transition-all shadow-premium"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {quizQuestions[step].inputType === 'autocomplete' && (
              <>
                <div className="relative mb-8">
                  <input 
                    type="text" 
                    placeholder={quizQuestions[step].placeholder}
                    value={searchQuery}
                    onChange={(e) => handleAirportSearch(e.target.value)}
                    className="w-full p-4 bg-brand-secondary-low border border-border-subtle rounded-button focus:ring-2 focus:ring-brand-primary transition-all font-mono font-bold text-foreground" 
                  />
                  {showDropdown && airports.length > 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-card border border-border-subtle rounded-xl shadow-premium max-h-60 overflow-y-auto">
                      {airports.map((airport, idx) => (
                        <li 
                          key={idx} 
                          className="p-4 hover-brand-primary-surface cursor-pointer border-b border-border-subtle last:border-0 font-bold text-foreground/80 hover:text-brand-primary transition-colors"
                          onClick={() => selectAirport(airport.iata, airport.label)}
                        >
                          {airport.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  disabled={!answers[quizQuestions[step].mapsTo] || answers[quizQuestions[step].mapsTo].length !== 3}
                  onClick={nextStep}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold disabled:opacity-50 hover:bg-brand-primary-hover transition-all shadow-premium"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {quizQuestions[step].inputType === 'radio' && quizQuestions[step].options && (
              <div className="space-y-4 mb-8">
                {quizQuestions[step].options.map((option: any) => (
                   <button
                   key={option.value}
                   onClick={() => {
                     handleInput(quizQuestions[step].mapsTo, option.value);
                     submitQuiz(option.value);
                   }}
                   className="w-full text-left p-6 rounded-button border border-border-subtle bg-card hover:border-brand-primary hover-brand-primary-surface transition-all group active:scale-[0.98] shadow-sm flex items-center justify-between"
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
