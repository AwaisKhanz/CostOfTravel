import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type Jurisdiction = 'US' | 'EU' | 'INTL';

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
]);

interface Airport {
  iata: string;
  countryCode: string;
  name: string;
  municipality: string;
  lat: number;
  long: number;
}

class GeographyService {
  private airports: Map<string, Airport> = new Map();
  private loaded: boolean = false;

  async init() {
    if (this.loaded) return;

    const dataDir = path.join(__dirname, '../../data');
    const airportsPath = path.join(dataDir, 'airports.csv');

    if (!fs.existsSync(airportsPath)) {
      console.warn('Geography data not found at:', airportsPath);
      return;
    }

    const content = fs.readFileSync(airportsPath, 'utf8');
    const lines = content.split('\n');
    
    // Header check
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const iataIdx = headers.indexOf('iata_code');
    const countryIdx = headers.indexOf('iso_country');
    const nameIdx = headers.indexOf('name');
    const muniIdx = headers.indexOf('municipality');
    const latIdx = headers.indexOf('latitude_deg');
    const lonIdx = headers.indexOf('longitude_deg');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parse handling quotes
      const parts = this.parseCsvLine(line);
      const iata = parts[iataIdx]?.replace(/"/g, '');
      const countryCode = parts[countryIdx]?.replace(/"/g, '');
      const name = parts[nameIdx]?.replace(/"/g, '');
      const municipality = parts[muniIdx]?.replace(/"/g, '');
      const lat = parseFloat(parts[latIdx]);
      const lon = parseFloat(parts[lonIdx]);

      if (iata && iata.length === 3) {
        this.airports.set(iata.toUpperCase(), { 
          iata: iata.toUpperCase(), 
          countryCode: countryCode?.toUpperCase() || '',
          name: name || '',
          municipality: municipality || '',
          lat: isNaN(lat) ? 0 : lat,
          long: isNaN(lon) ? 0 : lon
        });
      }
    }

    this.loaded = true;
    console.log(`GeographyService loaded ${this.airports.size} airports.`);
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  }

  getJurisdiction(iata: string): Jurisdiction {
    const airport = this.airports.get(iata.toUpperCase());
    if (!airport) return 'INTL';
    
    if (airport.countryCode === 'US') return 'US';
    if (EU_COUNTRIES.has(airport.countryCode)) return 'EU';
    
    return 'INTL';
  }

  getCountryCode(iata: string): string | null {
    return this.airports.get(iata.toUpperCase())?.countryCode || null;
  }

  getAirPort(iata: string): Airport | undefined {
    return this.airports.get(iata.toUpperCase());
  }

  calculateDistance(iata1: string, iata2: string): number {
    const a1 = this.getAirPort(iata1);
    const a2 = this.getAirPort(iata2);

    if (!a1 || !a2) return 0;

    return this.haversine(a1.lat, a1.long, a2.lat, a2.long);
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }
}

export const geographyService = new GeographyService();
