export function buildStoryline(output) {
    if (output.scenario === "checkin.policy_missing") {
        return {
            headline: "Policy missing or invalid input.",
            verdict: "We cannot determine your check-in deadline.",
            lossSummary: "Please check your flight details.",
            whyThisHappens: "The airline policy data is not available for this carrier.",
            whatHappensNext: []
        };
    }
    const headline = "Here’s what happens if you arrive at the airport now.";
    let verdict = "";
    let lossSummary = "";
    let whyThisHappens = "";
    let whatHappensNext = [];
    if (output.scenario === "checkin.already_checked_in") {
        verdict = "You have already secured your boarding pass.";
        lossSummary = "No additional check-in fees apply.";
        whyThisHappens = "Since online check-in is complete, you can proceed directly to baggage drop or security.";
        whatHappensNext = [
            "Head to the airport as planned",
            "Ensure you have your digital or printed boarding pass",
            "Check baggage drop deadlines if traveling with hold luggage"
        ];
    }
    else if (output.scenario === "checkin.online_still_available") {
        verdict = "Online check-in is STILL OPEN.";
        lossSummary = "You can avoid the airport fee by checking in now.";
        whyThisHappens = `This airline closes free online check-in ${output.deadlineHours} hours before departure. You have ${Math.floor(output.hoursRemaining)}h remaining.`;
        whatHappensNext = [
            "Go to the airline website or app immediately",
            "Complete check-in for all passengers",
            "Download boarding passes to your device"
        ];
    }
    else if (output.scenario === "checkin.missed_online_deadline") {
        verdict = "You WILL be charged an airport check-in fee.";
        lossSummary = `You are expected to pay ${output.currency}${output.totalFee} at the airport.`;
        whyThisHappens = `This airline closed free online check-in ${output.deadlineHours} hours before departure. Since you missed this window, a manual processing fee applies.`;
        whatHappensNext = [
            "Airport check-in is required",
            "Fee is charged per passenger",
            "Payment collected before boarding pass issuance"
        ];
    }
    return {
        headline,
        verdict,
        lossSummary,
        whyThisHappens,
        whatHappensNext
    };
}
