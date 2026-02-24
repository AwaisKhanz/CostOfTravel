export type Jurisdiction = "US" | "EU" | "INTL";

const usAirportPrefixes = ["K", "P", "T"]; // Basic prefix check for ICAO/IATA context in v1
// For strictness, we use a mapping of common US hubs if needed, but for v1 we'll stick to a list or simple prefixing if ICAO is used.
// However, the tool uses IATA. Let's use a explicit list of US major IATAs for the demo/v1 strictness.

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
