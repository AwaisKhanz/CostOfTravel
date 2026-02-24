import type { NoShowInput, Scenario, NoShowPolicy } from './types.js';

export function mapScenario(
  input: NoShowInput,
  policy: NoShowPolicy | null,
  nowUTC: Date
): Scenario {
  if (!policy) {
    return "no_show.policy_missing";
  }

  // 1. Not a no-show checks
  if (input.cancelledBeforeDeparture) {
    return "no_show.not_applicable";
  }

  if (!input.missedFlight) {
    return "no_show.not_applicable";
  }

  // Future flights cannot be no-shows yet
  const departureUTC = new Date(input.departureDateTimeLocal);
  const departurePassed = departureUTC.getTime() <= nowUTC.getTime();
  
  if (!departurePassed) {
    // Technically caught by router validation, but enforced here deterministically
    return "no_show.policy_missing";
  }

  // 2. Refundable Fare Override
  if (input.fareClassId === "refundable" && policy.refundableFareOverride) {
    return "no_show.refund_possible";
  }

  // 3. Award Redeposit Rule
  if (input.fareClassId === "award" && policy.refundableFareOverride) {
    return "no_show.award_redeposit";
  }

  // 4. Credit Retained
  if (policy.creditAllowedAfterNoShow) {
    return "no_show.credit_retained";
  }

  // 5. Full Forfeit
  if (policy.forfeitsTicketValue) {
    return "no_show.full_forfeit";
  }

  return "no_show.policy_missing";
}
