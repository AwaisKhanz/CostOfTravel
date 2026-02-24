"use client";

import React from 'react';
import Link from 'next/link';
import { Plane, AlertTriangle, ShieldCheck, Clock, ArrowRight, Ban, Luggage } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function NoShowPenaltyLanding() {
  return (
    <ToolLayout 
      title="No-Show Penalty Checker" 
      description="Deterministic verification of ticket forfeiture rules for missed flights."
      toolId="no-show-penalty"
    >
      <SchemaMarkup 
        title="No-Show Penalty Checker | Cost of Travel"
        description="Verify the financial and itinerary consequences of missing your flight without prior cancellation. Checks for full ticket forfeiture and remaining segment cancellation."
        url="http://localhost:3000/tools/no-show-penalty"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-warning/10 rounded-2xl text-brand-warning mb-6">
            <Ban className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
            No-Show Penalty Checker
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Did you miss your flight? Most airlines enforce a strict "no-show = no value" policy. Determine immediately if your ticket is fully forfeited or if you retain any residual value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Ban className="h-6 w-6 text-brand-danger" />,
              title: "Ticket Forfeiture",
              description: "Instantly checks if your specific fare class voids all funds upon a no-show."
            },
            {
              icon: <Luggage className="h-6 w-6 text-brand-warning" />,
              title: "Itinerary Impact",
              description: "Detects the likelihood of the airline auto-canceling your return flights."
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-brand-success" />,
              title: "Policy Exceptions",
              description: "Identifies rare carriers or flexible fares that allow credit retention post-departure."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-extrabold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-danger/10 rounded-card p-12 border border-brand-danger/20 mb-16 text-center">
          <h2 className="text-2xl font-extrabold text-brand-danger mb-4 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" /> Time is Critical
          </h2>
          <p className="text-brand-danger/80 mb-8 font-medium max-w-lg mx-auto">
            If you have NOT yet missed the flight, cancel immediately to avoid punitive no-show status. If the flight has already departed, audit your forfeiture liability below.
          </p>
          <Link 
            href="/tools/no-show-penalty/quiz"
            className="inline-flex items-center gap-2 bg-brand-danger text-on-brand-danger font-extrabold px-10 py-5 rounded-button hover:bg-brand-danger-hover transition-all shadow-premium active:scale-95"
          >
            Check Liability Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-brand-primary" /> Key Verifications
            </h3>
            <ul className="space-y-4">
              {[
                "Basic Economy Total Forfeiture Rules",
                "Southwest Airlines Exception Policies",
                "Award Mile Redeposit Fees Post-Departure",
                "Fully Refundable Fare Protections",
                "Multi-Segment Auto-Cancellation Risks"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/70">
                  <div className="h-5 w-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-brand-warning" /> Strict Logic
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              We apply deterministic logic directly from airline Tariffs and Conditions of Carriage. 
              We do <span className="text-foreground font-bold underline">not</span> assume full forfeiture blindly; if your specific fare explicitly overrides the default no-show rule, we calculate the exact residual value or cash refund available to you.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
