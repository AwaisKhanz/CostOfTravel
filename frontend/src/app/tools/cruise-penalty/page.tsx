import React from 'react';
import Link from 'next/link';
import { ArrowRight, Anchor, ShieldCheck, Clock } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';

export default function CruisePenaltyPage() {
  return (
    <ToolLayout
      toolId="cruise-penalty" 
      title="Cruise Penalty Timeline Calculator"
      description="Calculate exactly what percentage of your cruise fare you will lose (and what you get back) if you cancel today."
    >
      <div className="bg-card p-8 rounded-card border border-border-subtle shadow-premium mb-8">
        <h2 className="text-xl font-extrabold text-foreground mb-4">How the penalty calculator works</h2>
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <Anchor className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Cruise Line Data</p>
              <p className="text-foreground/60 text-sm">We check the strict penalty schedules for your specific cruise line.</p>
            </div>
          </li>
          <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <Clock className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Timeline Mapping</p>
              <p className="text-foreground/60 text-sm">We calculate exactly how many days remain until your sail date.</p>
            </div>
          </li>
           <li className="flex items-start">
             <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0 mt-1">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Fare Floors</p>
              <p className="text-foreground/60 text-sm">We factor in non-refundable deposit penalties to give you the exact retained amount.</p>
            </div>
          </li>
        </ul>

        <Link 
          href="/tools/cruise-penalty/quiz"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-button bg-brand-primary text-on-brand-primary font-extrabold hover:bg-brand-primary-hover transition-all shadow-premium group"
        >
          Check My Penalty Now
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

       <div className="text-center">
        <p className="text-sm text-foreground/40 font-bold uppercase tracking-wider mb-2">Supported Lines</p>
        <p className="text-xs text-foreground/40">Royal Caribbean • Carnival • Norwegian • Princess • Holland America • Celebrity • Disney • MSC</p>
      </div>
    </ToolLayout>
  );
}
