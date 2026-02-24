// Types for the Cruise Penalty Timeline Calculator (Tool #2)

export interface CruisePenaltyInput {
  cruiseLine: string;
  sailDateLocal: string;          // ISO string (user local)
  cancellationDateLocal: string;  // ISO string (user local)
  totalTripCost: number;
  fareType: "standard" | "non_refundable" | "promo";
}

export type Scenario =
  | "cancellation.full_refund_window"
  | "cancellation.partial_penalty_window"
  | "cancellation.high_penalty_window"
  | "cancellation.full_penalty_window"
  | "cancellation.cannot_determine";

export interface CruisePenaltyOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  penaltyPercent: number;
  penaltyAmount: number;
  refundAmount: number;
  refundMethod: "cash" | "fcc" | "none";
  nextPenaltyCliffDays?: number;
  nextPenaltyCliffPercent?: number;
  daysUntilNextCliff?: number;
  reasonCode:
    | "FULL_REFUND_WINDOW"
    | "PARTIAL_PENALTY"
    | "HIGH_PENALTY"
    | "FULL_FORFEITURE"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "partial_loss"
    | "full_loss"
    | "cannot_determine";
}

export interface Storyline {
  headline: string;
  verdict: string;
  lossSummary: string;
  whyThisHappens: string;
  whatHappensNext: string[];
}
