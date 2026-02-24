function roundToTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
export function calculateOutput(input, mapper) {
    const { scenario, deadlineHours, hoursRemaining, policy } = mapper;
    if (scenario === "checkin.policy_missing" || !policy) {
        return {
            schemaVersion: "v1",
            scenario: "checkin.policy_missing",
            deadlineHours: 0,
            hoursRemaining: Math.max(0, hoursRemaining),
            feePerPassenger: 0,
            totalFee: 0,
            currency: "N/A",
            feeApplies: false,
            reasonCode: "POLICY_NOT_FOUND",
            outcomeRisk: "cannot_determine"
        };
    }
    const feePerPassenger = policy.airport_fee.amount;
    const currency = policy.airport_fee.currency;
    let feeApplies = false;
    let totalFee = 0;
    if (scenario === "checkin.missed_online_deadline") {
        feeApplies = true;
        totalFee = roundToTwoDecimals(feePerPassenger * input.passengerCount);
    }
    const outcomeRisk = scenario === "checkin.already_checked_in" || scenario === "checkin.online_still_available"
        ? "safe" : "fee_applies";
    const reasonCode = scenario === "checkin.already_checked_in" ? "ALREADY_CHECKED_IN" :
        scenario === "checkin.online_still_available" ? "CHECKIN_STILL_OPEN" :
            "MISSED_ONLINE_DEADLINE";
    return {
        schemaVersion: "v1",
        scenario,
        deadlineHours,
        hoursRemaining: Math.max(0, hoursRemaining),
        feePerPassenger,
        totalFee,
        currency,
        feeApplies,
        reasonCode,
        outcomeRisk
    };
}
