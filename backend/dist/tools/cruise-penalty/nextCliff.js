export function getNextCliff(policy, currentMatchedMinDays, daysBeforeSail) {
    if (currentMatchedMinDays === null)
        return null;
    // Find next schedule row where rule.min_days < currentMatchedMinDays
    let nextRule = null;
    for (const rule of policy.schedule) {
        if (rule.min_days < currentMatchedMinDays) {
            nextRule = rule;
            break;
        }
    }
    if (!nextRule)
        return null;
    const daysUntilNextCliff = Math.floor(daysBeforeSail - nextRule.min_days);
    // Only return if positive and makes sense
    if (daysUntilNextCliff > 0) {
        return {
            nextPenaltyCliffDays: nextRule.min_days,
            nextPenaltyCliffPercent: nextRule.penalty_percent,
            daysUntilNextCliff
        };
    }
    return null;
}
