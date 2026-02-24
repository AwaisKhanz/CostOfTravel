import type { PetBreedOutput, Storyline } from './types.js';

export function buildStoryline(output: PetBreedOutput): Storyline {
  const { scenario, restrictionType, reasonCode } = output;

  if (scenario === "pet.policy_missing") {
    return {
      headline: "Policy Information Missing",
      verdict: "We cannot determine travel eligibility at this time.",
      riskSummary: "The airline's pet breed policy is not in our database.",
      whyThisHappens: "Breed-specific regulations vary widely and are updated frequently by carriers.",
      whatHappensNext: [
        "Check the airline's official 'Travel with Pets' page",
        "Contact the airline's cargo or customer service department",
        "Consult a professional pet shipper for international routes"
      ]
    };
  }

  switch (scenario) {
    case "pet.banned":
      return {
        headline: "Boarding is Likely to be Denied",
        verdict: "This pet/breed combination is prohibited for the selected method.",
        riskSummary: "The airline enforces a hard ban on this specific breed or trait.",
        whyThisHappens: reasonCode === "BRACHYCEPHALIC_POLICY" 
          ? "Short-nosed (brachycephalic) breeds are often banned from cargo due to respiratory risks."
          : "Certain breeds are restricted due to safety regulations or aircraft equipment limitations.",
        whatHappensNext: [
          "Evaluate alternative airlines with different breed policies",
          "Check if the pet can travel in-cabin instead of cargo (if applicable)",
          "Consider ground transportation or professional pet courier services"
        ]
      };

    case "pet.restricted":
      return {
        headline: "Travel Subject to Additional Restrictions",
        verdict: "Eligibility is restricted or requires manual approval.",
        riskSummary: "This breed is handled on a discretionary or conditional basis.",
        whyThisHappens: reasonCode === "AGENT_DISCRETION_POLICY"
          ? "Final boarding approval is often left to the discretion of airport check-in agents."
          : "Specific seasonal or weight restrictions may apply to this breed.",
        whatHappensNext: [
          "Arrive at the airport earlier than usual for manual check-in",
          "Ensure all medical and breed documentation is ready for inspection",
          "Confirm seasonal temperature restrictions if traveling as cargo"
        ]
      };

    case "pet.allowed":
    default:
      return {
        headline: "No Breed-Specific Bans Detected",
        verdict: "This pet is currently eligible to travel under this policy.",
        riskSummary: "No explicit bans or major restrictions were found for this breed.",
        whyThisHappens: "The selected breed is not listed on the airline's current restricted or prohibited breed register.",
        whatHappensNext: [
          "Proceed with booking your pet's travel",
          "Verify crate requirements (IATA LAR standards)",
          "Maintain all required health and vaccination records"
        ]
      };
  }
}
