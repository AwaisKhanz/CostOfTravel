import type { FamilyBaggageOutput, Storyline } from "./types.js";

export function buildStoryline(output: FamilyBaggageOutput): Storyline {
  const { scenario, totalBaggageCost, currency, baseBaggageFeeTotal, overweightFeeTotal, oversizeFeeTotal } = output;

  if (scenario === "baggage.policy_missing") {
    return {
      headline: "Policy Data Unavailable",
      verdict: "We cannot determine the specific baggage fees for this airline/route combination.",
      costSummary: "Calculation suspended due to missing tariff data.",
      whyThisHappens: "Specific fee schedules vary significantly between carriers and routes. Verify directly with the airline."
    };
  }

  let headline = "Standard Family Baggage Fees";
  if (output.outcomeRisk === "safe") headline = "Zero Baggage Fees Detected";
  if (output.outcomeRisk === "high_cost") headline = "High Baggage Penalty Warning";

  let verdict = `Your estimated total baggage cost is ${totalBaggageCost} ${currency}.`;
  if (totalBaggageCost === 0) verdict = "You have no estimated baggage fees for this configuration.";

  let costSummary = `Base fees: ${baseBaggageFeeTotal} ${currency}. `;
  if (overweightFeeTotal > 0) costSummary += `Overweight penalties: ${overweightFeeTotal} ${currency}. `;
  if (oversizeFeeTotal > 0) costSummary += `Oversize penalties: ${oversizeFeeTotal} ${currency}. `;

  let whyThisHappens = "Baggage fees are strictly calculated per bag and per passenger. Penalties for weight and size are stacked independently of standard base fees.";
  if (scenario === "baggage.family_amplified") {
    whyThisHappens = "At least one bag exceeds the airline's standard weight or size thresholds, triggering non-refundable penalty fees that stack on top of base rates.";
  }

  return {
    headline,
    verdict,
    costSummary,
    whyThisHappens
  };
}
