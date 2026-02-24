import type { Scenario } from './types.js';

export function getIntel(scenario: Scenario) {
  const intelMap: Partial<Record<Scenario, any>> = {
    "pregnancy.denied": {
      summary: "Cruise lines and airlines enforce pregnancy cutoffs to reduce medical risk during travel.",
      citation: {
        source: "Carrier Pregnancy Policy",
        verified: "2026-02-01"
      }
    },
    "pregnancy.high_risk": {
      summary: "Most cruise lines have a strict 24-week cutoff for all passengers to ensure safety at sea.",
      citation: {
        source: "CLIA Safety Standards",
        verified: "2026-02-01"
      }
    },
    "pregnancy.documentation_required": {
       summary: "Medical certificates must usually state the expected delivery date and 'fit to fly' status.",
       citation: {
         source: "IATA Medical Manual",
         verified: "2026-02-01"
       }
    }
  };

  return intelMap[scenario] || null;
}
