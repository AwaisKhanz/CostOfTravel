import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ProviderHeader } from '@/components/seo/ProviderHeader';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { cruiseLines, tools, getCruiseStaticParams } from '@/lib/seo/routes';

const toolComponents = {
  'cruise-penalty': dynamic(() => import('@/app/tools/cruise-penalty/page')),
  'pregnancy-travel-eligibility': dynamic(() => import('@/app/tools/pregnancy-travel-eligibility/page')),
} as Record<string, any>;

export function generateStaticParams() {
  return getCruiseStaticParams();
}

export default async function CruiseTopicPage({ params }: { params: Promise<{ carrier: string; topic: string }> }) {
  const { carrier, topic } = await params;
  const cruiseLine = cruiseLines.find(c => c.id === carrier);
  const tool = tools.find(t => t.id === topic);

  if (!cruiseLine || !tool) {
    notFound();
  }

  const ToolComponent = toolComponents[topic];

  if (!ToolComponent) {
    notFound();
  }

  const title = `${cruiseLine.name} ${tool.name} Rules & Calculator`;
  const description = `Calculate exact financial outcomes and policy enforcement rules for ${cruiseLine.name} ${tool.name}. Real rules, zero guessing.`;
  const url = `https://costoftravel.com/cruise-lines/${carrier}/${topic}`;

  return (
    <div className="min-h-screen bg-background">
      <SchemaMarkup 
        title={title}
        description={description}
        url={url}
        providerName={cruiseLine.name}
      />
      
      <ProviderHeader 
        providerName={cruiseLine.name}
        providerType="Cruise Line"
        topicName={tool.name}
      />

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-card shadow-premium rounded-2xl overflow-hidden border border-border-subtle">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
}
