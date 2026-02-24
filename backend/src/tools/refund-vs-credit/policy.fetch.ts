import type { FarePolicy } from './types.js';

const farePolicies: Record<string, Record<string, FarePolicy>> = {
  delta: {
    basic_economy: {
      refundable: false,
      cashRefundAllowed: false,
      creditAllowed: false
    },
    standard_economy: {
      refundable: false,
      cashRefundAllowed: false,
      creditAllowed: true,
      cancellationFeeAmount: 0,
      creditExpirationMonths: 12
    },
    refundable: {
      refundable: true,
      cashRefundAllowed: true,
      creditAllowed: true,
      cancellationFeeAmount: 0
    },
    award: {
      refundable: false,
      cashRefundAllowed: false,
      creditAllowed: true,
      awardRedepositFee: 0
    }
  },
  united: {
    basic_economy: {
      refundable: false,
      cashRefundAllowed: false,
      creditAllowed: false
    },
    standard_economy: {
      refundable: false,
      cashRefundAllowed: false,
      creditAllowed: true,
      cancellationFeeAmount: 0,
      creditExpirationMonths: 12
    },
    refundable: {
      refundable: true,
      cashRefundAllowed: true,
      creditAllowed: true
    }
  }
};

export function fetchFarePolicy(airline: string, fareClassId: string): FarePolicy | null {
  const airlineKey = airline.toLowerCase();
  if (!farePolicies[airlineKey]) return null;
  
  return farePolicies[airlineKey][fareClassId] || null;
}
