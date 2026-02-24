import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ProviderHeader } from '@/components/seo/ProviderHeader';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { airlines, tools, getAirlineStaticParams } from '@/lib/seo/routes';

// Dynamically import the tools so we don't bundle all 21 into one page
const toolComponents = {
  'major-refunder': dynamic(() => import('@/app/tools/major-refunder/page')),
  'baggage-fees': dynamic(() => import('@/app/tools/baggage-fees/page')),
  'pet-carrier': dynamic(() => import('@/app/tools/pet-carrier/page')),
  'pet-breed-ban': dynamic(() => import('@/app/tools/pet-breed-ban/page')),
  'pregnancy-travel-eligibility': dynamic(() => import('@/app/tools/pregnancy-travel-eligibility/page')),
  'airline-cancellation': dynamic(() => import('@/app/tools/airline-cancellation/page')),
  'delay-comp': dynamic(() => import('@/app/tools/delay-comp/page')),
  'missed-connection': dynamic(() => import('@/app/tools/missed-connection/page')),
  'lost-baggage': dynamic(() => import('@/app/tools/lost-baggage/page')),
  'denied-boarding': dynamic(() => import('@/app/tools/denied-boarding/page')),
  'tarmac-delay': dynamic(() => import('@/app/tools/tarmac-delay/page')),
  'delay-responsibility': dynamic(() => import('@/app/tools/delay-responsibility/page')),
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
