import type { RefundVsCreditInput, Scenario, FarePolicy } from './types.js';
import { getJurisdiction } from './geography.js';

export function mapScenario(
  input: RefundVsCreditInput,
  policy: FarePolicy | null,
  nowUTC: Date
): Scenario {
  if (!policy) {
    return "refund.policy_missing";
  }

  const bookingUTC = new Date(input.bookingDateTimeLocal);
  const departureUTC = new Date(input.departureDateTimeLocal);
  const jurisdiction = getJurisdiction(input.originAirportIATA);

  const MS_IN_HOUR = 1000 * 60 * 60;
  const bookingAgeHours = (nowUTC.getTime() - bookingUTC.getTime()) / MS_IN_HOUR;
  const hoursBeforeDeparture = (departureUTC.getTime() - nowUTC.getTime()) / MS_IN_HOUR;

  // 1. Airline Initiated (Force Majeure / Carrier Cancellation)
  if (input.isAirlineInitiated) {
    return "refund.airline_initiated_cash";
  }

  // 2. Regulatory 24h Window (US)
  if (jurisdiction === "US" && bookingAgeHours <= 24 && hoursBeforeDeparture > 168) {
    return "refund.regulatory_cash";
  }

  // 3. Refundable Fare
  if (policy.refundable || policy.cashRefundAllowed) {
    return "refund.refundable_fare";
  }

  // 4. Credit Only
  if (policy.creditAllowed) {
    return "refund.credit_only";
  }

  // 5. Award Redeposit
  if (input.fareClassId === "award") {
    return "refund.award_fee";
  }

  // 6. Default: No Refund
  return "refund.no_refund";
}
