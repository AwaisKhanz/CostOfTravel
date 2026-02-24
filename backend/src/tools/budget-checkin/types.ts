// Types for the Budget Airline Check-In Deadline Calculator (Tool #3)

export interface BudgetCheckinInput {
  airline: string;
  departureDateTimeLocal: string;  // ISO string (user local)
  routeType: "domestic" | "international";
  hasCheckedInOnline: boolean;
  passengerCount: number;
}

export type Scenario =
  | "checkin.already_checked_in"
  | "checkin.online_still_available"
  | "checkin.missed_online_deadline"
  | "checkin.policy_missing";

export interface BudgetCheckinOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  deadlineHours: number;
  hoursRemaining: number;
  feePerPassenger: number;
  totalFee: number;
  currency: string;
  feeApplies: boolean;
  reasonCode:
    | "ALREADY_CHECKED_IN"
    | "CHECKIN_STILL_OPEN"
    | "MISSED_ONLINE_DEADLINE"
    | "POLICY_NOT_FOUND";
  outcomeRisk:
    | "safe"
    | "fee_applies"
    | "cannot_determine";
}

export interface Storyline {
  headline: string;
  verdict: string;
  lossSummary: string;
  whyThisHappens: string;
  whatHappensNext: string[];
}
