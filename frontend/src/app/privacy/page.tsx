import React from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-card shadow-premium border border-border-subtle overflow-hidden">
        <div className="bg-brand-primary p-12 text-on-brand-primary text-center">
          <div className="inline-flex p-4 bg-background/20 rounded-2xl mb-6">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Protocol</h1>
          <p className="text-brand-primary-low font-medium italic">Data Ethics for the Deterministic Engine</p>
        </div>

        <div className="p-12 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary-surface rounded-xl text-brand-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">1. Information Architecture</h2>
            </div>
            <p className="text-foreground/70 font-medium leading-relaxed">
              We collect anonymized tool usage data via Rybbit to improve our deterministic algorithms. We do not store personally identifiable information (PII) unless explicitly provided in contact forms. Our engine operates on policy data, not personal identities.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary-surface rounded-xl text-brand-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">2. Analytical Usage</h2>
            </div>
            <p className="text-foreground/70 font-medium leading-relaxed">
              Data is used to track the performance of tools, identify policy mismatches, and provide AI-generated explanations for calculation results. We use this to verify the accuracy of our Contracts of Carriage mappings across 3,500+ potential scenarios.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary-surface rounded-xl text-brand-primary">
                <EyeOff className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">3. Cookie Policy</h2>
            </div>
            <p className="text-foreground/70 font-medium leading-relaxed">
              We use essential cookies to maintain session state and for analytics purposes. These are necessary for the deterministic engine to function across multiple interaction stages.
            </p>
          </section>

          <div className="pt-12 border-t border-border-subtle text-center">
            <p className="text-xs font-extrabold text-foreground/40 uppercase tracking-[0.2em]">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
