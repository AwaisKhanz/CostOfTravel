import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ProviderHeaderProps {
  providerName: string;
  providerType: 'Airline' | 'Cruise Line' | 'Insurance';
  topicName: string;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ 
  providerName, 
  providerType, 
  topicName 
}) => {
  return (
    <div className="bg-card border-b border-border-subtle py-8 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-foreground/50 mb-4 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-success" />
          <span>Verified {providerType} Policy Data</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-foreground mb-4">
          {providerName} {topicName} Calculator
        </h1>
        
        <p className="text-lg text-foreground/70 mb-4 font-medium">
          Calculate exact financial outcomes and policy enforcement rules for {providerName}. Our deterministic engine uses real published rules—no guessing.
        </p>

        <div className="flex items-start gap-3 bg-brand-primary-surface p-4 rounded-button border border-brand-primary/10">
          <Info className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-primary font-medium">
            <strong>Disclaimer:</strong> Results reflect published {providerName} rules and typical enforcement. Actual outcomes may vary by fare type, timing, documentation, and agent discretion. No refunds or coverage are guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};
