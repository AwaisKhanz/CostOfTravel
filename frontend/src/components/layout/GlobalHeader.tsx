import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export const GlobalHeader = () => {
  return (
    <header className="bg-card border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold tracking-tight text-brand-primary">
                Cost of Travel
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/tools"
                className="border-transparent text-foreground hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-all"
              >
                All Tools
              </Link>
              <Link
                href="/categories/flights"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Flights
              </Link>
              <Link
                href="/categories/pets"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Pets
              </Link>
              <Link
                href="/categories/financial"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Cards
              </Link>
              <Link
                href="/categories/cruises"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Cruises
              </Link>
              <Link
                href="/categories/insurance"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Insurance
              </Link>
              <Link
                href="/categories/baggage"
                className="border-transparent text-foreground/70 hover:border-brand-primary hover:text-brand-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all"
              >
                Baggage & Fees
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
