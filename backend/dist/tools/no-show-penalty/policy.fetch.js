const noShowPolicies = {
    delta: {
        basic_economy: {
            forfeitsTicketValue: true,
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: true
        },
        standard_economy: {
            forfeitsTicketValue: true, // Most legacies forfeit non-refundable economy on no-show
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: true
        },
        refundable: {
            forfeitsTicketValue: false,
            creditAllowedAfterNoShow: true, // Allowed, often full refund
            refundableFareOverride: true,
            autoCancelRemainingSegments: true
        },
        award: {
            forfeitsTicketValue: false,
            creditAllowedAfterNoShow: false,
            refundableFareOverride: true,
            autoCancelRemainingSegments: true,
            awardRedepositFee: 150
        }
    },
    southwest: {
        basic_economy: {
            forfeitsTicketValue: true,
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: true
        },
        standard_economy: {
            forfeitsTicketValue: true, // Wanna Get Away forfeits if not cancelled 10 mins prior
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: true
        },
        refundable: {
            forfeitsTicketValue: false,
            creditAllowedAfterNoShow: true, // Anytime/Business Select convert to credit after no-show
            refundableFareOverride: true,
            autoCancelRemainingSegments: true
        }
    },
    ryanair: {
        basic_economy: {
            forfeitsTicketValue: true,
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: false // Ryanair operates point-to-point, less aggressive segment auto-cancel
        },
        standard_economy: {
            forfeitsTicketValue: true,
            creditAllowedAfterNoShow: false,
            refundableFareOverride: false,
            autoCancelRemainingSegments: false
        }
    }
};
export function fetchNoShowPolicy(airline, fareClassId) {
    const airlineKey = airline.toLowerCase();
    if (!noShowPolicies[airlineKey])
        return null;
    return noShowPolicies[airlineKey][fareClassId] || null;
}
