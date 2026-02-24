const farePolicies = {
    delta: {
        basic_economy: {
            refundable: false,
            creditAllowed: false,
            refundMethod: "none"
        },
        standard_economy: {
            refundable: false,
            cancellationFeeAmount: 0, // Delta eliminated standard fees for most fares
            creditAllowed: true,
            refundMethod: "credit"
        },
        refundable: {
            refundable: true,
            creditAllowed: true,
            refundMethod: "cash"
        },
        award: {
            refundable: false,
            awardRedepositFee: 0,
            creditAllowed: true,
            refundMethod: "credit"
        }
    },
    united: {
        basic_economy: {
            refundable: false,
            creditAllowed: false,
            refundMethod: "none"
        },
        standard_economy: {
            refundable: false,
            cancellationFeeAmount: 0,
            creditAllowed: true,
            refundMethod: "credit"
        },
        refundable: {
            refundable: true,
            creditAllowed: true,
            refundMethod: "cash"
        }
    },
    american: {
        basic_economy: {
            refundable: false,
            creditAllowed: false,
            refundMethod: "none"
        },
        standard_economy: {
            refundable: false,
            cancellationFeeAmount: 0,
            creditAllowed: true,
            refundMethod: "credit"
        }
    }
};
export function fetchFarePolicy(airline, fareClassId) {
    const airlineKey = airline.toLowerCase();
    if (!farePolicies[airlineKey])
        return null;
    return farePolicies[airlineKey][fareClassId] || null;
}
