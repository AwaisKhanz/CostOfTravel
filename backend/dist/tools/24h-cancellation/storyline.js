export function buildStoryline(output) {
    if (output.scenario === "cancellation.free_24h") {
        return {
            headline: "Here’s what happens if you cancel today.",
            verdict: "You ARE eligible for a full refund.",
            lossSummary: "If you cancel now, you should receive your full payment back.",
            whyThisHappens: "US regulations require airlines to refund tickets canceled within 24 hours when departure is more than 7 days away.",
            whatHappensNext: [
                "Refund processed to original payment method",
                "May take 5–10 business days",
                "No cancellation fee deducted"
            ]
        };
    }
    if (output.scenario === "cancellation.short_notice") {
        return {
            headline: "The 24-hour rule does not apply.",
            verdict: "You are NOT eligible for a mandated refund.",
            lossSummary: "Because your flight departs in less than 7 days, the US 24-hour refund rule does not apply.",
            whyThisHappens: "The DOT 24-hour rule only covers flights booked at least 7 days before departure.",
            whatHappensNext: []
        };
    }
    if (output.scenario === "cancellation.outside_24h") {
        return {
            headline: "The 24-hour window has closed.",
            verdict: "You are NOT eligible for a mandated refund.",
            lossSummary: "It has been more than 24 hours since you booked your ticket.",
            whyThisHappens: "The mandatory refund window expires exactly 24 hours after booking.",
            whatHappensNext: []
        };
    }
    if (output.scenario === "cancellation.non_us_departure") {
        return {
            headline: "US rules don't apply.",
            verdict: "The U.S. 24-hour rule does not apply.",
            lossSummary: "We cannot determine your eligibility based on US DOT rules.",
            whyThisHappens: "This protection applies only to flights departing from the United States.",
            whatHappensNext: []
        };
    }
    return {
        headline: "Unable to calculate.",
        verdict: "Invalid input provided.",
        lossSummary: "Please check your dates and try again.",
        whyThisHappens: "The booking date must be in the past and before the departure date.",
        whatHappensNext: []
    };
}
