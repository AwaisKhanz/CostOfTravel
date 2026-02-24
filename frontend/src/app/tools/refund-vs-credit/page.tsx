"use client";

import React from 'react';
import Link from 'next/link';
import { CreditCard, ShieldCheck, Banknote, Landmark, ArrowRight, Wallet, Receipt } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function RefundVsCreditLanding() {
  return (
    <ToolLayout 
      title="Refund vs Credit Calculator" 
      description="Deterministic verification of cash refund eligibility vs. travel vouchers."
      toolId="refund-vs-credit"
    >
      <SchemaMarkup 
        title="Refund vs Credit Calculator | Cost of Travel"
        description="Verify if your airline cancellation results in a cash refund or a travel credit. Handles carrier-initiated cancellations and regulatory windows."
        url="http://localhost:3000/tools/refund-vs-credit"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <Banknote className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
            Refund vs Credit Calculator
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Know exactly what you are entitled to. We reconcile carrier policies against consumer protection laws to determine your payout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Landmark className="h-6 w-6 text-brand-primary" />,
              title: "Carrier Mandates",
              description: "Detects airline-initiated cancelations where cash refunds are legally required."
            },
            {
              icon: <Receipt className="h-6 w-6 text-brand-success" />,
              title: "Voucher Audit",
              description: "Calculates the exact net value of travel credits after all penalty fees."
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-brand-secondary" />,
              title: "Expiration Logic",
              description: "Tracks typical expiration rules for non-refundable fare recovery."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-extrabold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-primary-surface rounded-card p-12 border border-border-subtle mb-16 text-center">
          <h2 className="text-2xl font-extrabold mb-4">Cash or Credit?</h2>
          <p className="text-foreground/60 mb-8 font-medium">Airlines often push vouchers. Our tool tells you if you have a legal right to cash.</p>
          <Link 
            href="/tools/refund-vs-credit/quiz"
            className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-extrabold px-10 py-5 rounded-button hover:bg-brand-primary-hover transition-all shadow-premium active:scale-95"
          >
            Start Audit <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-brand-primary" /> Key Verifications
            </h3>
            <ul className="space-y-4">
              {[
                "US DOT 24-Hour Consumer Mandate",
                "Carrier-Initiated Cancellation Refunds",
                "Award Redeposit Fee Calculations",
                "Flexible Fare Cash Reconciliation",
                "Standard Economy Credit Recovery"
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
              <Landmark className="h-6 w-6 text-brand-secondary" /> Strict Reconciliation
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              We apply a zero-sum reconciliation rule: <span className="text-foreground font-bold italic">Refund + Credit + Penalty = Ticket Price</span>. 
              Our engine ensures that every cent of your ticket value is accounted for, leaving no room for carrier ambiguity.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
