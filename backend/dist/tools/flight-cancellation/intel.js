export function getIntel(scenario) {
    const intelMap = {
        "cancellation.regulatory_24h": {
            summary: "US DOT Part 259.5(b)(4) mandates that carriers allow passengers to cancel a booking within 24 hours of purchase without penalty.",
            citation: {
                source: "US Electronic Code of Federal Regulations (eCFR)",
                verified: "2026-02-01"
            }
        },
        "cancellation.basic_economy_forfeit": {
            summary: "IATA conditions of carriage generally permit airlines to offer non-refundable fare products to maintain competitive pricing tiers.",
            citation: {
                source: "IATA General Conditions of Carriage",
                verified: "2026-02-01"
            }
        }
    };
    return intelMap[scenario] || null;
}
