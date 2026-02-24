export function getIntel(scenario) {
    if (scenario === "cancellation.outside_24h") {
        return {
            scenario: "cancellation.outside_24h",
            summary: "Once the 24-hour window closes, most basic fares become non-refundable.",
            citation: {
                source: "14 CFR §259.5(b)(4)",
                verified: "2026-02-01"
            }
        };
    }
    if (scenario === "cancellation.free_24h") {
        return {
            scenario: "cancellation.free_24h",
            summary: "Airlines must offer a full refund to the original form of payment if requested within 24 hours of booking, provided the reservation was made 7 days or more prior to the flight's scheduled departure.",
            citation: {
                source: "14 CFR §259.5(b)(4)",
                verified: "2026-02-01"
            }
        };
    }
    return null;
}
