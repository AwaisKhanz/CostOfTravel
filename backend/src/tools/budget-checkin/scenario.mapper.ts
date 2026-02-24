import type { BudgetCheckinInput, Scenario } from './types.js';
import { fetchPolicy } from './policy.fetch.js';

const MS_IN_HOUR = 1000 * 60 * 60;

export interface MapperOutput {
  scenario: Scenario;
  deadlineHours: number;
  hoursRemaining: number;
  policy: ReturnType<typeof fetchPolicy>;
}

export function mapScenario(
  input: BudgetCheckinInput, 
  nowUTC: Date
): MapperOutput {
  const departureUTC = new Date(input.departureDateTimeLocal);
  
  // Strict server-time comparison
  const hoursRemaining = (departureUTC.getTime() - nowUTC.getTime()) / MS_IN_HOUR;

  const policy = fetchPolicy(input.airline);

  if (!policy) {
    return {
      scenario: "checkin.policy_missing",
      deadlineHours: 0,
      hoursRemaining,
      policy: null
    };
  }

  const deadlineHours = policy.online_deadline_hours[input.routeType] || 0;

  // CAST properly to boolean from frontend string or value
  const hasCheckedIn = String(input.hasCheckedInOnline) === "true";

  let scenario: Scenario;

  if (hasCheckedIn) {
    scenario = "checkin.already_checked_in";
  } else if (hoursRemaining > deadlineHours) {
    scenario = "checkin.online_still_available";
  } else {
    // STRICTOR RULE: If hoursRemaining <= deadlineHours → missed_online_deadline
    scenario = "checkin.missed_online_deadline";
  }

  return {
    scenario,
    deadlineHours,
    hoursRemaining,
    policy
  };
}
