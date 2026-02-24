import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plane, Umbrella, Luggage, Dog, ShieldAlert, BadgeInfo } from 'lucide-react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

interface ToolLink {
  id: string;
  name: string;
  desc: string;
}

const categories = {
  flights: {
    title: 'Flight Disruptions & Logistics',
    icon: Plane,
    desc: 'Deterministic rules for airline cancellations and budget check-in deadlines.',
    tools: [
      { id: '24h-cancellation', name: '24-Hour Cancellation Policy', desc: 'Calculate exact DOT 24-hour refund eligibility based on booking time.' },
      { id: 'budget-checkin', name: 'Budget Airline Check-In', desc: 'Verify if the online check-in window is closed and calculate airport fees.' },
    ]
  },
  cruises: {
    title: 'Cruise Line Intelligence',
    icon: ShieldAlert,
    desc: 'Specialized policies for marine travel and cancellation penalties.',
    tools: [
      { id: 'cruise-penalty', name: 'Cruise Cancellation Penalty', desc: 'Calculate the specific loss based on days before sail and fare type.' },
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryData = categories[category as keyof typeof categories];

  if (!categoryData) {
    notFound();
  }

  const Icon = categoryData.icon;

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <SchemaMarkup 
        title={`${categoryData.title} Tools | Cost of Travel`}
        description={categoryData.desc}
        url={`https://costoftravel.com/categories/${category}`}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-brand-primary-surface rounded-2xl text-brand-primary mb-6">
            <Icon className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">{categoryData.title}</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium">{categoryData.desc}</p>
        </div>

        <div className="bg-card shadow-sm border border-border-subtle overflow-hidden rounded-card">
          <ul role="list" className="divide-y divide-border-subtle">
            {categoryData.tools.map((tool) => (
              <li key={tool.id}>
                <Link href={`/tools/${tool.id}`} className="block hover-brand-primary-surface transition-all group">
                  <div className="px-6 py-8 sm:px-10">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-brand-primary group-hover:text-brand-primary truncate transition-colors">{tool.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-brand-primary-surface text-brand-primary ring-1 ring-brand-primary/20">
                          Verified Tool
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-foreground/70 font-medium">
                          <BadgeInfo className="flex-shrink-0 mr-2 h-4 w-4 text-foreground/50 group-hover:text-brand-primary transition-colors" />
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
