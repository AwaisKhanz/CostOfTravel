import React from 'react';
import { FileText, Gavel, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-card shadow-premium border border-border-subtle overflow-hidden">
        <div className="bg-brand-secondary px-12 py-16 text-on-brand-secondary text-center">
           <div className="inline-flex p-4 bg-background/20 rounded-2xl mb-6">
            <Gavel className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-on-brand-secondary-70 font-medium italic">Regulatory Framework & Usage Limitations</p>
        </div>

        <div className="p-12 space-y-12">
          <div className="bg-brand-danger/10 p-8 rounded-xl border border-brand-danger/20 flex gap-6">
            <AlertTriangle className="h-8 w-8 text-brand-danger flex-shrink-0" />
            <div>
              <h3 className="text-brand-danger font-extrabold uppercase tracking-widest text-xs mb-2">Deterministic Disclaimer</h3>
              <p className="text-sm font-bold text-brand-danger/80 leading-relaxed">
                Cost of Travel provides deterministic policy analysis based on public carrier data. We are NOT a law firm, travel agency, or insurance provider. All results should be verified directly with your carrier before making financial decisions.
              </p>
            </div>
          </div>

          <section>
             <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary-surface rounded-xl text-brand-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">1. Calculator Accuracy</h2>
            </div>
            <p className="text-foreground/70 font-medium leading-relaxed">
              Our tools use mathematical models to interpret airline and cruise line policies. While we strive for 100% accuracy, carrier policies can change without notice. The "Intelligence Hub" data is provided as a reference tool only.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-primary-surface rounded-xl text-brand-primary">
                <Scale className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">2. Liability Limits</h2>
            </div>
            <p className="text-foreground/70 font-medium leading-relaxed">
              Cost of Travel shall not be held liable for any financial losses resulting from the use of our calculators. Users are encouraged to cross-reference results with their specific Contract of Carriage.
            </p>
          </section>

          <div className="pt-12 border-t border-border-subtle text-center">
            <p className="text-xs font-extrabold text-foreground/40 uppercase tracking-[0.2em]">
              Regulatory Version v2.0 - Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
