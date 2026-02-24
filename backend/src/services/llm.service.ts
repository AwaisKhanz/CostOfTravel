export async function generateExplanation(output: any): Promise<string> {
  // Simulate network latency for LLM generation
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const { scenario, outcomeRisk, reasonCode, isCovered, refundAmount, allowed } = output;

    // We build a generic, highly humanized explanation based on the abstract outputs.
    // The strict rule is that we ONLY have the output fields, not the raw policy values.
    
    let polish = `Based on the system calculation for the **${(scenario || 'travel').replace(/_/g, ' ')}** scenario, you are facing a **${(outcomeRisk || '').replace(/_/g, ' ')}** financial situation. `;

    if (reasonCode) {
      polish += `The primary technical reason triggered by the rules engine is \`${reasonCode}\`. `;
    }

    if (isCovered === true || allowed === true || refundAmount && refundAmount > 0) {
      polish += `\n\n**The Good News:** You are largely protected in this situation. The mathematical analysis confirmed that your request falls within the allowed boundaries of the travel provider's strict tariffs or coverage limits.`;
    } else {
      polish += `\n\n**The Hard Truth:** Unfortunately, you have firmly hit an exclusion or limit constraint in this scenario. Travel providers enforce these legal limits strictly, so appealing through standard customer service channels is highly unlikely to yield a different financial result.`;
    }

    if (output.intel && Array.isArray(output.intel) && output.intel.length > 0) {
       polish += `\n\n*As a piece of industry insight, remember that ${output.intel[0].text.toLowerCase()}*`;
    }

    return polish;

  } catch (err) {
    // Graceful fallback if the "LLM" is down or input is totally malformed
    return "The AI Explanation service is temporarily unable to process the result. Please rely directly on the deterministic calculation shown above.";
  }
}
