import type { BaggagePolicy } from "./types.js";

const MOCK_POLICIES: Record<string, BaggagePolicy> = {
  delta: {
    baggage: {
      baseFee: {
        domestic: { firstBag: 35, secondBag: 45, additionalBag: 150 },
        international: { firstBag: 0, secondBag: 100, additionalBag: 200 }
      },
      airportMultiplier: 1.0, // Delta usually has same price
      overweightThresholdKg: 23,
      overweightFee: 100,
      oversizeThresholdCm: 157,
      oversizeFee: 200,
      currency: "USD"
    }
  },
  southwest: {
    baggage: {
      baseFee: {
        domestic: { firstBag: 0, secondBag: 0, additionalBag: 125 },
        international: { firstBag: 0, secondBag: 0, additionalBag: 125 }
      },
      airportMultiplier: 1.0,
      overweightThresholdKg: 23,
      overweightFee: 100,
      oversizeThresholdCm: 157,
      oversizeFee: 75,
      currency: "USD"
    }
  },
  spirit: {
    baggage: {
      baseFee: {
        domestic: { firstBag: 45, secondBag: 60, additionalBag: 100 },
        international: { firstBag: 50, secondBag: 70, additionalBag: 120 }
      },
      airportMultiplier: 1.5, // Significant airport markup
      overweightThresholdKg: 18,
      overweightFee: 75,
      oversizeThresholdCm: 157,
      oversizeFee: 150,
      currency: "USD"
    }
  }
};

export function fetchBaggagePolicy(airline: string): BaggagePolicy | null {
  return MOCK_POLICIES[airline.toLowerCase()] || null;
}
