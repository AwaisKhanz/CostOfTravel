import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';

export default function BudgetCheckinPage() {
  return (
    <ToolLayout 
      toolId="budget-checkin" 
      title="Budget Airline Check-In Deadline Calculator"
      description="Calculate exactly when free online check-in closes for your airline and avoid high airport fees."
    >
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium mb-8">
        <h2 className="text-xl font-extrabold text-foreground mb-4">Why use this calculator?</h2>
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <Clock className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Policy Accuracy</p>
              <p className="text-foreground/60 text-sm">Strict deadlines vary by airline and route (domestic vs international).</p>
            </div>
          </li>
          <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <CreditCard className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Fee Prevention</p>
              <p className="text-foreground/60 text-sm">Budget airlines charge up to €55 per passenger for airport check-in.</p>
            </div>
          </li>
           <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <AlertCircle className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Live Deadlines</p>
              <p className="text-foreground/60 text-sm">Real-time validation against the airline's latest terms.</p>
            </div>
          </li>
        </ul>

        <Link 
          href="/tools/budget-checkin/quiz"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold hover:bg-brand-primary-hover transition-all shadow-premium group"
        >
          Check My Deadline Now
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

       <div className="text-center">
        <p className="text-sm text-foreground/40 font-bold uppercase tracking-wider mb-2">Supported Budget Carriers</p>
        <p className="text-xs text-foreground/40">Ryanair • Wizz Air • Spirit • Frontier • EasyJet • AirAsia • JetBlue</p>
      </div>
    </ToolLayout>
  );
}
