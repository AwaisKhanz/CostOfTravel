import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Anchor, ChevronRight, ShieldCheck, BadgeInfo } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { cruiseLines, tools } from '@/lib/seo/routes';

export function generateStaticParams() {
  return cruiseLines.map((cruise) => ({
    carrier: cruise.id,
  }));
}

export default async function CruiseHubPage({ params }: { params: Promise<{ carrier: string }> }) {
  const { carrier } = await params;
  const cruise = cruiseLines.find((c) => c.id === carrier);

  if (!cruise) {
    notFound();
  }

  // Filter tools relevant to cruise lines
  const cruiseToolsList = tools.filter(t => t.id === 'cruise-penalty');

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title={`${cruise.name} Intelligence Hub | Cost of Travel`}
        description={`Access all deterministic travel calculators and policy checkers for ${cruise.name}.`}
        url={`https://costoftravel.com/cruise-lines/${carrier}`}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-card shadow-premium overflow-hidden border border-border-subtle">
          <div className="bg-brand-secondary px-8 py-16 text-on-brand-secondary text-center relative overflow-hidden">
             <Anchor className="h-24 w-24 mx-auto mb-6 opacity-10 absolute -bottom-6 -left-6 -rotate-12" />
            <Anchor className="h-16 w-16 mx-auto mb-6 relative z-10 text-brand-success" />
            <h1 className="text-4xl font-extrabold tracking-tight relative z-10">{cruise.name}</h1>
            <p className="mt-4 text-xl text-on-brand-secondary-70 font-medium relative z-10">Carrier Intelligence Hub</p>
          </div>
          
          <div className="px-10 py-12">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-1 w-12 bg-brand-success rounded-full" />
               <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Available Calculators</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {cruiseToolsList.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={`/cruise-lines/${carrier}/${tool.id}`}
                  className="flex items-center justify-between p-6 rounded-button border border-border-subtle hover:border-brand-success hover:bg-brand-success/5 transition-all group shadow-sm hover:shadow-premium"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-brand-secondary-low rounded-xl group-hover:bg-brand-success/10 text-foreground/60 group-hover:text-brand-success transition-all">
                      <BadgeInfo className="h-6 w-6" />
                    </div>
                    <span className="ml-4 font-bold text-foreground group-hover:text-brand-success transition-colors">{tool.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-foreground/20 group-hover:text-brand-success transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-secondary-low px-10 py-8 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-6 w-6 text-brand-success mr-3" />
              <p className="text-sm text-foreground/60 font-medium italic">
                Verification against {cruise.name}'s latest Passage Contract.
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
