export type Jurisdiction = "US" | "EU" | "INTL";

const usMajorIATAs = [
  "JFK", "LAX", "ORD", "DFW", "DEN", "SFO", "ATL", "SEA", "MIA", "EWR", 
  "CLT", "PHX", "IAH", "LAS", "MCO", "MSP", "DTW", "BOS", "PHL", "LGA"
];

export function getJurisdiction(iata: string): Jurisdiction {
  const normalizedIATA = iata.toUpperCase().trim();
  
  if (usMajorIATAs.includes(normalizedIATA)) {
    return "US";
  }

  // Fallback to INTL if not explicitly mapped
  return "INTL";
}
