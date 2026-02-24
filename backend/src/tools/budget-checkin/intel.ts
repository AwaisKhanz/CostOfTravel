import type { Scenario } from './types.js';

export function getIntel(scenario: Scenario) {
  if (scenario === "checkin.missed_online_deadline") {
    return {
      summary: "Airport check-in fees are typically enforced without exceptions for low-cost carriers.",
      citation: {
        source: "Airline Check-In Policy",
        verified: "2026-02-01"
      }
    };
  }
  
  if (scenario === "checkin.online_still_available") {
     return {
      summary: "Some budget airlines charge extra for re-issuing boarding passes even if you checked in online but lost the document.",
      citation: {
        source: "Carrier Terms of Service",
        verified: "2026-02-01"
      }
    };
  }

  return null;
}
