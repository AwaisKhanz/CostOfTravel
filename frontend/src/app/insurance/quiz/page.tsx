'use client';

import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function InsuranceQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ status: string; desc: string; variant: 'success' | 'warning' | 'danger' } | null>(null);

  const questions = [
    {
      id: 'timing',
      text: 'When did you book your trip?',
      options: [
        { label: 'Less than 14 days ago', value: 'recent' },
        { label: 'More than 14 days ago', value: 'old' }
      ]
    },
    {
      id: 'reason',
      text: 'What is the primary reason for your concern?',
      options: [
        { label: 'Illness or Injury', value: 'medical' },
        { label: 'Work Conflict', value: 'work' },
        { label: 'Carrier Cancellation', value: 'carrier' },
        { label: 'Bad Weather', value: 'weather' }
      ]
    },
    {
      id: 'preexisting',
      text: 'Is this related to a condition you had before booking?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
    }
  ];

  const handleAnswer = (val: string) => {
    const newAnswers = { ...answers, [questions[step].id]: val };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(99); // Results step
      setResult(calculateResult(newAnswers));
    }
  };

  const calculateResult = (ans: Record<string, string>) => {
    if (ans.preexisting === 'yes') return { status: 'High Risk', desc: 'Pre-existing conditions are often excluded unless a waiver was purchased within the first 14-21 days of booking.', variant: 'danger' as const };
    if (ans.reason === 'work') return { status: 'Conditional', desc: 'Work-related cancellations usually require a specific "Cancel for Work Reason" rider.', variant: 'warning' as const };
    return { status: 'Likely Covered', desc: 'Standard trip cancellation insurance typically covers unforeseen medical issues and severe weather.', variant: 'success' as const };
  };

  const variantStyles = {
    success: 'bg-brand-success/10 border-brand-success/20 text-brand-success',
    warning: 'bg-brand-warning/10 border-brand-warning/20 text-brand-warning-dark',
    danger: 'bg-brand-danger/10 border-brand-danger/20 text-brand-danger',
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="mb-12">
          <div className="flex justify-between text-xs font-extrabold text-foreground/40 mb-3 uppercase tracking-[0.2em]">
            <span>Question {Math.min(step + 1, questions.length)} of {questions.length}</span>
            <span>{Math.round((Math.min(step + 1, questions.length) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-brand-secondary-low h-2.5 rounded-full overflow-hidden border border-border-subtle shadow-inner">
            <div 
              className="bg-brand-primary h-full transition-all duration-700 rounded-full"
              style={{ width: `${(Math.min(step + 1, questions.length) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {step === 99 && result ? (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
            <div className={`inline-flex p-5 rounded-full mb-8 ${variantStyles[result.variant]}`}>
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">Intelligence Report</h2>
            
            <div className={`mt-6 p-8 rounded-2xl border mb-10 text-left ${variantStyles[result.variant]}`}>
               <p className="text-xs font-extrabold uppercase tracking-widest mb-2">Verdict</p>
               <p className="text-2xl font-extrabold mb-3">{result.status}</p>
               <p className="text-sm font-medium leading-relaxed opacity-90">{result.desc}</p>
            </div>

            <div className="flex flex-col gap-4">
               <Link href="/tools/insurance-eligibility" className="bg-brand-primary text-on-brand-primary font-extrabold py-5 rounded-button hover:bg-brand-primary-hover shadow-premium transition-all active:scale-95 text-center">
                 Open Detailed Claim Engine
               </Link>
               <button onClick={() => { setStep(0); setAnswers({}); setResult(null); }} className="text-foreground/40 font-bold text-sm hover:text-brand-primary transition-colors flex items-center justify-center gap-2">
                 Restart Analysis
               </button>
            </div>
          </div>
        ) : (
          <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium">
            <div className="flex items-center gap-3 mb-8">
               <ShieldCheck className="h-8 w-8 text-brand-primary" />
               <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Qualification Engine</h1>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-10 leading-snug">
              {questions[step].text}
            </h2>

            <div className="space-y-4">
              {questions[step].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left p-6 rounded-button border border-border-subtle bg-card hover:border-brand-primary hover-brand-primary-surface transition-all group active:scale-[0.98] shadow-sm flex items-center justify-between"
                >
                  <span className="font-bold text-foreground group-hover:text-brand-primary transition-colors">
                    {option.label}
                  </span>
                  <ArrowRight className="h-5 w-5 text-foreground/20 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
