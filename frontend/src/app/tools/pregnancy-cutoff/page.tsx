import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Baby, AlertTriangle, FileCheck, Stethoscope } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function PregnancyCutoffLanding() {
  return (
    <ToolLayout 
      title="Pregnancy Travel Cutoff" 
      description="Calculate boarding eligibility and documentation cliffs."
      toolId="pregnancy-cutoff"
    >
      <SchemaMarkup 
        title="Pregnancy Travel Cutoff Calculator | Cost of Travel"
        description="Deterministic airline and cruise pregnancy policies. Calculate boarding eligibility and documentation requirements."
        url="https://costoftravel.com/tools/pregnancy-cutoff"
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <Baby className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
            Pregnancy Travel Cutoff Calculator
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Deterministic eligibility checks for air and ocean travel. Verified against current carrier contract of carriage policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-premium transition-all text-center">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary w-fit mx-auto mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deterministic</h3>
            <p className="text-sm text-foreground/60 font-medium">Built on hard carrier policy data, not medical guesses.</p>
          </div>
          <div className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-premium transition-all text-center">
            <div className="p-3 bg-brand-warning/10 rounded-xl text-brand-warning w-fit mx-auto mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Policy-Driven</h3>
            <p className="text-sm text-foreground/60 font-medium">Detects documentation cliffs and absolute cutoff windows.</p>
          </div>
          <div className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-premium transition-all text-center">
            <div className="p-3 bg-brand-success/10 rounded-xl text-brand-success w-fit mx-auto mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Audit Ready</h3>
            <p className="text-sm text-foreground/60 font-medium">CITATIONS: Verified carrier-published regulations.</p>
          </div>
        </div>

        <div className="bg-brand-secondary p-12 rounded-card text-center shadow-premium relative overflow-hidden group">
           <Baby className="absolute -bottom-10 -right-10 h-64 w-64 text-brand-primary/5 -rotate-12 transition-transform group-hover:scale-110" />
          <h2 className="text-3xl font-extrabold text-on-brand-secondary mb-4">Check Eligibility</h2>
          <p className="text-on-brand-secondary-70 mb-10 max-w-md mx-auto font-medium">
            Find out if you are within the carrier's boarding window or if a medical certificate is required.
          </p>
          <Link 
            href="/tools/pregnancy-cutoff/quiz" 
            className="inline-flex items-center px-10 py-5 bg-brand-primary text-on-brand-primary font-bold rounded-button hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
          >
            Start Eligibility Check
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Stethoscope className="mr-3 text-brand-primary h-6 w-6" /> 
              Why Policy Matters
            </h3>
            <ul className="space-y-4 text-foreground/70 font-medium">
              <li className="flex items-start">
                <div className="h-2 w-2 bg-brand-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Airline limits typically range from 32 to 38 weeks.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-brand-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Cruise lines enforce a strict 24-week hard stop for medical safety.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-brand-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Failure to carry required documentation often leads to automatic denial.</span>
              </li>
            </ul>
          </div>
          <div className="bg-brand-primary-surface p-8 rounded-card border border-brand-primary/10">
            <h4 className="font-bold mb-4 text-brand-primary uppercase tracking-widest text-xs">Standard Precaution</h4>
            <p className="text-sm leading-relaxed font-medium">
              This tool provides deterministic policy analysis based on carrier contracts. It is NOT medical advice. Always consult your OB-GYN before travel.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
