import type { Scenario } from './types.js';

export function getIntel(scenario: Scenario) {
  const intelMap: Partial<Record<Scenario, any>> = {
    "pet.banned": {
      summary: "IATA guidelines frequently recommend against transporting brachycephalic breeds in cargo holds due to increased mortality risk.",
      citation: {
        source: "IATA Live Animals Regulations (LAR)",
        verified: "2026-02-01"
      }
    },
    "pet.restricted": {
      summary: "Airlines often apply 'Embargo' periods during summer or winter months for restricted breeds.",
      citation: {
        source: "FAA/DOT Animal Safety Data",
        verified: "2026-02-01"
      }
    }
  };

  return intelMap[scenario] || null;
}
