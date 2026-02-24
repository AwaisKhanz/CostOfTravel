import React from 'react';
import Link from 'next/link';

export const GlobalFooter = () => {
  return (
    <footer className="bg-brand-secondary-low mt-auto border-t border-border-subtle">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <span className="text-sm text-foreground/40 font-medium">
              Deterministic Travel Intelligence
            </span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center md:text-left text-xs leading-5 text-foreground/60">
              <strong>Disclaimer:</strong> Results reflect published carrier rules and typical enforcement. Actual outcomes may vary by fare type, timing, documentation, and agent discretion. No refunds or coverage are guaranteed.
            </p>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              <Link href="/privacy" className="text-xs text-foreground/40 hover:text-brand-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-foreground/40 hover:text-brand-primary transition-colors">Terms of Service</Link>
              <Link href="/tools" className="text-xs text-foreground/40 hover:text-brand-primary transition-colors">All Tools</Link>
            </div>
            <p className="mt-4 text-center md:text-left text-xs leading-5 text-foreground/30">
              &copy; {new Date().getFullYear()} Cost of Travel. All rights reserved. Not affiliated with any airline, cruise line, or insurance provider.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
