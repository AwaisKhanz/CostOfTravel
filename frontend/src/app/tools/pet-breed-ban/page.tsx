"use client";

import React from 'react';
import Link from 'next/link';
import { Dog, ShieldCheck, AlertTriangle, Info, ArrowRight, XCircle } from 'lucide-react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export default function PetBreedBanLanding() {
  return (
    <ToolLayout 
      title="Pet Breed Airline Ban Checker" 
      description="Deterministic verification of airline-specific breed restrictions and bans."
      toolId="pet-breed-ban"
    >
      <SchemaMarkup 
        title="Pet Breed Airline Ban Checker | Cost of Travel"
        description="Verify airline policies for specific dog and cat breeds. Determine if your pet is banned or restricted from cabin or cargo travel."
        url="http://localhost:3000/tools/pet-breed-ban"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <Dog className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-6">
            Pet Breed Airline Ban Checker
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto font-medium">
            Verify breed-specific boarding eligibility based on current carrier contracts of carriage and animal welfare policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <ShieldCheck className="h-6 w-6 text-brand-success" />,
              title: "Policy Normalized",
              description: "Verified against explicit breed registers from major airlines."
            },
            {
              icon: <AlertTriangle className="h-6 w-6 text-brand-warning" />,
              title: "Trait Detection",
              description: "Detects risks for short-nosed (brachycephalic) and mixed breeds."
            },
            {
              icon: <Info className="h-6 w-6 text-brand-primary" />,
              title: "Cabin vs Cargo",
              description: "Differentiation between in-cabin travel and manifested cargo holds."
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
          <h2 className="text-2xl font-extrabold mb-4">Ready to check your pet's eligibility?</h2>
          <p className="text-foreground/60 mb-8 font-medium">Takes less than 1 minute to verify against our deterministic policy engine.</p>
          <Link 
            href="/tools/pet-breed-ban/quiz"
            className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-extrabold px-10 py-5 rounded-button hover:bg-brand-primary-hover transition-all shadow-premium active:scale-95"
          >
            Start Eligibility Check <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-primary" /> Supported Scope
            </h3>
            <ul className="space-y-4">
              {[
                "Commercial Airline Pet Policies",
                "Domestic and International Regulations",
                "Cabin and Cargo Travel Methods",
                "Standard Dog and Cat Breed Registers"
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
              <XCircle className="h-6 w-6 text-brand-danger" /> Excluded Items
            </h3>
            <ul className="space-y-4">
              {[
                "Service Animals (Subject to separate ADA/DOT rules)",
                "Exotic Animals or Livestock",
                "Charter Flights or Private Jet Rentals",
                "Detailed Health or Medical Advice"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/70">
                  <div className="h-5 w-5 rounded-full bg-brand-danger/10 text-brand-danger flex items-center justify-center flex-shrink-0">
                    <XCircle className="h-3 w-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
