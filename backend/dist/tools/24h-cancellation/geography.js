import { geographyService } from '../../utils/geography.js';
export function getJurisdictionFromCountry(countryCode) {
    if (countryCode === "US")
        return "US";
    const EU = ["FR", "DE", "IT", "ES", "NL", "IE", "BE", "PT", "AT", "FI", "SE", "DK", "PL", "CZ", "HU", "RO", "BG", "HR", "GR", "LU", "MT", "CY", "SK", "SI", "EE", "LV", "LT"];
    if (EU.includes(countryCode))
        return "EU";
    return "INTL";
}
export function getJurisdictionForAirport(iata) {
    const countryCode = geographyService.getCountryCode(iata);
    if (!countryCode)
        return "INTL";
    return getJurisdictionFromCountry(countryCode);
}
