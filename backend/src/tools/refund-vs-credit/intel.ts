import type { Scenario } from './types.js';

export function getIntel(scenario: Scenario) {
  const intelMap: Partial<Record<Scenario, any>> = {
    "refund.airline_initiated_cash": {
      summary: "Per US DOT and EU 261/2004, if a carrier cancels a flight, the passenger is legally entitled to a cash refund, regardless of the fare type.",
      citation: {
        source: "US DOT Enforcement Policy / EU 261/2004",
        verified: "2026-02-01"
      }
    },
    "refund.regulatory_cash": {
      summary: "US DOT 24-hour rule requires airlines to allow passengers to cancel a booking within 24 hours of purchase for a full refund if the flight is at least 7 days away.",
      citation: {
        source: "US Department of Transportation",
        verified: "2026-02-01"
      }
    }
  };

  return intelMap[scenario] || null;
}
