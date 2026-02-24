export function calculateOutput(input, scenario, policy) {
    const round = (val) => Math.round(val * 100) / 100;
    const baseOutput = {
        schemaVersion: "v1",
        scenario,
        refundAmount: 0,
        creditAmount: 0,
        penaltyAmount: 0,
        totalLoss: 0,
        refundMethod: "none",
        currency: "$",
        reasonCode: "POLICY_NOT_FOUND",
        outcomeRisk: "cannot_determine"
    };
    if (!policy && scenario !== "cancellation.policy_missing") {
        // Safety fallback if mapper returned something weird
        return baseOutput;
    }
    const price = input.ticketPrice;
    switch (scenario) {
        case "cancellation.regulatory_24h":
            return {
                ...baseOutput,
                refundAmount: round(price),
                refundMethod: "cash",
                reasonCode: "US_24H_RULE",
                outcomeRisk: "safe"
            };
        case "cancellation.refundable_fare":
            return {
                ...baseOutput,
                refundAmount: round(price),
                refundMethod: "cash",
                reasonCode: "REFUNDABLE_FARE",
                outcomeRisk: "safe"
            };
        case "cancellation.basic_economy_forfeit":
        case "cancellation.late_forfeit":
            return {
                ...baseOutput,
                penaltyAmount: round(price),
                totalLoss: round(price),
                reasonCode: scenario === "cancellation.late_forfeit" ? "LATE_FORFEITURE" : "BASIC_ECONOMY_FORFEIT",
                outcomeRisk: "full_loss"
            };
        case "cancellation.award_fee":
            const awardFee = policy?.awardRedepositFee || 0;
            return {
                ...baseOutput,
                penaltyAmount: round(awardFee),
                totalLoss: round(awardFee),
                reasonCode: "AWARD_REDEPOSIT_FEE",
                outcomeRisk: "partial_loss"
            };
        case "cancellation.standard_fee_credit":
            const fee = policy?.cancellationFeeAmount || 0;
            const feePercent = policy?.cancellationFeePercent || 0;
            let penalty = fee;
            if (feePercent > 0) {
                penalty = price * (feePercent / 100);
            }
            const credit = Math.max(0, price - penalty);
            const actualPenalty = price - credit; // Forced reconciliation
            return {
                ...baseOutput,
                creditAmount: round(credit),
                penaltyAmount: round(actualPenalty),
                totalLoss: round(actualPenalty),
                refundMethod: "credit",
                reasonCode: "STANDARD_CANCELLATION_FEE",
                outcomeRisk: "partial_loss"
            };
        case "cancellation.policy_missing":
        default:
            return baseOutput;
    }
}
