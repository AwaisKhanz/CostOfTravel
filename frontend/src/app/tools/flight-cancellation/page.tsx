"use client";

import React from 'react';
import Link from 'next/link';
import { CreditCard, ShieldCheck, Clock, Calculator, ArrowRight, Wallet } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function FlightCancellationLanding() {
  return (
    <ToolLayout 
      title="Flight Cancellation Cost Calculator" 
      description="Deterministic verification of cancellation penalties, refunds, and credits."
      toolId="flight-cancellation"
    >
      <SchemaMarkup 
        title="Flight Cancellation Cost Calculator | Cost of Travel"
        description="Verify potential loss and refund eligibility for flight cancellations. Handles US 24-hour regulatory rules and specific fare conditions."
        url="http://localhost:3000/tools/flight-cancellation"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <CreditCard className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
            Flight Cancellation Cost Calculator
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Calculate your potential refund or travel credit based on carrier fare rules, booking time, and regulatory windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Clock className="h-6 w-6 text-brand-primary" />,
              title: "Regulatory Check",
              description: "Detects eligible US 24-hour regulatory refund windows automatically."
            },
            {
              icon: <Wallet className="h-6 w-6 text-brand-success" />,
              title: "Fee Breakdown",
              description: "Calculates exact cancellation fees and net recovery values."
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-brand-secondary" />,
              title: "Policy Matching",
              description: "Deterministic mapping of Basic Economy, Standard, and Flexible fare classes."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-extrabold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-secondary-low rounded-card p-12 border border-border-subtle mb-16 text-center">
          <h2 className="text-2xl font-extrabold mb-4">Unsure of your cancellation penalty?</h2>
          <p className="text-foreground/60 mb-8 font-medium">Get a deterministic calculation of your cash refund vs. travel credit in seconds.</p>
          <Link 
            href="/tools/flight-cancellation/quiz"
            className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-extrabold px-10 py-5 rounded-button hover:bg-brand-primary-hover transition-all shadow-premium active:scale-95"
          >
            Start Calculation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-primary" /> What we handle
            </h3>
            <ul className="space-y-4">
              {[
                "US DOT 24-Hour Refund Mandates",
                "Non-Refundable Main Cabin Fare Credits",
                "Basic Economy Forfeiture Validation",
                "Fully Refundable Fare Verification",
                "Award Ticket Redeposit Fees"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/70">
                  <div className="h-5 w-5 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-brand-secondary" /> Calculation Logic
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              Our calculation engine uses strictly normalized policy registers. It reconciles every dollar by 
              ensuring <span className="text-foreground font-bold italic">Refund + Credit + Loss = Ticket Price</span>. 
              No insurance upsells, no guessing—just contract-of-carriage arithmetic.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
