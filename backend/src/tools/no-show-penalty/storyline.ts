import type { NoShowOutput, Storyline } from './types.js';

export function buildStoryline(output: NoShowOutput): Storyline {
  const { scenario, refundAmount, creditAmount, penaltyAmount, currency, remainingSegmentsCancelled } = output;

  const segmentWarning = remainingSegmentsCancelled 
    ? "WARNING: The airline's automated systems have likely cancelled all remaining flights on this itinerary (including your return flight)."
    : "Your remaining flights on this itinerary may still be valid, but you must confirm with the airline immediately.";

  if (scenario === "no_show.policy_missing") {
    return {
      headline: "Policy Information Missing",
      verdict: "We cannot determine the exact forfeiture penalty at this time.",
      lossSummary: "Carrier-specific no-show rules are required for this calculation.",
      whyThisHappens: "No-show fees vary by booking class and are subject to change without notice.",
      itineraryImpact: "Unknown. Contact the airline to ensure remaining segments are not cancelled.",
      whatHappensNext: [
        "Check your ticket confirmation for 'No-Show' or 'Cancellations'",
        "Contact the carrier directly for a manual policy review"
      ]
    };
  }

  const lossText = penaltyAmount > 0 ? `Total Penalty: ${currency}${penaltyAmount}` : "No Financial Penalty";

  switch (scenario) {
    case "no_show.not_applicable":
      return {
        headline: "NOT A NO-SHOW",
        verdict: "You successfully cancelled before departure or did not miss the flight.",
        lossSummary: "Loss: $0.00 (from no-show penalties specifically)",
        whyThisHappens: "Because you took action before the flight departed, standard cancellation rules apply rather than punitive no-show forfeiture rules.",
        itineraryImpact: "Standard cancellation rules govern the remaining segments.",
        whatHappensNext: [
          "Use the Standard Cancellation tool to determine your refund/credit eligibility.",
          "Keep your cancellation confirmation number safe."
        ]
      };

    case "no_show.full_forfeit":
      return {
        headline: "TICKET FULLY FORFEITED",
        verdict: "The airline has voided all value associated with this ticket due to a no-show.",
        lossSummary: `Total Loss: ${currency}${penaltyAmount}`,
        whyThisHappens: "Basic Economy and most standard non-refundable fares explicitly state that failing to board without prior cancellation results in total forfeiture of funds.",
        itineraryImpact: segmentWarning,
        whatHappensNext: [
          "Do not assume your return flight is still booked.",
          "Check if your travel insurance covers the reason you missed the flight (e.g., severe illness, accident on the way to the airport).",
          "Rebook your travel immediately if you still need to reach your destination."
        ]
      };

    case "no_show.credit_retained":
      return {
        headline: "PARTIAL EXCEPTION: CREDIT RETAINED",
        verdict: `Despite the no-show, you retain ${currency}${creditAmount} in travel credit.`,
        lossSummary: lossText,
        whyThisHappens: "Some flexible fares or specific airline policies allow the residual value of a ticket to be converted to credit even if the passenger fails to board.",
        itineraryImpact: segmentWarning,
        whatHappensNext: [
          "Verify the credit balance in your frequent flyer account.",
          "Note the expiration date of the travel voucher.",
          "Confirm the status of your return flights with the airline."
        ]
      };

    case "no_show.refund_possible":
      return {
        headline: "REFUND EXCEPTION APPLIED",
        verdict: `You are eligible for a refund of ${currency}${refundAmount}, minus applicable no-show fees.`,
        lossSummary: lossText,
        whyThisHappens: "You purchased a fully refundable fare class that explicitly protects the ticket value even in the event of a no-show.",
        itineraryImpact: segmentWarning,
        whatHappensNext: [
          "Request the cash refund through the airline's website or customer service.",
          "Ensure secondary flights on the itinerary are handled correctly.",
          "Allow up to two billing cycles for the refund to process."
        ]
      };

    case "no_show.award_redeposit":
      return {
        headline: "AWARD NO-SHOW PENALTY",
        verdict: `Your miles/points can be recovered by paying a ${currency}${penaltyAmount} fee.`,
        lossSummary: `Total Fees: ${currency}${penaltyAmount}`,
        whyThisHappens: "Award tickets generally allow for mileage redeposit after a no-show, but impose stricter cash penalties than standard cancellations.",
        itineraryImpact: segmentWarning,
        whatHappensNext: [
          "Pay the redeposit fee online or via phone to recover the miles.",
          "Ensure your remaining itinerary is rebuilt if you still plan to travel."
        ]
      };

    default:
      return {
        headline: "Status Unknown",
        verdict: "We cannot calculate your no-show penalty at this time.",
        lossSummary: "Calculation paused.",
        whyThisHappens: "Scenario mapping failed to find a match.",
        itineraryImpact: "Unknown.",
        whatHappensNext: ["Contact carrier support"]
      };
  }
}
