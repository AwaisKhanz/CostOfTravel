import { geographyService } from '../../utils/geography.js';
import type { Jurisdiction } from './types.js';

export function getJurisdictionFromCountry(countryCode: string): Jurisdiction {
  if (countryCode === "US") return "US";

  const EU = ["FR","DE","IT","ES","NL","IE","BE","PT","AT","FI","SE","DK","PL","CZ","HU","RO","BG","HR","GR","LU","MT","CY","SK","SI","EE","LV","LT"];
  
  if (EU.includes(countryCode)) return "EU";

  return "INTL";
}

export function getJurisdictionForAirport(iata: string): Jurisdiction {
  const countryCode = geographyService.getCountryCode(iata);
  if (!countryCode) return "INTL";
  return getJurisdictionFromCountry(countryCode);
}
