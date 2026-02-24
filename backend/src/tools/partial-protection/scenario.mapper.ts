import type { PartialProtectionInput, Scenario, BaggagePolicy } from './types.js';

export function mapScenario(input: PartialProtectionInput, policy: BaggagePolicy | null): Scenario {
  if (input.protectionType === "none") return "protection.none";
  if (!policy) return "protection.policy_missing";

  if (!policy.coverage.coveredReasons.includes(input.cancellationReason)) {
    return "protection.limited";
  }

  if (policy.coverage.requiresEarlyPurchase && input.insurancePurchaseDateLocal && input.bookingDateLocal) {
    const purchaseDate = new Date(input.insurancePurchaseDateLocal);
    const bookingDate = new Date(input.bookingDateLocal);
    const diffDays = (purchaseDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24);
    
    if (diffDays > (policy.coverage.earlyPurchaseWindowDays || 14)) {
      return "protection.partial";
    }
  }

  return "protection.broad";
}

export function getReasonCode(scenario: Scenario): string {
  switch (scenario) {
    case "protection.none": return "NO_PROTECTION";
    case "protection.policy_missing": return "POLICY_NOT_FOUND";
    case "protection.limited": return "REASON_NOT_COVERED";
    case "protection.partial": return "LATE_PURCHASE_LIMITATION";
    case "protection.broad": return "BROAD_COVERAGE";
    default: return "PARTIAL_CATEGORY_EXCLUSION";
  }
}
