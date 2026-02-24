import React from 'react';
import Link from 'next/link';
import { Calculator, Plane, Umbrella, Luggage, Dog, ShieldCheck, CreditCard, Car, Baby, Banknote, Ban, Briefcase } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

const allTools = [
  { id: '24h-cancellation', name: '24-Hour Cancellation Policy', category: 'Flights', icon: Plane },
  { id: 'cruise-penalty', name: 'Cruise Cancellation Penalty', category: 'Cruises', icon: ShieldCheck },
  { id: 'budget-checkin', name: 'Budget Airline Check-In', category: 'Flights', icon: Luggage },
  { id: 'pregnancy-cutoff', name: 'Pregnancy Travel Cutoff', category: 'Aviation & Marine', icon: Baby },
  { id: 'pet-breed-ban', name: 'Pet Breed Airline Ban', category: 'Aviation & Marine', icon: Dog },
  { id: 'flight-cancellation', name: 'Flight Cancellation Cost', category: 'Flights', icon: CreditCard },
  { id: 'refund-vs-credit', name: 'Refund vs Credit Audit', category: 'Flights', icon: Banknote },
  { id: 'no-show-penalty', name: 'No-Show Penalty Checker', category: 'Flights', icon: Ban },
  { id: 'family-baggage', name: 'Family Baggage Fee Calculator', category: 'Flights', icon: Briefcase },
  { id: 'partial-protection', name: 'Partial Protection Auditor', category: 'Protection', icon: ShieldCheck },
];

export default function ToolsPage() {
  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title="Travel Tools | Cost of Travel"
        description="Deterministic policy calculators for cancellations and check-ins."
        url="https://costoftravel.com/tools"
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Calculator className="h-12 w-12 text-brand-primary mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
            Master Tools Index
          </h1>
          <p className="mt-4 text-xl text-foreground/60 max-w-2xl mx-auto">
            Browse our complete library of deterministic policy calculators. Zero guessing, 100% data-driven.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allTools.map((tool) => (
            <Link 
              key={tool.id} 
              href={`/tools/${tool.id}`}
              className="relative group bg-card p-6 rounded-card shadow-sm border border-border-subtle hover:shadow-premium transition-all hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary group-hover:bg-brand-primary group-hover:text-on-brand-primary transition-colors">
                  <tool.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-foreground/40 mt-1 font-medium">
                    {tool.category}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="h-5 w-5 text-brand-success" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
