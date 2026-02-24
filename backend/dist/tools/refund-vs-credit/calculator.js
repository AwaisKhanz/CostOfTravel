export function calculateOutput(input, scenario, policy) {
    const round = (val) => Math.round(val * 100) / 100;
    const price = input.ticketPrice;
    const baseOutput = {
        schemaVersion: "v1",
        scenario,
        refundAmount: 0,
        creditAmount: 0,
        penaltyAmount: 0,
        currency: "$",
        creditExpirationMonths: null,
        refundMethod: "none",
        reasonCode: "POLICY_NOT_FOUND",
        outcomeRisk: "cannot_determine"
    };
    if (!policy && scenario !== "refund.policy_missing") {
        return baseOutput;
    }
    switch (scenario) {
        case "refund.airline_initiated_cash":
            return {
                ...baseOutput,
                refundAmount: round(price),
                refundMethod: "cash",
                reasonCode: "AIRLINE_INITIATED",
                outcomeRisk: "safe"
            };
        case "refund.regulatory_cash":
            return {
                ...baseOutput,
                refundAmount: round(price),
                refundMethod: "cash",
                reasonCode: "US_24H_RULE",
                outcomeRisk: "safe"
            };
        case "refund.refundable_fare": {
            const refundPenaltyDef = policy?.cancellationFeeAmount || 0;
            const refundPenaltyPct = policy?.cancellationFeePercent || 0;
            let rPenalty = refundPenaltyDef;
            if (refundPenaltyPct > 0) {
                rPenalty = price * (refundPenaltyPct / 100);
            }
            const actualPenalty = Math.min(price, rPenalty);
            const refund = price - actualPenalty;
            return {
                ...baseOutput,
                refundAmount: round(refund),
                penaltyAmount: round(actualPenalty),
                refundMethod: "cash",
                reasonCode: "REFUNDABLE_FARE",
                outcomeRisk: "safe"
            };
        }
        case "refund.credit_only": {
            const creditPenaltyDef = policy?.cancellationFeeAmount || 0;
            const creditPenaltyPct = policy?.cancellationFeePercent || 0;
            let cPenalty = creditPenaltyDef;
            if (creditPenaltyPct > 0) {
                cPenalty = price * (creditPenaltyPct / 100);
            }
            const actualCreditPenalty = Math.min(price, cPenalty);
            const credit = price - actualCreditPenalty;
            return {
                ...baseOutput,
                creditAmount: round(credit),
                penaltyAmount: round(actualCreditPenalty),
                creditExpirationMonths: policy?.creditExpirationMonths || null,
                refundMethod: "credit",
                reasonCode: "CREDIT_ONLY_FARE",
                outcomeRisk: "partial_loss"
            };
        }
        case "refund.no_refund":
            return {
                ...baseOutput,
                penaltyAmount: round(price),
                refundMethod: "none",
                reasonCode: "NO_REFUND_ALLOWED",
                outcomeRisk: "full_loss"
            };
        case "refund.award_fee": {
            const redepositFee = policy?.awardRedepositFee || 0;
            return {
                ...baseOutput,
                penaltyAmount: round(redepositFee),
                refundMethod: "none",
                reasonCode: "AWARD_REDEPOSIT_FEE",
                outcomeRisk: "partial_loss"
            };
        }
        case "refund.policy_missing":
        default:
            return baseOutput;
    }
}
