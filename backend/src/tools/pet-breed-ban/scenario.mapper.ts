import type { PetBreedInput, PetPolicy, BreedMeta, Scenario } from './types.js';

export function mapScenario(
  input: PetBreedInput, 
  policy: PetPolicy | null, 
  breedMeta: BreedMeta | null
): Scenario {
  if (!policy || !breedMeta) {
    return "pet.policy_missing";
  }

  const { travelMethod, breedId } = input;

  if (travelMethod === "cargo" && !policy.cargoAllowed) {
    return "pet.banned";
  }

  if (travelMethod === "cabin" && !policy.cabinAllowed) {
    return "pet.banned";
  }

  if (travelMethod === "cargo" && policy.bannedBreedsCargo.includes(breedId)) {
    return "pet.banned";
  }

  if (travelMethod === "cabin" && policy.bannedBreedsCabin.includes(breedId)) {
    return "pet.banned";
  }

  if (travelMethod === "cargo" && breedMeta.isBrachycephalic && policy.brachycephalicCargoBan) {
    return "pet.banned";
  }

  if (travelMethod === "cargo" && policy.restrictedBreedsCargo.includes(breedId)) {
    return "pet.restricted";
  }

  if (travelMethod === "cabin" && policy.restrictedBreedsCabin.includes(breedId)) {
    return "pet.restricted";
  }

  if (policy.agentDiscretion) {
    return "pet.restricted";
  }

  return "pet.allowed";
}
