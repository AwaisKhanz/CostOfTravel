import type { PetPolicy } from './types.js';

const airlinePolicies: Record<string, PetPolicy> = {
  delta: {
    airline: "delta",
    bannedBreedsCargo: ["pit_bull", "mastiff"],
    bannedBreedsCabin: [],
    restrictedBreedsCargo: ["french_bulldog", "pug"],
    restrictedBreedsCabin: [],
    brachycephalicCargoBan: true,
    cabinAllowed: true,
    cargoAllowed: true,
    agentDiscretion: false
  },
  united: {
    airline: "united",
    bannedBreedsCargo: ["french_bulldog", "pug", "persian_cat"],
    bannedBreedsCabin: [],
    restrictedBreedsCargo: [],
    restrictedBreedsCabin: [],
    brachycephalicCargoBan: true,
    cabinAllowed: true,
    cargoAllowed: false,
    agentDiscretion: false
  },
  american: {
    airline: "american",
    bannedBreedsCargo: ["pit_bull", "mastiff"],
    bannedBreedsCabin: [],
    restrictedBreedsCargo: ["french_bulldog", "pug", "persian_cat"],
    restrictedBreedsCabin: [],
    brachycephalicCargoBan: true,
    cabinAllowed: true,
    cargoAllowed: true,
    agentDiscretion: true
  }
};

export function fetchPolicy(airline: string): PetPolicy | null {
  return airlinePolicies[airline.toLowerCase()] || null;
}
