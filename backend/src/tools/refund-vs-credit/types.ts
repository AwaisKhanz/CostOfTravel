export interface RefundVsCreditInput {
  airline: string;
  fareClassId: string;                 // normalized fare ID
  bookingDateTimeLocal: string;        // ISO
  cancellationDateTimeLocal: string;   // ISO
  departureDateTimeLocal: string;      // ISO
  ticketPrice: number;
  originAirportIATA: string;
  isAirlineInitiated: boolean;
}

export type Scenario =
  | "refund.airline_initiated_cash"
  | "refund.regulatory_cash"
  | "refund.refundable_fare"
  | "refund.credit_only"
  | "refund.no_refund"
  | "refund.award_fee"
  | "refund.policy_missing";

export interface RefundVsCreditOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  refundAmount: number;
  creditAmount: number;
  penaltyAmount: number;
  currency: string;
  creditExpirationMonths: number | null;
  refundMethod: "cash" | "credit" | "none";
  reasonCode:
    | "AIRLINE_INITIATED"
    | "US_24H_RULE"
    | "REFUNDABLE_FARE"
    | "CREDIT_ONLY_FARE"
    | "NO_REFUND_ALLOWED"
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
  cashRefundAllowed: boolean;
  creditAllowed: boolean;
  cancellationFeeAmount?: number;
  cancellationFeePercent?: number;
  creditExpirationMonths?: number;
  awardRedepositFee?: number;
}

export interface Storyline {
  headline: string;
  verdict: string;
  lossSummary: string;
  whyThisHappens: string;
  creditDetails?: string;
  whatHappensNext: string[];
}
