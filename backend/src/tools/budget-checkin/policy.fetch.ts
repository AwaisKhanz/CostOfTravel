// Normalize and fetch the check-in deadline and fee for a given airline
// In a real database, this would be an async DB search. For Tool #3, we mock the normalized schema.

export interface AirlineCheckinPolicy {
  online_deadline_hours: {
    domestic: number;
    international: number;
  };
  airport_fee: {
    amount: number;
    currency: string;
  };
}

const mockPolicies: Record<string, AirlineCheckinPolicy> = {
  ryanair: {
    online_deadline_hours: {
      domestic: 2,
      international: 2
    },
    airport_fee: {
      amount: 55,
      currency: "EUR"
    }
  },
  wizz: {
    online_deadline_hours: {
      domestic: 3,
      international: 3
    },
    airport_fee: {
      amount: 40,
      currency: "EUR"
    }
  },
  spirit: {
    online_deadline_hours: {
      domestic: 1,
      international: 1
    },
    airport_fee: {
      amount: 25,
      currency: "USD"
    }
  },
  // Default fallback for legacy/other lines in v1
  default: {
    online_deadline_hours: {
      domestic: 2,
      international: 4
    },
    airport_fee: {
      amount: 50,
      currency: "USD"
    }
  }
};

export function fetchPolicy(airline: string): AirlineCheckinPolicy | null {
  const policy = mockPolicies[airline] || mockPolicies.default;
  return policy || null;
}
