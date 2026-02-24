export type Scenario =
  | "baggage.single_traveler"
  | "baggage.family_standard"
  | "baggage.family_amplified"
  | "baggage.policy_missing";

export interface FamilyBaggageInput {
  airline: string;
  numberOfPassengers: number;
  bagsPerPassenger: number;
  bagWeightKg: number;
  bagLinearSizeCm: number;   // total L+W+H
  routeType: "domestic" | "international";
  purchaseChannel: "online" | "airport";
}

export interface BaggagePolicy {
  baggage: {
    baseFee: {
      domestic: {
        firstBag: number;
        secondBag: number;
        additionalBag: number;
      };
      international: {
        firstBag: number;
        secondBag: number;
        additionalBag: number;
      };
    };
    airportMultiplier: number; // e.g., 1.25
    overweightThresholdKg: number;
    overweightFee: number;
    oversizeThresholdCm: number;
    oversizeFee: number;
    maxWeightKg?: number;
    currency: string;
  };
}

export interface FamilyBaggageOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  baseBaggageFeeTotal: number;
  overweightFeeTotal: number;
  oversizeFeeTotal: number;
  totalBaggageCost: number;
  currency: string;
  reasonCode:
    | "STANDARD_BAGGAGE_FEES"
    | "OVERWEIGHT_STACKED"
    | "OVERSIZE_STACKED"
    | "FAMILY_MULTIPLIED"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "partial_loss"
    | "high_cost"
    | "cannot_determine";
}

export interface Storyline {
  headline: string;
  verdict: string;
  costSummary: string;
  whyThisHappens: string;
}

export interface Intel {
  scenario: Scenario;
  summary: string;
  citation: {
    source: string;
    verified: string;
  };
}
