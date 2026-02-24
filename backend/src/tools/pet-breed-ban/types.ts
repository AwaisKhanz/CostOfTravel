export interface PetBreedInput {
  airline: string;
  petType: "dog" | "cat";
  breedId: string; // normalized internal ID
  travelMethod: "cabin" | "cargo";
  routeType: "domestic" | "international";
}

export type Scenario =
  | "pet.allowed"
  | "pet.restricted"
  | "pet.banned"
  | "pet.policy_missing";

export interface PetBreedOutput {
  schemaVersion: "v1";
  scenario: Scenario;
  allowedToTravel: boolean;
  denialRisk: "low" | "moderate" | "high";
  restrictionType:
    | "none"
    | "breed_ban"
    | "cargo_restriction"
    | "cabin_restriction"
    | "brachycephalic_ban"
    | "agent_discretion"
    | "policy_missing";
  reasonCode:
    | "EXPLICIT_BREED_BAN"
    | "CARGO_NOT_ALLOWED"
    | "CABIN_NOT_ALLOWED"
    | "RESTRICTED_BREED"
    | "BRACHYCEPHALIC_POLICY"
    | "AGENT_DISCRETION_POLICY"
    | "POLICY_NOT_FOUND"
    | "NONE";
  outcomeRisk:
    | "safe"
    | "high_risk"
    | "denied"
    | "cannot_determine";
}

export interface BreedMeta {
  id: string;
  name: string;
  petType: "dog" | "cat";
  isBrachycephalic: boolean;
  isMixedBreed: boolean;
}

export interface PetPolicy {
  airline: string;
  bannedBreedsCargo: string[];
  bannedBreedsCabin: string[];
  restrictedBreedsCargo: string[];
  restrictedBreedsCabin: string[];
  brachycephalicCargoBan: boolean;
  cabinAllowed: boolean;
  cargoAllowed: boolean;
  agentDiscretion: boolean;
}

export interface Storyline {
  headline: string;
  verdict: string;
  riskSummary: string;
  whyThisHappens: string;
  whatHappensNext: string[];
}
