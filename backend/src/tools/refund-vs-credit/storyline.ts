import type { RefundVsCreditOutput, Storyline } from './types.js';

export function buildStoryline(output: RefundVsCreditOutput): Storyline {
  const { scenario, refundAmount, creditAmount, penaltyAmount, currency, creditExpirationMonths } = output;

  if (scenario === "refund.policy_missing") {
    return {
      headline: "Policy Information Missing",
      verdict: "We cannot determine the exact refund eligibility at this time.",
      lossSummary: "Carrier-specific fare rules are required for this calculation.",
      whyThisHappens: "Fare rules vary by booking class and are subject to change without notice.",
      whatHappensNext: [
        "Check your ticket confirmation for 'Fare Basis' or 'Conditions'",
        "Log in to the airline website and select 'Manage Booking'",
        "Contact the carrier directly for a manual policy review"
      ]
    };
  }

  const lossText = penaltyAmount > 0 ? `Total Penalty: ${currency}${penaltyAmount}` : "No Cancellation Penalty";

  switch (scenario) {
    case "refund.airline_initiated_cash":
      return {
        headline: "FULL CASH REFUND ELIGIBLE",
        verdict: "The airline is required to provide a full cash refund because they initiated the cancellation.",
        lossSummary: "Loss: $0.00 (Carrier-enforced cancellation)",
        whyThisHappens: "Consumer protection laws require airlines to refund passengers in full if the airline cancels the flight or makes a significant schedule change.",
        whatHappensNext: [
          "Request the refund to be sent to your original form of payment",
          "Ensure they do not force you to accept a travel voucher instead",
          "Keep your original booking confirmation as proof of the contract"
        ]
      };

    case "refund.regulatory_cash":
      return {
        headline: "US 24-HOUR REFUND ELIGIBLE",
        verdict: "You are entitled to a full cash refund under the US DOT 24-hour rule.",
        lossSummary: "Loss: $0.00 (Protected window)",
        whyThisHappens: "The US Department of Transportation mandates a 24-hour penalty-free cancellation window for flights booked at least 7 days before departure.",
        whatHappensNext: [
          "Complete the cancellation immediately within the 24h window",
          "Confirm the refund amount matches the total price paid",
          "Retain the cancellation receipt for your records"
        ]
      };

    case "refund.refundable_fare":
      return {
        headline: "REFUNDABLE TICKET CONFIRMED",
        verdict: `You will receive a refund of ${currency}${refundAmount} to your original payment method.`,
        lossSummary: lossText,
        whyThisHappens: "You purchased a flexible fare class that explicitly permits cash refunds upon cancellation.",
        whatHappensNext: [
          "Initiate the refund via the airline app or website",
          "Verify that the net refund amount matches our calculation",
          "Allow 7-10 business days for the credit to appear on your statement"
        ]
      };

    case "refund.credit_only":
      return {
        headline: "TRAVEL CREDIT RECOVERY",
        verdict: `You are eligible for a travel credit worth ${currency}${creditAmount}.`,
        lossSummary: lossText,
        whyThisHappens: "Your fare is non-refundable to cash but allows for the remaining value to be stored as a future travel voucher.",
        creditDetails: `This credit will typically expire in ${creditExpirationMonths} months.`,
        whatHappensNext: [
          "Accept the travel voucher from the airline",
          "Note the expiration date of the credit in your calendar",
          "Use the credit for any future flight on the same airline"
        ]
      };

    case "refund.no_refund":
      return {
        headline: "TICKET IS NON-REFUNDABLE",
        verdict: "This booking results in a total loss of the ticket value.",
        lossSummary: `Total Loss: ${currency}${penaltyAmount}`,
        whyThisHappens: "Basic Economy and highly restricted promotional fares typically provide zero recovery value upon passenger-initiated cancellation.",
        whatHappensNext: [
          "Check if your travel insurance covers the reason for cancellation",
          "Wait to cancel until closer to departure in case the airline cancels first",
          "Review your credit card benefits for trip cancellation protection"
        ]
      };

    case "refund.award_fee":
      return {
        headline: "AWARD TICKET RECLAMATION",
        verdict: `You can redeposit your miles/points for a ${currency}${penaltyAmount} fee.`,
        lossSummary: `Redeposit Fee: ${currency}${penaltyAmount}`,
        whyThisHappens: "Award tickets allow point recovery but often require a service fee to process the return to your loyalty account.",
        whatHappensNext: [
          "Confirm with the airline that miles will be returned to your balance",
          "Pay the redeposit fee to trigger the points return",
          "Check that the original mileage expiration dates are maintained"
        ]
      };

    default:
      return {
        headline: "Status Unknown",
        verdict: "We cannot calculate your refund at this time.",
        lossSummary: "Calculation paused.",
        whyThisHappens: "Scenario mapping failed to find a match.",
        whatHappensNext: ["Contact carrier support"]
      };
  }
}
