import type { Intel, Scenario } from "./types.js";

const INTEL_DB: Record<string, Intel> = {
  "baggage.family_amplified": {
    scenario: "baggage.family_amplified",
    summary: "Baggage penalties for weight and dimensions are applied per bag, per passenger, and stack independently of any base fees paid.",
    citation: {
      source: "Airline Contract of Carriage",
      verified: "2026-02-01"
    }
  },
  "baggage.family_standard": {
    scenario: "baggage.family_standard",
    summary: "Base baggage fees typically increase for the second and third bags per passenger. These costs are multiplied by the number of travelers.",
    citation: {
      source: "Airline Baggage Tariff",
      verified: "2026-02-01"
    }
  }
};

export function getIntel(scenario: Scenario): Intel | null {
  return INTEL_DB[scenario] || null;
}
