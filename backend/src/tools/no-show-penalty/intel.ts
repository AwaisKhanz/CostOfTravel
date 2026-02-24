import type { Scenario } from './types.js';

export function getIntel(scenario: Scenario) {
  const intelMap: Partial<Record<Scenario, any>> = {
    "no_show.full_forfeit": {
      summary: "Most major carriers enforce a 'no-show = no value' policy for standard non-refundable fares, as outlined in their Contract of Carriage.",
      citation: {
        source: "Airline Conditions of Carriage / IATA Tariffs",
        verified: "2026-02-01"
      }
    },
    "no_show.credit_retained": {
      summary: "Southwest Airlines is a notable exception in the US market, often allowing Business Select and Anytime fares to retain value as flight credits after a no-show.",
      citation: {
        source: "Carrier Policy Exceptions",
        verified: "2026-02-01"
      }
    }
  };

  return intelMap[scenario] || null;
}
