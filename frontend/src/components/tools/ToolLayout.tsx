"use client";

import React, { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

interface ToolLayoutProps {
  title: string;
  description: string;
  toolId: string;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ title, description, toolId, children }) => {
  useEffect(() => {
    trackEvent('tool_view', { toolId });
  }, [toolId]);

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-6xl tracking-tight">
            {title}
          </h1>
          <p className="mt-6 text-xl text-foreground/70 font-medium">
            {description}
          </p>
        </div>
        
        {children}

        <div className="mt-16 pt-8 border-t border-border-subtle">
          <p className="text-xs text-foreground/40 text-center leading-relaxed font-medium italic">
            <strong>Legal Disclaimer:</strong> Results reflect published carrier rules and typical enforcement. 
            Actual outcomes may vary by fare type, timing, documentation, and discretion. 
            No refunds or coverage are guaranteed.
          </p>
        </div>
      </div>
    </main>
  );
};
