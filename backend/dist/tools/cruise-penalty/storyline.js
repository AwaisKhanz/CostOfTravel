export function buildStoryline(output) {
    if (output.outcomeRisk === "cannot_determine") {
        return {
            headline: "Policy not found or invalid dates.",
            verdict: "We cannot determine your penalty.",
            lossSummary: "Please check your dates and cruise line.",
            whyThisHappens: "The dates provided are not mathematically valid or the policy is missing.",
            whatHappensNext: []
        };
    }
    const headline = "Here’s what happens if you cancel today.";
    let verdict = "";
    let lossSummary = "";
    let whyThisHappens = "This cruise line’s cancellation schedule applies this penalty within the current time window.";
    let whatHappensNext = [];
    if (output.outcomeRisk === "safe") {
        verdict = "You are in the full refund window.";
        lossSummary = "Canceling now results in a 0% penalty.";
        whatHappensNext = [
            "Refund processed to original payment method",
            "May take 7–14 business days",
            "Check if any non-refundable deposits were made separately"
        ];
    }
    else if (output.outcomeRisk === "partial_loss") {
        verdict = "You will lose part of your cruise fare.";
        lossSummary = `Canceling now results in a ${output.penaltyPercent}% penalty.`;
        whatHappensNext = [
            `Refund of ${output.refundAmount} issued according to policy`,
            "Remaining balance retained by the cruise line",
            "Processing time varies by carrier"
        ];
    }
    else if (output.outcomeRisk === "full_loss") {
        verdict = "Your cruise fare is fully forfeited.";
        lossSummary = "Canceling now results in a 100% penalty.";
        whatHappensNext = [
            "No refund will be issued.",
            "Taxes and port fees are usually refunded on request.",
        ];
    }
    if (output.nextPenaltyCliffPercent && output.daysUntilNextCliff) {
        whatHappensNext.push(`Your penalty increases to ${output.nextPenaltyCliffPercent}% in ${output.daysUntilNextCliff} days.`);
    }
    return {
        headline,
        verdict,
        lossSummary,
        whyThisHappens,
        whatHappensNext
    };
}
