import type { FlightCancellationInput, Scenario, FarePolicy } from './types.js';
import { getJurisdiction } from './geography.js';

export function mapScenario(
  input: FlightCancellationInput,
  policy: FarePolicy | null,
  nowUTC: Date
): Scenario {
  if (!policy) {
    return "cancellation.policy_missing";
  }

  const bookingUTC = new Date(input.bookingDateTimeLocal);
  const departureUTC = new Date(input.departureDateTimeLocal);
  const jurisdiction = getJurisdiction(input.originAirportIATA);

  const MS_IN_HOUR = 1000 * 60 * 60;
  const bookingAgeHours = (nowUTC.getTime() - bookingUTC.getTime()) / MS_IN_HOUR;
  const hoursBeforeDeparture = (departureUTC.getTime() - nowUTC.getTime()) / MS_IN_HOUR;

  // 1. Regulatory 24h Protection (US Specific v1)
  if (jurisdiction === "US" && bookingAgeHours <= 24 && hoursBeforeDeparture > 168) {
    return "cancellation.regulatory_24h";
  }

  // 2. Refundable Fare
  if (policy.refundable) {
    return "cancellation.refundable_fare";
  }

  // 3. Late Forfeiture (No-show risk)
  if (hoursBeforeDeparture <= 24) {
    return "cancellation.late_forfeit";
  }

  // 4. Specific Fare Class Logic
  if (input.fareClassId === "basic_economy") {
    return "cancellation.basic_economy_forfeit";
  }

  if (input.fareClassId === "award") {
    return "cancellation.award_fee";
  }

  // 5. Default: Standard Fee/Credit
  return "cancellation.standard_fee_credit";
}
