export interface FlightCancellationInput {
  airline: string;
  fareClassId: string;              // normalized fare ID
  bookingDateTimeLocal: string;     // ISO (user local)
  departureDateTimeLocal: string;   // ISO (user local)
  ticketPrice: number;
  originAirportIATA: string;
}

export type Scenario =
  | "cancellation.regulatory_24h"
  | "cancellation.refundable_fare"
  | "cancellation.basic_economy_forfeit"
  | "cancellation.standard_fee_credit"
  | "cancellation.late_forfeit"
  | "cancellation.award_fee"
  | "cancellation.policy_missing";

export interface FlightCancellationOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  refundAmount: number;
  creditAmount: number;
  penaltyAmount: number;
  totalLoss: number;
  refundMethod: "cash" | "credit" | "none";
  currency: string;
  reasonCode:
    | "US_24H_RULE"
    | "REFUNDABLE_FARE"
    | "BASIC_ECONOMY_FORFEIT"
    | "STANDARD_CANCELLATION_FEE"
    | "LATE_FORFEITURE"
    | "AWARD_REDEPOSIT_FEE"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "partial_loss"
    | "full_loss"
    | "cannot_determine";
}

export interface FarePolicy {
  refundable: boolean;
  cancellationFeeAmount?: number;
  cancellationFeePercent?: number;
  creditAllowed: boolean;
  refundMethod: "cash" | "credit" | "none";
  awardRedepositFee?: number;
}

export interface Storyline {
  headline: string;
  verdict: string;
  lossSummary: string;
  whyThisHappens: string;
  whatHappensNext: string[];
}
