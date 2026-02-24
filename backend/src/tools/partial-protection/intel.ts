import type { Scenario } from './types.js';

export function fetchIntel(scenario: Scenario) {
  if (scenario === "protection.partial") {
    return {
      scenario: "protection.partial",
      summary: "Travel protection often excludes optional add-ons and ancillary fees. Many benefits require the policy to be bought within 10-14 days of your initial trip deposit.",
      citation: {
        source: "Policy Coverage Summary",
        verified: "2026-02-01"
      }
    };
  }
  
  if (scenario === "protection.limited") {
    return {
       scenario: "protection.limited",
       summary: "A 'covered reason' is legally defined in your policy certificate. Standard plans do not cover voluntary cancellations without a CFAR (Cancel for Any Reason) upgrade.",
       citation: {
         source: "US Travel Insurance Standards",
         verified: "2025-11-15"
       }
    };
  }

  return null;
}
