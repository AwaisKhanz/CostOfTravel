export function getIntel(scenario) {
    if (scenario === "cancellation.high_penalty_window" || scenario === "cancellation.full_penalty_window") {
        return {
            summary: "Cruise penalties increase sharply after final payment deadlines.",
            citation: {
                source: "Cruise Passenger Contract",
                verified: "2026-02-01"
            }
        };
    }
    if (scenario === "cancellation.partial_penalty_window") {
        return {
            summary: "Non-refundable deposits are never refunded in cash, even if you cancel very early.",
            citation: {
                source: "Carrier Ticket Contract Defaults",
                verified: "2026-02-01"
            }
        };
    }
    return null;
}
