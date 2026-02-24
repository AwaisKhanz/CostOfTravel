export interface NoShowInput {
  airline: string;
  fareClassId: string;                 // normalized fare ID
  ticketPrice: number;
  departureDateTimeLocal: string;      // ISO string
  originAirportIATA: string;
  passengerCount: number;
  missedFlight: boolean;
  cancelledBeforeDeparture: boolean;
}

export type Scenario =
  | "no_show.not_applicable"
  | "no_show.full_forfeit"
  | "no_show.credit_retained"
  | "no_show.refund_possible"
  | "no_show.award_redeposit"
  | "no_show.policy_missing";

export interface NoShowOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  ticketForfeited: boolean;
  refundAmount: number;
  creditAmount: number;
  penaltyAmount: number;
  currency: string;
  creditExpirationMonths: number | null;
  remainingSegmentsCancelled: boolean;
  reasonCode:
    | "NOT_A_NO_SHOW"
    | "FULL_FORFEIT"
    | "CREDIT_RETAINED"
    | "REFUNDABLE_OVERRIDE"
    | "AWARD_REDEPOSIT_RULE"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "partial_loss"
    | "full_loss"
    | "cannot_determine";
}

export interface NoShowPolicy {
  forfeitsTicketValue: boolean;
  cancellationFeeAmount?: number;
  cancellationFeePercent?: number;
  creditAllowedAfterNoShow: boolean;
  creditExpirationMonths?: number;
  refundableFareOverride: boolean;
  autoCancelRemainingSegments: boolean;
  awardRedepositFee?: number;
}

export interface Storyline {
  headline: string;
  verdict: string;
  lossSummary: string;
  whyThisHappens: string;
  itineraryImpact: string;
  whatHappensNext: string[];
}
