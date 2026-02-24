import Link from 'next/link';
import { CreditCard, ShieldCheck, ArrowRight, BadgeInfo, Zap, Car, HelpCircle, AlertCircle } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { tools } from '@/lib/seo/routes';

const toolMetadata: Record<string, { icon: any; desc: string; featured: boolean }> = {
  'card-coverage': { icon: ShieldCheck, desc: 'Analyze the hidden insurance hierarchy of your credit card.', featured: true },
  'car-rental': { icon: Car, desc: 'Primary vs. secondary collision damage waiver (CDW) verification.', featured: false },
  'delay-responsibility': { icon: HelpCircle, desc: 'Sequence of payment between carrier, bank, and insurance.', featured: true },
};

export default function CardsHubPage() {
  const cardTools = tools.filter(t => 
    Object.keys(toolMetadata).includes(t.id)
  );

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title="Credit Card Travel Protection Intelligence | Cost of Travel"
        description="Determine exactly which travel protections your credit card provides based on bank policies."
        url="https://costoftravel.com/cards"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <CreditCard className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4 font-sans tracking-tight">Credit Card Protections</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
            Your bank likely provides thousands in "hidden" travel insurance. We calculate the exact sequence of primary and secondary liability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardTools.map((tool) => {
            const meta = toolMetadata[tool.id];
            return (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="block group">
                <div className={`h-full p-8 rounded-card border transition-all hover:-translate-y-1 relative overflow-hidden ${
                  meta.featured 
                    ? 'bg-brand-primary text-on-brand-primary border-brand-primary shadow-premium' 
                    : 'bg-card text-foreground border-border-subtle hover:shadow-premium'
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${
                      meta.featured ? 'bg-background/20' : 'bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-on-brand-primary transition-all'
                    }`}>
                      <meta.icon className="h-6 w-6" />
                    </div>
                    {meta.featured && (
                      <span className="bg-background/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">Featured Tool</span>
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${meta.featured ? 'text-on-brand-primary' : 'text-foreground'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm leading-relaxed font-medium ${meta.featured ? 'text-brand-primary-low' : 'text-foreground/60'}`}>
                    {meta.desc}
                  </p>
                  <div className="mt-8 flex items-center font-extrabold text-sm uppercase tracking-widest">
                    Analyze Now <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 bg-brand-secondary-low rounded-card p-10 border border-border-subtle text-center">
          <h2 className="text-xl font-extrabold text-foreground mb-4 italic">"Is my card's coverage primary or secondary?"</h2>
          <p className="text-foreground/60 font-medium mb-0">
            Most premium cards (Sapphire, Amex Platinum) offer Primary CDW for rentals but Secondary coverage for flight delays. Our calculators handle these multi-layered hierarchies automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
