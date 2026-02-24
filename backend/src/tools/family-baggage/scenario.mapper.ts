import type { FamilyBaggageInput, BaggagePolicy, Scenario } from "./types.js";

export function mapScenario(
  input: FamilyBaggageInput,
  policy: BaggagePolicy | null
): Scenario {
  if (!policy) return "baggage.policy_missing";

  const isOverweight = input.bagWeightKg > policy.baggage.overweightThresholdKg;
  const isOversize = input.bagLinearSizeCm > policy.baggage.oversizeThresholdCm;

  if (isOverweight || isOversize) {
    return "baggage.family_amplified";
  }

  if (input.numberOfPassengers === 1) {
    return "baggage.single_traveler";
  }

  return "baggage.family_standard";
}
