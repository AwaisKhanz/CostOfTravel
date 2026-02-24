"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calculator, 
  ShieldCheck, 
  Plane, 
  ArrowRight, 
  Activity, 
  BarChart3, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  XOctagon, 
  HelpCircle 
} from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicLandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const uiMockupRef = useRef<HTMLDivElement>(null);
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const valuePropsRef = useRef<HTMLDivElement>(null);
  const statesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Hero Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(headlineRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    )
    .fromTo(subheadlineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    .fromTo(ctaGroupRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.5"
    )
    .fromTo(uiMockupRef.current,
      { y: 100, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
      "-=0.4"
    );

    // 2. Scroll Animations for Sections
    const featureCards = gsap.utils.toArray('.feature-card');
    gsap.fromTo(featureCards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        }
      }
    );

    const vpItems = gsap.utils.toArray('.vp-item');
    gsap.fromTo(vpItems,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: valuePropsRef.current,
          start: "top 75%",
        }
      }
    );

    const stateCards = gsap.utils.toArray('.state-card');
    gsap.fromTo(stateCards,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: statesRef.current,
          start: "top 85%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-brand-primary selection:text-on-brand-primary overflow-hidden">
      <SchemaMarkup 
        title="Cost of Travel | Deterministic Travel Risk Engine"
        description="Calculate exact cancellation penalties, delayed baggage fees, and insurance eligibility using strict, policy-normalized data and server-side math."
        url="http://localhost:3000/"
      />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-8 border-b border-border-subtle bg-grid-pattern overflow-hidden">
        {/* Subtle grid background for structural/fintech feel */}
        <div className="absolute inset-0 hero-grid-overlay opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 ref={headlineRef} className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-8 leading-[1.1]">
            <span className="block">Cost of Travel</span>
            <span className="block text-brand-primary">Deterministic Risk Engine</span>
          </h1>
          
          <p ref={subheadlineRef} className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto font-medium mb-12 leading-relaxed">
            Calculate exact cancellation penalties, delayed baggage fees, and insurance eligibility using strict, policy-normalized data and server-side math. 
            <span className="block mt-2 font-bold text-foreground/90">Zero guessing. Zero AI hallucinations.</span>
          </p>

          <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/tools/flight-cancellation"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-on-brand-primary rounded-button font-extrabold text-lg shadow-premium hover:bg-brand-primary-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" /> Calculate Cancellation Cost
            </Link>
            <Link 
              href="/tools"
              className="w-full sm:w-auto px-8 py-4 bg-card text-foreground border border-border-subtle rounded-button font-extrabold text-lg hover:bg-brand-secondary-low hover:border-brand-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-brand-primary" /> Master Tools Index
            </Link>
          </div>
        </div>

        {/* Hero Abstract UI Mockup */}
        <div ref={uiMockupRef} className="max-w-4xl mx-auto mt-20 relative z-10">
          <div className="bg-card border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-brand-secondary-low border-b border-border-subtle px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border-subtle"></div>
                <div className="w-3 h-3 rounded-full bg-border-subtle"></div>
                <div className="w-3 h-3 rounded-full bg-border-subtle"></div>
              </div>
              <div className="ml-4 text-xs font-mono text-foreground/50 tracking-widest font-bold">engine_state: ARMED</div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-4 bg-brand-secondary-low rounded w-3/4"></div>
                <div className="h-4 bg-brand-secondary-low rounded w-1/2"></div>
                <div className="h-4 bg-brand-secondary-low rounded w-full"></div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="h-12 border-2 border-brand-primary/20 rounded-button flex items-center px-4 gap-3">
                     <div className="w-4 h-4 rounded-full bg-brand-primary"></div>
                     <div className="h-2 bg-brand-primary/30 rounded w-1/2"></div>
                   </div>
                   <div className="h-12 border-2 border-border-subtle rounded-button flex items-center px-4 gap-3">
                     <div className="w-4 h-4 rounded-full border border-border-subtle"></div>
                     <div className="h-2 bg-border-subtle rounded w-1/2"></div>
                   </div>
                </div>
              </div>
              <div className="bg-brand-success/10 border border-brand-success/20 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-brand-success mb-3" />
                <div className="text-xs font-extrabold text-brand-success uppercase tracking-widest mb-1">Outcome Status</div>
                <div className="text-2xl font-black text-brand-success">SAFE</div>
                <div className="w-full h-1 bg-brand-success/20 mt-4 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-brand-success"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUTCOME STATES SECTION (The Grid) --- */}
      <section ref={statesRef} className="py-24 bg-brand-secondary text-on-brand-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-on-brand-secondary mb-4">Precision Risk Grading</h2>
            <p className="text-lg text-on-brand-secondary-70 max-w-2xl mx-auto font-medium">
              Every tool distills complex airline Tariffs into one of four immutable financial states.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { text: "text-brand-success", labelText: "text-brand-success", bg: "bg-brand-success/10", border: "border-brand-success/30", icon: CheckCircle2, label: "SAFE", desc: "No financial loss. Full refund guarantees." },
              { text: "text-brand-warning", labelText: "text-brand-warning", bg: "bg-brand-warning/10", border: "border-brand-warning/30", icon: AlertTriangle, label: "PARTIAL LOSS", desc: "Penalties apply, but residual value or credit remains." },
              { text: "text-brand-danger",  labelText: "text-brand-danger",  bg: "bg-brand-danger/10",  border: "border-brand-danger/30",  icon: XOctagon, label: "FULL LOSS", desc: "Complete ticket forfeiture or denial of claim." },
              { text: "text-brand-neutral", labelText: "text-brand-neutral", bg: "bg-brand-neutral/10", border: "border-brand-neutral/30", icon: HelpCircle, label: "PENDING", desc: "Missing policy data requires manual carrier review." }
            ].map((state, i) => (
              <div key={i} className={`state-card rounded-card p-6 border ${state.border} ${state.bg} flex flex-col items-center text-center`}>
                <state.icon className={`w-10 h-10 ${state.text} mb-4`} />
                <h3 className={`text-xl font-black tracking-widest ${state.labelText} mb-2`}>{state.label}</h3>
                <p className={`text-sm font-medium text-on-brand-secondary-80 leading-snug`}>{state.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE PROJECT BRIEF: VALUE PROPS --- */}
      <section ref={valuePropsRef} className="py-24 px-6 lg:px-8 bg-card border-b border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-4xl font-extrabold mb-8 tracking-tight">The Data-Driven Advantage</h2>
              <div className="space-y-12">
                {[
                  {
                    icon: Server,
                    title: "Deterministic Accuracy",
                    desc: "Uses strict server-side UTC time control and normalized policies to calculate exact fees—zero guessing and zero AI hallucinations."
                  },
                  {
                    icon: Activity,
                    title: "Comprehensive Risk Mapping",
                    desc: "Computes exact financial exposure across flights, cruises, pet restrictions, and insurance coverage windows."
                  },
                  {
                    icon: BarChart3,
                    title: "Unbiased Intelligence",
                    desc: "Delivers pure, read-only data without aggressive affiliate spam, hidden upsells, or 'best credit card' ranking traps."
                  }
                ].map((vp, i) => (
                  <div key={i} className="vp-item flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <vp.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold mb-2">{vp.title}</h3>
                      <p className="text-foreground/70 leading-relaxed font-medium">{vp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-secondary rounded-card p-10 border border-brand-secondary-hover shadow-xl">
              <h3 className="text-sm font-bold tracking-widest text-brand-primary-low uppercase mb-6">System Architecture</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-on-brand-secondary-10 pb-2">
                  <span className="text-on-brand-secondary-60">Core Logic</span>
                  <span className="font-bold text-on-brand-secondary">Deterministic Types</span>
                </div>
                <div className="flex justify-between border-b border-on-brand-secondary-10 pb-2">
                  <span className="text-on-brand-secondary-60">Time Control</span>
                  <span className="font-bold text-on-brand-secondary">Server-Side UTC</span>
                </div>
                <div className="flex justify-between border-b border-on-brand-secondary-10 pb-2">
                  <span className="text-on-brand-secondary-60">Math Protocol</span>
                  <span className="font-bold text-on-brand-secondary">Strict Reconciliation</span>
                </div>
                <div className="flex justify-between border-b border-on-brand-secondary-10 pb-2">
                  <span className="text-on-brand-secondary-60">Data Extraction</span>
                  <span className="font-bold text-on-brand-secondary">Normalized Policy Maps</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- TOOLS SHOWCASE --- */}
      <section ref={featuresRef} className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-border-subtle pb-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Deployed Calculators</h2>
              <p className="text-foreground/60 font-medium">Access our suite of strict financial evaluation tools.</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-2 text-brand-primary font-bold hover:text-brand-primary-hover transition-colors mt-4 md:mt-0">
              View Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "flight-cancellation", name: "Flight Cancellation Cost", desc: "Calculate exact penalties for early or late flight cancellations.", icon: Calculator },
              { id: "refund-vs-credit", name: "Refund vs Credit Audit", desc: "Audit entitlement to cash vs voucher based on regulatory overrides.", icon: ShieldCheck },
              { id: "no-show-penalty", name: "No-Show Penalty Checker", desc: "Verify ticket forfeiture and segment cancellation risks.", icon: Plane }
            ].map((tool, i) => (
              <Link key={i} href={`/tools/${tool.id}`} className="feature-card group block bg-card border border-border-subtle rounded-card p-8 hover:border-brand-primary/50 hover:shadow-premium transition-all">
                <div className="w-12 h-12 bg-brand-secondary-low group-hover:bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6 transition-colors">
                  <tool.icon className="w-6 h-6 text-foreground group-hover:text-brand-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                <p className="text-sm text-foreground/60 font-medium leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
