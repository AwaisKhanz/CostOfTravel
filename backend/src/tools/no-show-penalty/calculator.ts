import type { NoShowInput, NoShowOutput, Scenario, NoShowPolicy } from './types.js';

export function calculateOutput(
  input: NoShowInput,
  scenario: Scenario,
  policy: NoShowPolicy | null
): NoShowOutput {
  const round = (val: number) => Math.round(val * 100) / 100;
  const price = input.ticketPrice;
  const autoCancel = policy?.autoCancelRemainingSegments ?? false;

  const baseOutput: NoShowOutput = {
    schemaVersion: "v1",
    scenario,
    ticketForfeited: false,
    refundAmount: 0,
    creditAmount: 0,
    penaltyAmount: 0,
    currency: "$",
    creditExpirationMonths: null,
    remainingSegmentsCancelled: autoCancel,
    reasonCode: "POLICY_NOT_FOUND",
    outcomeRisk: "cannot_determine"
  };

  if (!policy && scenario !== "no_show.policy_missing") {
    return baseOutput;
  }

  switch (scenario) {
    case "no_show.not_applicable":
      return {
        ...baseOutput,
        reasonCode: "NOT_A_NO_SHOW",
        outcomeRisk: "safe",
        remainingSegmentsCancelled: false
      };

    case "no_show.full_forfeit":
      return {
        ...baseOutput,
        ticketForfeited: true,
        penaltyAmount: round(price),
        reasonCode: "FULL_FORFEIT",
        outcomeRisk: "full_loss"
      };

    case "no_show.credit_retained": {
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
        creditExpirationMonths: policy?.creditExpirationMonths || 12,
        reasonCode: "CREDIT_RETAINED",
        outcomeRisk: "partial_loss"
      };
    }

    case "no_show.refund_possible": {
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
        reasonCode: "REFUNDABLE_OVERRIDE",
        outcomeRisk: "partial_loss" // Often partial due to no-show vs standard cancellation
      };
    }

    case "no_show.award_redeposit": {
      const redepositFee = policy?.awardRedepositFee || 0;
      return {
        ...baseOutput,
        penaltyAmount: round(redepositFee),
        reasonCode: "AWARD_REDEPOSIT_RULE",
        outcomeRisk: "partial_loss"
      };
    }

    case "no_show.policy_missing":
    default:
      return baseOutput;
  }
}
