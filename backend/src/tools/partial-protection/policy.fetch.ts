import type { BaggagePolicy } from './types.js';

const POLICIES: BaggagePolicy[] = [
  {
    id: "allianz_premium",
    name: "Allianz Premium Plan",
    type: "insurance",
    coverage: {
      coveredCategories: {
        airfare: true,
        hotel: true,
        cruise: true,
        excursions: true,
        baggageFees: false,
        petFees: false
      },
      coverageLimits: {
        airfare: 10000,
        hotel: 5000
      },
      requiresEarlyPurchase: true,
      earlyPurchaseWindowDays: 14,
      coveredReasons: ["illness", "weather", "schedule_change"]
    }
  },
  {
    id: "amex_platinum",
    name: "Amex Platinum Card Coverage",
    type: "credit_card",
    coverage: {
      coveredCategories: {
        airfare: true,
        hotel: true,
        cruise: true,
        excursions: false,
        baggageFees: false,
        petFees: false
      },
      coverageLimits: {
        airfare: 10000
      },
      requiresEarlyPurchase: false,
      coveredReasons: ["illness", "weather"]
    }
  },
  {
    id: "chase_sapphire",
    name: "Chase Sapphire Reserve",
    type: "credit_card",
    coverage: {
      coveredCategories: {
        airfare: true,
        hotel: true,
        cruise: false,
        excursions: false,
        baggageFees: false,
        petFees: false
      },
      coverageLimits: {
        airfare: 10000,
        hotel: 10000
      },
      requiresEarlyPurchase: false,
      coveredReasons: ["illness", "weather", "schedule_change"]
    }
  }
];

export function fetchPolicy(providerId?: string): BaggagePolicy | null {
  if (!providerId) return null;
  return POLICIES.find(p => p.id === providerId) || null;
}
