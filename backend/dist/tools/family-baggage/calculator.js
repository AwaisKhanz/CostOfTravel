export function calculateBaggageFee(input, scenario, policy) {
    const round = (val) => Math.round(val * 100) / 100;
    if (scenario === "baggage.policy_missing" || !policy) {
        return {
            schemaVersion: "v1",
            scenario: "baggage.policy_missing",
            baseBaggageFeeTotal: 0,
            overweightFeeTotal: 0,
            oversizeFeeTotal: 0,
            totalBaggageCost: 0,
            currency: "USD",
            reasonCode: "POLICY_NOT_FOUND",
            outcomeRisk: "cannot_determine"
        };
    }
    const p = policy.baggage;
    const baseRates = input.routeType === "domestic" ? p.baseFee.domestic : p.baseFee.international;
    let baseFeePerPax = 0;
    if (input.bagsPerPassenger === 1) {
        baseFeePerPax = baseRates.firstBag;
    }
    else if (input.bagsPerPassenger === 2) {
        baseFeePerPax = baseRates.firstBag + baseRates.secondBag;
    }
    else if (input.bagsPerPassenger > 2) {
        baseFeePerPax = baseRates.firstBag + baseRates.secondBag + (baseRates.additionalBag * (input.bagsPerPassenger - 2));
    }
    // Apply airport multiplier
    if (input.purchaseChannel === "airport") {
        baseFeePerPax = baseFeePerPax * p.airportMultiplier;
    }
    const baseBaggageFeeTotal = round(baseFeePerPax * input.numberOfPassengers);
    // Overweight logic
    let overweightFeePerBag = 0;
    if (input.bagWeightKg > p.overweightThresholdKg) {
        overweightFeePerBag = p.overweightFee;
    }
    const overweightFeeTotal = round(overweightFeePerBag * input.bagsPerPassenger * input.numberOfPassengers);
    // Oversize logic
    let oversizeFeePerBag = 0;
    if (input.bagLinearSizeCm > p.oversizeThresholdCm) {
        oversizeFeePerBag = p.oversizeFee;
    }
    const oversizeFeeTotal = round(oversizeFeePerBag * input.bagsPerPassenger * input.numberOfPassengers);
    const totalBaggageCost = round(baseBaggageFeeTotal + overweightFeeTotal + oversizeFeeTotal);
    let outcomeRisk = "partial_loss";
    if (totalBaggageCost === 0)
        outcomeRisk = "safe";
    else if (overweightFeeTotal > 0 || oversizeFeeTotal > 0)
        outcomeRisk = "high_cost";
    let reasonCode = "STANDARD_BAGGAGE_FEES";
    if (input.numberOfPassengers > 1)
        reasonCode = "FAMILY_MULTIPLIED";
    if (overweightFeeTotal > 0)
        reasonCode = "OVERWEIGHT_STACKED";
    if (oversizeFeeTotal > 0)
        reasonCode = "OVERSIZE_STACKED";
    return {
        schemaVersion: "v1",
        scenario,
        baseBaggageFeeTotal,
        overweightFeeTotal,
        oversizeFeeTotal,
        totalBaggageCost,
        currency: p.currency,
        reasonCode,
        outcomeRisk
    };
}
