export const airlines = [
  { id: 'delta', name: 'Delta Air Lines' },
  { id: 'american', name: 'American Airlines' },
  { id: 'united', name: 'United Airlines' },
  { id: 'alaska', name: 'Alaska Airlines' },
  { id: 'southwest', name: 'Southwest Airlines' },
  { id: 'jetblue', name: 'JetBlue Airways' },
  { id: 'spirit', name: 'Spirit Airlines' },
  { id: 'frontier', name: 'Frontier Airlines' },
  { id: 'british_airways', name: 'British Airways' },
  { id: 'lufthansa', name: 'Lufthansa' },
  { id: 'air_france', name: 'Air France' },
  { id: 'ryanair', name: 'Ryanair' },
  { id: 'easyjet', name: 'easyJet' },
  { id: 'emirates', name: 'Emirates' },
  { id: 'qatar', name: 'Qatar Airways' }
];

export const cruiseLines = [
  { id: 'royal_caribbean', name: 'Royal Caribbean' },
  { id: 'carnival', name: 'Carnival Cruise Line' },
  { id: 'norwegian', name: 'Norwegian Cruise Line' },
  { id: 'disney', name: 'Disney Cruise Line' },
  { id: 'princess', name: 'Princess Cruises' },
  { id: 'celebrity', name: 'Celebrity Cruises' },
  { id: 'msc', name: 'MSC Cruises' },
  { id: 'holland_america', name: 'Holland America Line' }
];

export const tools = [
  { id: '24h-cancellation', name: '24-Hour Cancellation Policy' },
  { id: 'cruise-penalty', name: 'Cruise Cancellation Penalty' },
  { id: 'budget-checkin', name: 'Budget Airline Check-In' },
  { id: 'pregnancy-cutoff', name: 'Pregnancy Travel Cutoff' },
  { id: 'pet-breed-ban', name: 'Pet Breed Ban' },
  { id: 'flight-cancellation', name: 'Flight Cancellation Policy' },
  { id: 'refund-vs-credit', name: 'Refund vs Credit Audit' },
  { id: 'no-show-penalty', name: 'No-Show Penalty Rules' },
  { id: 'family-baggage', name: 'Family Baggage Fees' },
  { id: 'partial-protection', name: 'Partial Protection Auditor' }
];

// Helper for generateStaticParams in App Router
export function getAirlineStaticParams() {
  const params: { carrier: string; topic: string }[] = [];
  const airlineTools = tools.filter(t => t.id !== 'cruise-penalty');
  
  for (const airline of airlines) {
    for (const tool of airlineTools) {
      params.push({
        carrier: airline.id,
        topic: tool.id
      });
    }
  }
  return params;
}

export function getCruiseStaticParams() {
  const params: { carrier: string; topic: string }[] = [];
  for (const cruise of cruiseLines) {
    const cruiseTools = tools.filter(t => t.id === 'cruise-penalty');
    for (const tool of cruiseTools) {
      params.push({
        carrier: cruise.id,
        topic: tool.id
      });
    }
  }
  return params;
}
