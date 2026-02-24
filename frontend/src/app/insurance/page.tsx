import Link from 'next/link';
import { Umbrella, ShieldCheck, ArrowRight, Clock, FileWarning, Search, Info } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { tools } from '@/lib/seo/routes';

const toolMetadata: Record<string, { icon: any; desc: string }> = {
  'insurance-eligibility': { icon: ShieldCheck, desc: 'Interactive qualification engine for claim eligibility.' },
  'insurance-exclusions': { icon: FileWarning, desc: 'Automated policy scan for hidden exclusion clauses.' },
  'post-booking-insurance': { icon: Clock, desc: 'Analyze coverage cliffs for plans bought after trip booking.' },
  'preexisting-lookback': { icon: Search, desc: 'Calculate the medical lookback window enforcement dates.' },
  'tarmac-delay': { icon: Info, desc: 'Legal rights and compensation math for extended delays.' },
};

export default function InsuranceHubPage() {
  const insuranceTools = tools.filter(t => 
    Object.keys(toolMetadata).includes(t.id)
  );

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title="Travel Insurance Intelligence Hub | Cost of Travel"
        description="Master the math and rules behind travel insurance coverage, exclusions, and timing cliffs."
        url="https://costoftravel.com/insurance"
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <Umbrella className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4 font-sans tracking-tight">Insurance Intelligence Hub</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Stop guessing about coverage. We analyze published policy rules with deterministic precision.
          </p>
        </div>

        {/* Quiz CTA */}
        <div className="bg-brand-primary rounded-card p-10 mb-16 text-on-brand-primary shadow-premium relative overflow-hidden group border border-brand-primary-hover">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-extrabold mb-4 tracking-tight">Coverage Qualification Quiz</h2>
            <p className="text-brand-primary-low/80 mb-8 font-medium leading-relaxed">
              Not sure which calculator to use? Our 4-step interactive quiz will point you to the exact policy rule you need.
            </p>
            <Link href="/insurance/quiz" className="inline-flex items-center px-8 py-4 bg-background text-brand-primary font-extrabold rounded-button hover-brand-primary-surface transition-all active:scale-95 shadow-premium">
              Start Claim Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-48 w-48" />
          </div>
        </div>

        {/* Tool List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insuranceTools.map((tool) => {
            const meta = toolMetadata[tool.id];
            return (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block group">
                <div className="h-full bg-card p-8 rounded-card border border-border-subtle shadow-sm hover:shadow-premium transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-on-brand-primary transition-all">
                      <meta.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground/20 group-hover:text-brand-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tool.name}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed font-medium">{meta.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
