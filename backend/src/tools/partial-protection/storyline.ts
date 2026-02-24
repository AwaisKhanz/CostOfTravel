import type { Scenario, PartialProtectionOutput } from './types.js';

export function buildStoryline(output: PartialProtectionOutput) {
  const { scenario, protectedAmount, unprotectedAmount } = output;

  const m = (val: number) => `$${val.toLocaleString()}`;

  switch (scenario) {
    case "protection.none":
      return {
        headline: "Zero Financial Protection",
        verdict: "You are currently 100% exposed to cancellation losses.",
        exposureSummary: `Your total trip cost of ${m(output.totalTripCost)} is completely unprotected.`,
        whyThisHappens: "Without a travel insurance policy or qualifying credit card coverage, airlines and hotels typically enforce their standard non-refundable fare rules.",
        whatHappensNext: [
          "Check if any individual bookings are refundable.",
          "Consider purchasing a policy if you are still within the purchase window.",
          "Verify if your credit card offers secondary travel benefits."
        ]
      };
    case "protection.limited":
      return {
        headline: "Ineligible Cancellation Reason",
        verdict: "Your reason for cancelling is not covered by this policy.",
        exposureSummary: `You remain responsible for ${m(unprotectedAmount)} in costs.`,
        whyThisHappens: "Standard policies only cover 'Named Perils' like illness or weather. Personal change of mind or minor schedule changes are often excluded.",
        whatHappensNext: [
          "Review your policy's 'Exclusions' section.",
          "Request a credit from providers instead of a cash refund.",
          "See if a 'Cancel For Any Reason' (CFAR) rider can be added."
        ]
      };
    case "protection.partial":
      return {
        headline: "Delayed Purchase Limitation",
        verdict: "Late protection purchase has restricted your coverage.",
        exposureSummary: `Only ${m(protectedAmount)} is protected due to timing rules.`,
        whyThisHappens: "Many benefits (like Pre-Existing Condition waivers or certain disruptions) require the policy to be bought within 10-14 days of your initial trip deposit.",
        whatHappensNext: [
          "Check the exact 'Effective Date' on your policy certificate.",
          "Submit claims only for categories that do not require early purchase.",
          "Verify the date of your first trip payment."
        ]
      };
    case "protection.broad":
      return {
        headline: output.unprotectedAmount > 0 ? "Fragmented Trip Protection" : "Full Trip Protection",
        verdict: output.unprotectedAmount > 0 
          ? `You have coverage, but ${m(unprotectedAmount)} remains at risk.`
          : "Your primary trip costs are fully protected.",
        exposureSummary: `${m(protectedAmount)} is covered against this specific cancellation reason.`,
        whyThisHappens: output.unprotectedAmount > 0 
          ? "Protection often excludes specific fees (baggage, pets) or capped limits on hotel/airfare."
          : "Based on the provided costs and policy details, your core expenses fall within the covered categories and limits.",
        whatHappensNext: [
          "Keep receipts for all non-refundable deposits.",
          "Ensure you have a doctor's note if cancelling for illness.",
          "Contact your provider's 24/7 assistance line before cancelling."
        ]
      };
    default:
      return {
        headline: "Audit Incomplete",
        verdict: "We couldn't determine your exact coverage levels.",
        exposureSummary: "Policy data for this provider is currently missing from our engine.",
        whyThisHappens: "We require normalized category mappings to calculate specific protection amounts.",
        whatHappensNext: [
          "Manually check if Airfare and Hotel are 'Covered Reasons'.",
          "Identify the 'Maximum Benefit' amount in your Summary of Benefits.",
          "Look for 'Excluded Expenses' in the fine print."
        ]
      };
  }
}
