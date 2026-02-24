import { getNextCliff } from './nextCliff.js';
function roundToTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
export function calculateOutput(input, mapper) {
    const { scenario, finalPenaltyPercent, daysBeforeSail, matchedMinDays, policy } = mapper;
    if (scenario === "cancellation.cannot_determine" || !policy) {
        return {
            schemaVersion: "v1",
            scenario: "cancellation.cannot_determine",
            penaltyPercent: 0,
            penaltyAmount: 0,
            refundAmount: 0,
            refundMethod: "none",
            reasonCode: "POLICY_NOT_FOUND",
            outcomeRisk: "cannot_determine"
        };
    }
    // Financial Math (MANDATORY ROUNDING as per spec)
    const penaltyAmount = roundToTwoDecimals(input.totalTripCost * (finalPenaltyPercent / 100));
    const refundAmount = roundToTwoDecimals(input.totalTripCost - penaltyAmount);
    // Refund Method
    // Derived from refund_method_by_percent mapping, fallback "none"
    const refundMethod = policy.refund_method_by_percent[finalPenaltyPercent] || "none";
    // Determine Next Cliff insight
    const cliff = getNextCliff(policy, matchedMinDays, daysBeforeSail);
    // Map Outcome Risk & Reason Code
    const outcomeRisk = scenario === "cancellation.full_refund_window" ? "safe" :
        scenario === "cancellation.full_penalty_window" ? "full_loss" :
            "partial_loss";
    const reasonCode = scenario === "cancellation.full_refund_window" ? "FULL_REFUND_WINDOW" :
        scenario === "cancellation.full_penalty_window" ? "FULL_FORFEITURE" :
            scenario === "cancellation.high_penalty_window" ? "HIGH_PENALTY" :
                "PARTIAL_PENALTY";
    const output = {
        schemaVersion: "v1",
        scenario,
        penaltyPercent: finalPenaltyPercent,
        penaltyAmount,
        refundAmount,
        refundMethod: refundMethod,
        reasonCode,
        outcomeRisk
    };
    if (cliff) {
        output.nextPenaltyCliffDays = cliff.nextPenaltyCliffDays;
        output.nextPenaltyCliffPercent = cliff.nextPenaltyCliffPercent;
        output.daysUntilNextCliff = cliff.daysUntilNextCliff;
    }
    return output;
}
