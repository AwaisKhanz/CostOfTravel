export interface PregnancyTravelInput {
  transportType: "air" | "cruise";
  carrier: string;
  departureDateLocal: string;        // ISO string (user local)
  weeksPregnantAtDeparture: number;  // 0–45
  isMultiplePregnancy: boolean;
  hasMedicalCertificate: boolean;
}

export type Scenario =
  | "pregnancy.allowed"
  | "pregnancy.documentation_required"
  | "pregnancy.high_risk"
  | "pregnancy.denied"
  | "pregnancy.policy_missing";

export interface PregnancyTravelOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  allowedToTravel: boolean;
  documentationRequired: boolean;
  denialRisk: "low" | "moderate" | "high";
  reasonCode:
    | "WITHIN_POLICY_LIMIT"
    | "DOCUMENTATION_REQUIRED"
    | "EXCEEDS_POLICY_LIMIT"
    | "ABSOLUTE_CUTOFF"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "high_risk" | "denied" | "cannot_determine";
}

export interface Storyline {
  headline: string;
  verdict: string;
  riskSummary: string;
  whyThisHappens: string;
  whatHappensNext: string[];
}

export interface PregnancyPolicy {
  maxWeeksSingle: number;
  maxWeeksMultiple: number;
  documentationRequiredAfterWeeks: number;
  absoluteCutoffWeeks: number;
  documentationOverrides: boolean;
}
