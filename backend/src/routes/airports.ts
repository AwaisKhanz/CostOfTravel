import { Router } from 'express';
import type { Request, Response } from 'express';
import { geographyService } from '../utils/geography.js';

const router = Router();

router.get('/search', (req: Request, res: Response): void => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  
  if (!query || query.length < 2) {
    res.json([]);
    return;
  }

  // Access the private airports map from geography service workaround via cast or getter
  // For simplicity, we'll iterate through all IATAs we know
  // In a real optimized system, we'd add a dedicated search method to GeographyService
  // Since we know the GeographyService only stores by IATA uppercase:
  
  const allAirports = (geographyService as any).airports as Map<string, any>;
  const results = [];

  for (const [iata, airport] of allAirports.entries()) {
    if (iata.toLowerCase().includes(query) || airport.countryCode.toLowerCase().includes(query)) {
      results.push({
        iata: airport.iata,
        countryCode: airport.countryCode,
        label: `${airport.countryCode === 'US' ? '🇺🇸' : '✈️'} ${airport.municipality} (${airport.iata}) - ${airport.name}`
      });
      if (results.length > 20) break;
    }
  }

  res.json(results);
});

export default router;
