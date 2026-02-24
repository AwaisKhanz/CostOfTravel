import type { BreedMeta } from './types.js';

const breedRegistry: Record<string, BreedMeta> = {
  french_bulldog: {
    id: "french_bulldog",
    name: "French Bulldog",
    petType: "dog",
    isBrachycephalic: true,
    isMixedBreed: false
  },
  pug: {
    id: "pug",
    name: "Pug",
    petType: "dog",
    isBrachycephalic: true,
    isMixedBreed: false
  },
  pit_bull: {
    id: "pit_bull",
    name: "Pit Bull Terrier",
    petType: "dog",
    isBrachycephalic: false,
    isMixedBreed: false
  },
  golden_retriever: {
    id: "golden_retriever",
    name: "Golden Retriever",
    petType: "dog",
    isBrachycephalic: false,
    isMixedBreed: false
  },
  mastiff: {
    id: "mastiff",
    name: "Mastiff",
    petType: "dog",
    isBrachycephalic: true,
    isMixedBreed: false
  },
  persian_cat: {
    id: "persian_cat",
    name: "Persian Cat",
    petType: "cat",
    isBrachycephalic: true,
    isMixedBreed: false
  }
};

export function lookupBreed(breedId: string): BreedMeta | null {
  return breedRegistry[breedId] || null;
}
