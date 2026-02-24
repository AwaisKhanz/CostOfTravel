export interface TwentyFourHourInput {
  bookingDateTimeLocal: string;
  departureDateTimeLocal: string;
  originAirportIATA: string;
  bookingChannel: "direct" | "ota";
}

export type Jurisdiction = "US" | "EU" | "INTL";

export type Scenario =
  | "cancellation.free_24h"
  | "cancellation.short_notice"
  | "cancellation.outside_24h"
  | "cancellation.non_us_departure"
  | "cancellation.invalid_input";

export interface TwentyFourHourOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  jurisdiction: Jurisdiction;
  eligible: boolean;
  refundType: "cash" | "none";
  refundAmount: "full" | "none";
  reasonCode:
    | "US_DOT_24H_RULE"
    | "DEPARTURE_WITHIN_7_DAYS"
    | "BOOKING_OLDER_THAN_24H"
    | "NON_US_DEPARTURE"
    | "INVALID_INPUT";
  outcomeRisk: "safe" | "not_applicable" | "cannot_determine";
}
