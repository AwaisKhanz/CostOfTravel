import type { PartialProtectionInput, PartialProtectionOutput, BaggagePolicy, Scenario } from './types.js';

export function calculateProtection(
  input: PartialProtectionInput,
  policy: BaggagePolicy | null,
  scenario: Scenario
): Omit<PartialProtectionOutput, 'reasonCode' | 'outcomeRisk' | 'schemaVersion' | 'scenario'> {
  const costs = input.tripCosts;
  const categories: (keyof typeof costs)[] = ['airfare', 'hotel', 'cruise', 'excursions', 'baggageFees', 'petFees'];
  
  let totalTripCost = 0;
  let protectedAmount = 0;
  const breakdown: PartialProtectionOutput['protectionBreakdown'] = {
    airfare: 'not_covered',
    hotel: 'not_covered'
  };

  // 1. Calculate Total Cost
  categories.forEach(cat => {
    const val = costs[cat] || 0;
    totalTripCost += val;
  });

  // 2. Process coverage categorially
  if (scenario === "protection.none" || scenario === "protection.policy_missing" || scenario === "protection.limited") {
    // If not covered by reason or no policy, protected is zero
    categories.forEach(cat => {
      const val = costs[cat];
      if (val !== undefined) {
        breakdown[cat] = 'not_covered';
      }
    });
  } else {
    // Check individual categories if scenario is broad or partial-purchase
    categories.forEach(cat => {
      const val = costs[cat] || 0;
      if (val === 0) return;

      const isCategoryCovered = policy?.coverage.coveredCategories[cat] || false;
      const limit = policy?.coverage.coverageLimits[cat as keyof typeof policy.coverage.coverageLimits];

      if (isCategoryCovered) {
        if (limit !== undefined) {
          const covered = Math.min(val, limit);
          protectedAmount += covered;
          breakdown[cat] = covered < val ? 'partial' : 'covered';
        } else {
          protectedAmount += val;
          breakdown[cat] = 'covered';
        }
      } else {
        breakdown[cat] = 'not_covered';
      }
    });
  }

  return {
    totalTripCost: Number(totalTripCost.toFixed(2)),
    protectedAmount: Number(protectedAmount.toFixed(2)),
    unprotectedAmount: Number((totalTripCost - protectedAmount).toFixed(2)),
    protectionBreakdown: breakdown
  };
}

export function getOutcomeRisk(scenario: Scenario, protectedAmount: number, totalTripCost: number): PartialProtectionOutput['outcomeRisk'] {
  if (scenario === "protection.policy_missing") return "cannot_determine";
  if (scenario === "protection.none") return "high_risk";
  if (protectedAmount === totalTripCost) return "safe";
  if (protectedAmount === 0) return "high_risk";
  return "partial_loss";
}
