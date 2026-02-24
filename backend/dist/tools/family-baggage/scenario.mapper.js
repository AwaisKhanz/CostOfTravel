export function mapScenario(input, policy) {
    if (!policy)
        return "baggage.policy_missing";
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
