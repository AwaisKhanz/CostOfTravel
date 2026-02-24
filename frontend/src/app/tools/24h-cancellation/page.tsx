"use client";

import React from 'react';
import Link from 'next/link';
import { ToolLayout } from '@/components/tools/ToolLayout';

export default function TwentyFourHourCancellationPage() {
  return (
    <ToolLayout toolId="24h-cancellation" title="24-Hour Cancellation Window Checker"
      description="Check if you are legally entitled to a full refund under the US DOT 24-hour rule. No guessing, just exact deterministic outcomes."
    >
      <div className="bg-card p-12 rounded-card border border-border-subtle shadow-premium text-center">
        <h2 className="text-2xl font-extrabold text-foreground mb-4">Are you eligible for a mandatory refund?</h2>
        <p className="text-foreground/60 mb-8 max-w-lg mx-auto leading-relaxed font-bold">
          The US Department of Transportation requires airlines to refund tickets canceled within 24 hours of booking, provided the departure is at least 7 days away. Let's find out if this rule protects your ticket right now.
        </p>
        <Link href="/tools/24h-cancellation/quiz" className="inline-flex justify-center bg-brand-primary text-on-brand-primary font-extrabold py-4 px-8 rounded-button hover:bg-brand-primary-hover shadow-premium transition-all active:scale-95">
          Start Eligibility Check
        </Link>
      </div>
    </ToolLayout>
  );
}
