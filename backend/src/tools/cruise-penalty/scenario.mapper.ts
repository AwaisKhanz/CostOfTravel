import type { CruisePenaltyInput, Scenario } from './types.js';
import { fetchPolicy } from './policy.fetch.js';

const MS_IN_DAY = 1000 * 60 * 60 * 24;

export interface MapperOutput {
  scenario: Scenario;
  finalPenaltyPercent: number;
  daysBeforeSail: number;
  matchedMinDays: number | null;
  policy: ReturnType<typeof fetchPolicy>;
}

export function mapScenario(
  input: CruisePenaltyInput, 
  nowUTC: Date
): MapperOutput {
  const sailUTC = new Date(input.sailDateLocal);
  const cancellationUTC = new Date(input.cancellationDateLocal);

  // Derive days before sail (millisecond-precise, decimal allowed, no rounding before match)
  const daysBeforeSail = (sailUTC.getTime() - cancellationUTC.getTime()) / MS_IN_DAY;

  const policy = fetchPolicy(input.cruiseLine);

  if (!policy) {
    return {
      scenario: "cancellation.cannot_determine",
      finalPenaltyPercent: 0,
      daysBeforeSail,
      matchedMinDays: null,
      policy: null
    };
  }

  // Find first schedule row where daysBeforeSail >= rule.min_days
  let schedulePenaltyPercent = -1;
  let matchedMinDays: number | null = null;
  
  for (const rule of policy.schedule) {
    if (daysBeforeSail >= rule.min_days) {
      schedulePenaltyPercent = rule.penalty_percent;
      matchedMinDays = rule.min_days;
      break;
    }
  }

  // If no rule matched (e.g. sailed already, which should be blocked by validation but just in case)
  if (schedulePenaltyPercent === -1) {
    return {
      scenario: "cancellation.cannot_determine",
      finalPenaltyPercent: 0,
      daysBeforeSail,
      matchedMinDays: null,
      policy
    };
  }

  // Apply Fare Floor
  const fareFloorPercent = policy.fare_floor_percent[input.fareType] || 0;
  const finalPenaltyPercent = Math.max(schedulePenaltyPercent, fareFloorPercent);

  // Map to string Scenario
  let scenario: Scenario;
  if (finalPenaltyPercent === 0) {
    scenario = "cancellation.full_refund_window";
  } else if (finalPenaltyPercent > 0 && finalPenaltyPercent <= 49) {
    scenario = "cancellation.partial_penalty_window";
  } else if (finalPenaltyPercent >= 50 && finalPenaltyPercent <= 99) {
    scenario = "cancellation.high_penalty_window";
  } else {
    scenario = "cancellation.full_penalty_window";
  }

  return {
    scenario,
    finalPenaltyPercent,
    daysBeforeSail,
    matchedMinDays,
    policy
  };
}
