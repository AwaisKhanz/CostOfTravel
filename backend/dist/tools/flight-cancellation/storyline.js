export function buildStoryline(output) {
    const { scenario, refundAmount, creditAmount, totalLoss, currency, refundMethod } = output;
    if (scenario === "cancellation.policy_missing") {
        return {
            headline: "Policy Information Missing",
            verdict: "We cannot determine the exact cancellation cost at this time.",
            lossSummary: "The specific fare rules for this carrier are not in our database.",
            whyThisHappens: "Fare rules are highly complex and vary significantly by booking class and date.",
            whatHappensNext: [
                "Check your flight confirmation email for 'Fare Rules' or 'Conditions'",
                "Log in to the airline's website and select 'Manage Booking'",
                "Contact the airline directly to request a quote for cancellation"
            ]
        };
    }
    const lossText = totalLoss > 0 ? `Total Loss: ${currency}${totalLoss}` : "No Financial Loss";
    switch (scenario) {
        case "cancellation.regulatory_24h":
            return {
                headline: "FULL REFUND ELIGIBLE",
                verdict: "You are entitled to a complete cash refund under US DOT regulations.",
                lossSummary: "Loss: $0.00 (Protected window)",
                whyThisHappens: "The US Department of Transportation requires airlines to allow cancellations within 24 hours of booking for flights departing at least 7 days later.",
                whatHappensNext: [
                    "Cancel within the next hour to ensure you remain in the 24h window",
                    "Ensure the refund is processed to your original form of payment",
                    "Request a confirmation number for the refund request"
                ]
            };
        case "cancellation.refundable_fare":
            return {
                headline: "REFUNDABLE FARE CONFIRMED",
                verdict: "This ticket is eligible for a full refund based on the fare type purchased.",
                lossSummary: "Loss: $0.00 (Excluding optional add-ons)",
                whyThisHappens: "You purchased a flexible/refundable fare class which explicitly allows for cash returns upon cancellation.",
                whatHappensNext: [
                    "Initiate the refund through the airline's mobile app or website",
                    "Allow 7-10 business days for the funds to reflect in your account",
                    "Retain a copy of the cancellation receipt"
                ]
            };
        case "cancellation.basic_economy_forfeit":
            return {
                headline: "TICKET IS NON-REFUNDABLE",
                verdict: "Basic Economy fares typically result in a 100% loss upon cancellation.",
                lossSummary: `Loss: ${currency}${totalLoss}`,
                whyThisHappens: "Basic Economy is a restricted fare class designed for lower price points in exchange for zero flexibility.",
                whatHappensNext: [
                    "Check if your route was significantly changed by the airline (which might trigger a refund)",
                    "Wait to cancel until closer to the flight in case of an airline-initiated cancellation",
                    "Consult your credit card's trip cancellation insurance if applicable"
                ]
            };
        case "cancellation.standard_fee_credit":
            return {
                headline: "PARTIAL RECOVERY AVAILABLE",
                verdict: `You will receive a travel credit after a ${currency}${output.penaltyAmount} cancellation fee.`,
                lossSummary: `Loss: ${currency}${totalLoss} (Cancellation Fee)`,
                whyThisHappens: "Standard economy fares are non-refundable to cash but allow for credit recovery minus a penalty.",
                whatHappensNext: [
                    "Accept the travel credit into your airline frequent flyer account",
                    "Note the expiration date of the credit (usually 12 months from original booking)",
                    "Use the credit for future travel on the same airline"
                ]
            };
        case "cancellation.late_forfeit":
            return {
                headline: "LATE CANCELLATION FORFEITURE",
                verdict: "Cancellations within 24 hours of departure often incur a total loss of ticket value.",
                lossSummary: `Loss: ${currency}${totalLoss}`,
                whyThisHappens: "Airlines restrict late-stage cancellations to prevent empty seats that cannot be resold.",
                whatHappensNext: [
                    "Contact the airline directly to see if they can offer a 'goodwill' credit",
                    "Consider 'changing' the flight instead of cancelling (fees may be higher)",
                    "Check for medical or emergency exceptions in the contract of carriage"
                ]
            };
        case "cancellation.award_fee":
            return {
                headline: "AWARD MILES RECOVERY",
                verdict: `Your miles can be redeposited for a ${currency}${output.penaltyAmount} fee.`,
                lossSummary: `Loss: ${currency}${totalLoss} (Redeposit Fee)`,
                whyThisHappens: "Award tickets allow point recovery but often require a processing fee to return miles to your account.",
                whatHappensNext: [
                    "Pay the redeposit fee to recover your points/miles immediately",
                    "Confirm that the miles are returned with their original expiration dates",
                    "Allow 24-48 hours for the mileage balance to update"
                ]
            };
        default:
            return {
                headline: "Status Unknown",
                verdict: "We cannot calculate your loss at this time.",
                lossSummary: "Calculation paused.",
                whyThisHappens: "Input parameters do not match any known carrier scenarios.",
                whatHappensNext: ["Contact carrier support"]
            };
    }
}
