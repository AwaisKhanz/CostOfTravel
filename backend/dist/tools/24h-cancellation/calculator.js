export function calculateOutput(scenario, jurisdiction) {
    if (scenario === "cancellation.free_24h") {
        return {
            schemaVersion: "v1",
            scenario: "cancellation.free_24h",
            jurisdiction: "US",
            eligible: true,
            refundType: "cash",
            refundAmount: "full",
            reasonCode: "US_DOT_24H_RULE",
            outcomeRisk: "safe"
        };
    }
    if (scenario === "cancellation.short_notice") {
        return {
            schemaVersion: "v1",
            scenario: "cancellation.short_notice",
            jurisdiction: "US",
            eligible: false,
            refundType: "none",
            refundAmount: "none",
            reasonCode: "DEPARTURE_WITHIN_7_DAYS",
            outcomeRisk: "not_applicable"
        };
    }
    if (scenario === "cancellation.outside_24h") {
        return {
            schemaVersion: "v1",
            scenario: "cancellation.outside_24h",
            jurisdiction: "US",
            eligible: false,
            refundType: "none",
            refundAmount: "none",
            reasonCode: "BOOKING_OLDER_THAN_24H",
            outcomeRisk: "not_applicable"
        };
    }
    if (scenario === "cancellation.non_us_departure") {
        return {
            schemaVersion: "v1",
            scenario: "cancellation.non_us_departure",
            jurisdiction: jurisdiction,
            eligible: false,
            refundType: "none",
            refundAmount: "none",
            reasonCode: "NON_US_DEPARTURE",
            outcomeRisk: "cannot_determine"
        };
    }
    // fallback for invalid
    return {
        schemaVersion: "v1",
        scenario: "cancellation.invalid_input",
        jurisdiction: jurisdiction,
        eligible: false,
        refundType: "none",
        refundAmount: "none",
        reasonCode: "INVALID_INPUT",
        outcomeRisk: "cannot_determine"
    };
}
