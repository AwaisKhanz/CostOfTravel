import { getJurisdictionForAirport } from './geography.js';
export function mapScenario(input, nowUTC) {
    const bookingUTC = new Date(input.bookingDateTimeLocal);
    const departureUTC = new Date(input.departureDateTimeLocal);
    const jurisdiction = getJurisdictionForAirport(input.originAirportIATA);
    if (isNaN(bookingUTC.getTime()) || isNaN(departureUTC.getTime()) || bookingUTC >= departureUTC) {
        return { scenario: "cancellation.invalid_input", jurisdiction };
    }
    const MS_IN_HOUR = 1000 * 60 * 60;
    const MS_IN_DAY = 1000 * 60 * 60 * 24;
    const bookingAgeMs = nowUTC.getTime() - bookingUTC.getTime();
    const departureDeltaMs = departureUTC.getTime() - nowUTC.getTime();
    const bookingAgeHours = bookingAgeMs / MS_IN_HOUR;
    const departureDeltaDays = departureDeltaMs / MS_IN_DAY;
    let scenario;
    if (jurisdiction !== "US") {
        scenario = "cancellation.non_us_departure";
    }
    else if (bookingAgeHours <= 24 && departureDeltaDays > 7) {
        scenario = "cancellation.free_24h";
    }
    else if (bookingAgeHours <= 24 && departureDeltaDays <= 7) {
        scenario = "cancellation.short_notice";
    }
    else if (bookingAgeHours > 24) {
        scenario = "cancellation.outside_24h";
    }
    else {
        scenario = "cancellation.invalid_input";
    }
    return { scenario, jurisdiction };
}
