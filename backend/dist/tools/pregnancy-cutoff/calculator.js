export function calculateOutput(input, mapper) {
    const { scenario } = mapper;
    const baseOutput = {
        schemaVersion: "v1",
        scenario,
        allowedToTravel: false,
        documentationRequired: false,
        denialRisk: "moderate",
        reasonCode: "POLICY_NOT_FOUND",
        outcomeRisk: "cannot_determine"
    };
    switch (scenario) {
        case "pregnancy.denied":
            return {
                ...baseOutput,
                allowedToTravel: false,
                denialRisk: "high",
                reasonCode: "ABSOLUTE_CUTOFF",
                outcomeRisk: "denied"
            };
        case "pregnancy.high_risk":
            return {
                ...baseOutput,
                allowedToTravel: false,
                denialRisk: "high",
                reasonCode: "EXCEEDS_POLICY_LIMIT",
                outcomeRisk: "denied"
            };
        case "pregnancy.documentation_required":
            return {
                ...baseOutput,
                allowedToTravel: true,
                documentationRequired: true,
                denialRisk: "moderate",
                reasonCode: "DOCUMENTATION_REQUIRED",
                outcomeRisk: "high_risk"
            };
        case "pregnancy.allowed":
            return {
                ...baseOutput,
                allowedToTravel: true,
                denialRisk: "low",
                reasonCode: "WITHIN_POLICY_LIMIT",
                outcomeRisk: "safe"
            };
        case "pregnancy.policy_missing":
        default:
            return baseOutput;
    }
}
