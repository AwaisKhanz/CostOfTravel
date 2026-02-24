async function run() {
  const url = 'http://localhost:8000/api/tools/refund-vs-credit';

  const scenarios = [
    {
      name: "1. Airline Initiated",
      payload: {
        airline: "delta",
        isAirlineInitiated: true,
        fareClassId: "basic_economy",
        bookingDateTimeLocal: "2026-02-22T00:00",
        cancellationDateTimeLocal: "2026-02-24T00:00",
        departureDateTimeLocal: "2026-03-06T00:00",
        ticketPrice: 500,
        originAirportIATA: "JFK"
      }
    },
    {
      name: "2. US Regulatory 24h",
      payload: {
        airline: "delta",
        isAirlineInitiated: false,
        fareClassId: "standard_economy",
        bookingDateTimeLocal: new Date(Date.now() - 2 * 3600 * 1000).toISOString().slice(0, 16),
        cancellationDateTimeLocal: new Date().toISOString().slice(0, 16),
        departureDateTimeLocal: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().slice(0, 16),
        ticketPrice: 400,
        originAirportIATA: "JFK"
      }
    },
    {
      name: "3. Refundable Fare",
      payload: {
        airline: "delta",
        isAirlineInitiated: false,
        fareClassId: "refundable",
        bookingDateTimeLocal: "2026-02-20T00:00",
        cancellationDateTimeLocal: "2026-02-24T00:00",
        departureDateTimeLocal: "2026-03-10T00:00",
        ticketPrice: 1200,
        originAirportIATA: "JFK"
      }
    },
    {
      name: "4. Standard Economy Credit",
      payload: {
        airline: "delta",
        isAirlineInitiated: false,
        fareClassId: "standard_economy",
        bookingDateTimeLocal: "2026-02-10T00:00",
        cancellationDateTimeLocal: "2026-02-24T00:00",
        departureDateTimeLocal: "2026-03-15T00:00",
        ticketPrice: 450,
        originAirportIATA: "LHR"
      }
    }
  ];

  for (const s of scenarios) {
    console.log(`\n### ${s.name} ###`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s.payload)
      });
      const data = await res.json();
      if (data.error) {
        console.error("Error:", data.error);
        continue;
      }
      const o = data.output;
      console.log(`Scenario: ${o.scenario}`);
      console.log(`Refund: $${o.refundAmount}, Credit: $${o.creditAmount}, Penalty: $${o.penaltyAmount}`);
      const sum = o.refundAmount + o.creditAmount + o.penaltyAmount;
      const valid = sum === s.payload.ticketPrice;
      console.log(`Math Valid (${sum} === ${s.payload.ticketPrice}): ${valid ? '✅' : '❌'}`);
    } catch (e) {
      console.error(e);
    }
  }
}
run();
