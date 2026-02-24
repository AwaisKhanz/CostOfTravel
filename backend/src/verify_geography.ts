import { geographyService } from './utils/geography.js';

async function verify() {
  console.log("Starting Geography Verification...");
  await geographyService.init();

  const tests = [
    { iata: 'JFK', expected: 'US' },
    { iata: 'LAX', expected: 'US' },
    { iata: 'CDG', expected: 'EU' },
    { iata: 'AMS', expected: 'EU' },
    { iata: 'LHR', expected: 'INTL' }, // UK is INTL
    { iata: 'DXB', expected: 'INTL' },
    { iata: 'SIN', expected: 'INTL' },
  ];

  for (const test of tests) {
    const result = geographyService.getJurisdiction(test.iata);
    const country = geographyService.getCountryCode(test.iata);
    console.log(`IATA: ${test.iata} -> Country: ${country}, Jurisdiction: ${result} (Expected: ${test.expected})`);
    if (result !== test.expected) {
      console.error(`❌ Mismatch for ${test.iata}!`);
    } else {
      console.log(`✅ Success for ${test.iata}`);
    }
  }

  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
