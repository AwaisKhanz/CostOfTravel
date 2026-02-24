const mockPolicies = {
    delta: {
        maxWeeksSingle: 36,
        maxWeeksMultiple: 32,
        documentationRequiredAfterWeeks: 28,
        absoluteCutoffWeeks: 40,
        documentationOverrides: false
    },
    united: {
        maxWeeksSingle: 36,
        maxWeeksMultiple: 32,
        documentationRequiredAfterWeeks: 28,
        absoluteCutoffWeeks: 38,
        documentationOverrides: false
    },
    southwest: {
        maxWeeksSingle: 38,
        maxWeeksMultiple: 38,
        documentationRequiredAfterWeeks: 38,
        absoluteCutoffWeeks: 40,
        documentationOverrides: false
    },
    ryanair: {
        maxWeeksSingle: 36,
        maxWeeksMultiple: 32,
        documentationRequiredAfterWeeks: 28,
        absoluteCutoffWeeks: 36,
        documentationOverrides: false
    },
    royal_caribbean: {
        maxWeeksSingle: 23,
        maxWeeksMultiple: 23,
        documentationRequiredAfterWeeks: 23,
        absoluteCutoffWeeks: 24,
        documentationOverrides: false
    },
    carnival: {
        maxWeeksSingle: 23,
        maxWeeksMultiple: 23,
        documentationRequiredAfterWeeks: 23,
        absoluteCutoffWeeks: 24,
        documentationOverrides: false
    }
};
export function fetchPolicy(carrier) {
    return mockPolicies[carrier.toLowerCase()] || null;
}
