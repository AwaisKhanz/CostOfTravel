import type { PetBreedInput, PetBreedOutput, Scenario, BreedMeta, PetPolicy } from './types.js';

export function calculateOutput(
  input: PetBreedInput, 
  scenario: Scenario, 
  policy: PetPolicy | null, 
  breedMeta: BreedMeta | null
): PetBreedOutput {
  const baseOutput: PetBreedOutput = {
    schemaVersion: "v1",
    scenario,
    allowedToTravel: false,
    denialRisk: "moderate",
    restrictionType: "policy_missing",
    reasonCode: "POLICY_NOT_FOUND",
    outcomeRisk: "cannot_determine"
  };

  if (!policy || !breedMeta) {
    return baseOutput;
  }

  const { travelMethod, breedId } = input;

  switch (scenario) {
    case "pet.banned":
      let restrictionType: PetBreedOutput["restrictionType"] = "breed_ban";
      let reasonCode: PetBreedOutput["reasonCode"] = "EXPLICIT_BREED_BAN";

      if (travelMethod === "cargo" && !policy.cargoAllowed) {
        restrictionType = "cargo_restriction";
        reasonCode = "CARGO_NOT_ALLOWED";
      } else if (travelMethod === "cabin" && !policy.cabinAllowed) {
        restrictionType = "cabin_restriction";
        reasonCode = "CABIN_NOT_ALLOWED";
      } else if (travelMethod === "cargo" && breedMeta.isBrachycephalic && policy.brachycephalicCargoBan) {
        restrictionType = "brachycephalic_ban";
        reasonCode = "BRACHYCEPHALIC_POLICY";
      }

      return {
        ...baseOutput,
        allowedToTravel: false,
        denialRisk: "high",
        restrictionType,
        reasonCode,
        outcomeRisk: "denied"
      };

    case "pet.restricted":
      return {
        ...baseOutput,
        allowedToTravel: true,
        denialRisk: "moderate",
        restrictionType: policy.agentDiscretion ? "agent_discretion" : (travelMethod === "cargo" ? "cargo_restriction" : "cabin_restriction"),
        reasonCode: policy.agentDiscretion ? "AGENT_DISCRETION_POLICY" : "RESTRICTED_BREED",
        outcomeRisk: "high_risk"
      };

    case "pet.allowed":
      return {
        ...baseOutput,
        allowedToTravel: true,
        denialRisk: "low",
        restrictionType: "none",
        reasonCode: "NONE",
        outcomeRisk: "safe"
      };

    default:
      return baseOutput;
  }
}
