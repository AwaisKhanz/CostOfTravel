export interface PartialProtectionInput {
  tripCosts: {
    airfare: number;
    hotel: number;
    cruise?: number;
    excursions?: number;
    baggageFees?: number;
    petFees?: number;
  };
  protectionType: "insurance" | "credit_card" | "none";
  protectionProviderId?: string; // normalized policy ID
  insurancePurchaseDateLocal?: string; // ISO
  bookingDateLocal: string; // ISO
  cancellationReason:
    | "illness"
    | "schedule_change"
    | "personal"
    | "weather";
}

export type Scenario =
  | "protection.none"
  | "protection.limited"
  | "protection.partial"
  | "protection.broad"
  | "protection.policy_missing";

export interface PartialProtectionOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  totalTripCost: number;
  protectedAmount: number;
  unprotectedAmount: number;
  protectionBreakdown: {
    airfare: "covered" | "partial" | "not_covered";
    hotel: "covered" | "partial" | "not_covered";
    cruise?: "covered" | "partial" | "not_covered";
    excursions?: "covered" | "partial" | "not_covered";
    baggageFees?: "covered" | "partial" | "not_covered";
    petFees?: "covered" | "partial" | "not_covered";
  };
  reasonCode:
    | "NO_PROTECTION"
    | "REASON_NOT_COVERED"
    | "LATE_PURCHASE_LIMITATION"
    | "PARTIAL_CATEGORY_EXCLUSION"
    | "BROAD_COVERAGE"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "partial_loss"
    | "high_risk"
    | "cannot_determine";
}

export interface BaggagePolicy {
  id: string;
  name: string;
  type: "insurance" | "credit_card";
  coverage: {
    coveredCategories: {
      airfare: boolean;
      hotel: boolean;
      cruise: boolean;
      excursions: boolean;
      baggageFees: boolean;
      petFees: boolean;
    };
    coverageLimits: {
      airfare?: number;
      hotel?: number;
      cruise?: number;
      excursions?: number;
      baggageFees?: number;
      petFees?: number;
    };
    requiresEarlyPurchase: boolean;
    earlyPurchaseWindowDays?: number;
    coveredReasons: string[];
  };
}
