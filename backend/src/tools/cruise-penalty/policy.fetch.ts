// Normalize and fetch the penalty schedule for a given cruise line
// In a real database, this would be an async DB search. For Tool #2, we mock the normalized schema.

export interface PenaltyRule {
  min_days: number;
  penalty_percent: number;
}

export interface CruisePolicy {
  schedule: PenaltyRule[];
  fare_floor_percent: {
    standard: number;
    non_refundable: number;
    promo: number;
  };
  refund_method_by_percent: Record<number, "cash" | "fcc" | "none">;
}

const mockPolicies: Record<string, CruisePolicy> = {
  royal_caribbean: {
    schedule: [
      { min_days: 90, penalty_percent: 0 },
      { min_days: 75, penalty_percent: 25 },
      { min_days: 61, penalty_percent: 50 },
      { min_days: 31, penalty_percent: 75 },
      { min_days: 0, penalty_percent: 100 }
    ],
    fare_floor_percent: {
      standard: 0,
      non_refundable: 10,
      promo: 20
    },
    refund_method_by_percent: {
      0: "cash",
      25: "cash",
      50: "cash",
      75: "cash",
      100: "none"
    }
  },
  // Default fallback for other lines in v1
  default: {
    schedule: [
       { min_days: 90, penalty_percent: 0 },
       { min_days: 60, penalty_percent: 25 },
       { min_days: 30, penalty_percent: 50 },
       { min_days: 0, penalty_percent: 100 }
    ],
    fare_floor_percent: {
      standard: 0,
      non_refundable: 20,
      promo: 100
    },
    refund_method_by_percent: {
      0: "cash",
      25: "cash",
      50: "cash",
      100: "none"
    }
  }
};

export function fetchPolicy(cruiseLine: string): CruisePolicy | null {
  const policy = mockPolicies[cruiseLine] || mockPolicies.default;
  if (!policy) return null;

  // REQUIRED RULE: Penalty schedule MUST be sorted DESCENDING by min_days before matching
  policy.schedule.sort((a, b) => b.min_days - a.min_days);
  
  return policy;
}
