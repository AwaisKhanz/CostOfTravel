import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plane, ChevronRight, ShieldCheck, BadgeInfo } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { airlines, tools } from '@/lib/seo/routes';

export function generateStaticParams() {
  return airlines.map((airline) => ({
    carrier: airline.id,
  }));
}

export default async function AirlineHubPage({ params }: { params: Promise<{ carrier: string }> }) {
  const { carrier } = await params;
  const airline = airlines.find((a) => a.id === carrier);

  if (!airline) {
    notFound();
  }

  // Filter tools relevant to airlines
  const airlineTools = tools.filter(t => t.id !== 'cruise-penalty');

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title={`${airline.name} Intelligence Hub | Cost of Travel`}
        description={`Access all deterministic travel calculators and policy checkers for ${airline.name}.`}
        url={`https://costoftravel.com/airlines/${carrier}`}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-card shadow-premium overflow-hidden border border-border-subtle">
          <div className="bg-brand-primary px-8 py-16 text-on-brand-primary text-center relative overflow-hidden">
            <Plane className="h-20 w-20 mx-auto mb-6 opacity-20 absolute -top-4 -right-4 rotate-12" />
            <Plane className="h-16 w-16 mx-auto mb-6 relative z-10" />
            <h1 className="text-4xl font-extrabold tracking-tight relative z-10">{airline.name}</h1>
            <p className="mt-4 text-xl text-brand-primary-low font-medium relative z-10">Carrier Intelligence Hub</p>
          </div>
          
          <div className="px-10 py-12">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-1 w-12 bg-brand-primary rounded-full" />
               <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Policy Coverage Engines</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {airlineTools.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={`/airlines/${carrier}/${tool.id}`}
                  className="flex items-center justify-between p-6 rounded-button border border-border-subtle hover:border-brand-primary hover-brand-primary-surface transition-all group shadow-sm hover:shadow-premium"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-brand-secondary-low rounded-xl group-hover-brand-primary-surface text-foreground/60 group-hover:text-brand-primary transition-all">
                      <BadgeInfo className="h-6 w-6" />
                    </div>
                    <span className="ml-4 font-bold text-foreground group-hover:text-brand-primary transition-colors">{tool.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-foreground/20 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-secondary-low px-10 py-8 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-6 w-6 text-brand-success mr-3" />
              <p className="text-sm text-foreground/60 font-medium italic">
                Verified against {airline.name}'s published Contract of Carriage.
              </p>
            </div>
            <div className="hidden sm:block text-[10px] font-extrabold uppercase tracking-widest text-foreground/20">
              Deterministic Engine v2.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
