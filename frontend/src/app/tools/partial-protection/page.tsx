import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calculator, ArrowRight, Lock, PieChart, FileCheck } from 'lucide-react';

export default function PartialProtectionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <ShieldCheck className="w-3.5 h-3.5" />
            Policy Exposure Auditor
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Determine your <span className="text-brand-primary">true</span> <br />coverage levels.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-foreground/60 font-medium mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Most travel protection only covers specific cost categories. Calculate exactly how many dollars remain at risk based on your specific policy and cancellation reason.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link 
              href="/tools/partial-protection/quiz"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-on-brand-primary rounded-button font-extrabold shadow-premium hover:bg-brand-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Start Risk Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-foreground/40 text-sm font-bold">
              <Lock className="w-4 h-4" />
              Production-Grade Analysis
            </div>
          </div>
        </div>
      </section>

      {/* Logic Cards */}
      <section className="py-20 px-4 bg-brand-secondary-low/30 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calculator className="w-6 h-6" />,
              title: "Category Reconciliation",
              desc: "Maps airfare, hotel, cruise, and excursions against individual category coverage triggers."
            },
            {
              icon: <PieChart className="w-6 h-6" />,
              title: "Exact Dollar Math",
              desc: "Reconciles protected vs unprotected amounts with absolute financial precision."
            },
            {
              icon: <FileCheck className="w-6 h-6" />,
              title: "Policy Window Check",
              desc: "Validates early purchase requirements and named peril inclusion rules."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-card border border-border-subtle rounded-card shadow-sm hover:shadow-premium transition-all group">
              <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-extrabold text-foreground mb-3">{item.title}</h3>
              <p className="text-foreground/60 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
