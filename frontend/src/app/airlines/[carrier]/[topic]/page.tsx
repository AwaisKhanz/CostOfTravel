import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ProviderHeader } from '@/components/seo/ProviderHeader';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { airlines, tools, getAirlineStaticParams } from '@/lib/seo/routes';

// Dynamically import the tools so we don't bundle all 21 into one page
const toolComponents = {
  '24h-cancellation': dynamic(() => import('@/app/tools/24h-cancellation/page')),
  'budget-checkin': dynamic(() => import('@/app/tools/budget-checkin/page')),
  'pregnancy-cutoff': dynamic(() => import('@/app/tools/pregnancy-cutoff/page')),
  'pet-breed-ban': dynamic(() => import('@/app/tools/pet-breed-ban/page')),
  'flight-cancellation': dynamic(() => import('@/app/tools/flight-cancellation/page')),
  'refund-vs-credit': dynamic(() => import('@/app/tools/refund-vs-credit/page')),
  'no-show-penalty': dynamic(() => import('@/app/tools/no-show-penalty/page')),
  'family-baggage': dynamic(() => import('@/app/tools/family-baggage/page')),
} as Record<string, any>;

export function generateStaticParams() {
  return getAirlineStaticParams();
}

export default async function AirlineTopicPage({ params }: { params: Promise<{ carrier: string; topic: string }> }) {
  const { carrier, topic } = await params;
  const airline = airlines.find(a => a.id === carrier);
  const tool = tools.find(t => t.id === topic);

  if (!airline || !tool) {
    notFound();
  }

  const ToolComponent = toolComponents[topic];

  if (!ToolComponent) {
    // If we haven't mapped it above yet, fallback to 404 until we expand the map
    notFound();
  }

  const title = `${airline.name} ${tool.name} Rules & Calculator`;
  const description = `Calculate exact financial outcomes and policy enforcement rules for ${airline.name} ${tool.name}. Real rules, zero guessing.`;
  const url = `https://costoftravel.com/airlines/${carrier}/${topic}`;

  return (
    <div className="min-h-screen bg-background">
      <SchemaMarkup 
        title={title}
        description={description}
        url={url}
        providerName={airline.name}
      />
      
      <ProviderHeader 
        providerName={airline.name}
        providerType="Airline"
        topicName={tool.name}
      />

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-card shadow-premium rounded-card overflow-hidden border border-border-subtle">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
}
