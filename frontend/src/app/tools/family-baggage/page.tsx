import React from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Briefcase, Boxes, AlertCircle, Info } from 'lucide-react';

export default function FamilyBaggagePage() {
  return (
    <ToolLayout
      title="Family Baggage Fee Calculator"
      description="Deterministic baggage fee engine. Calculate exact costs for multiple passengers, including overweight and oversize penalty stacking."
      toolId="family-baggage"
    >
      <div className="space-y-12">
        {/* Value Prop Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-card border border-border-subtle shadow-sm">
            <Boxes className="w-8 h-8 text-brand-primary mb-4" />
            <h3 className="font-bold mb-2">Multi-Passenger Stacking</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Computes cumulative fees across your entire traveling party with precision.
            </p>
          </div>
          <div className="bg-card p-6 rounded-card border border-border-subtle shadow-sm">
            <AlertCircle className="w-8 h-8 text-brand-warning mb-4" />
            <h3 className="font-bold mb-2">Penalty Guard</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Detects and calculates overweight and oversize penalties that stack independently.
            </p>
          </div>
          <div className="bg-card p-6 rounded-card border border-border-subtle shadow-sm">
            <Info className="w-8 h-8 text-brand-primary mb-4" />
            <h3 className="font-bold mb-2">Policy Normalized</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Uses strict airline baggage tariffs. No generic average fee assumptions.
            </p>
          </div>
        </div>

        {/* Technical Warning */}
        <div className="bg-brand-secondary-low border border-brand-primary/20 p-6 rounded-card flex gap-4">
          <Info className="w-6 h-6 text-brand-primary flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-bold text-brand-primary mb-1">Architecture Note</h4>
            <p className="text-foreground/70 leading-relaxed">
              This tool uses deterministic multiplication and threshold logic. Elite status waivers or military exemptions are excluded to ensure accuracy for standard consumer bookings. All fees are rounded to two decimal places.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
