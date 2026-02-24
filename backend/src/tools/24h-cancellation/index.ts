import { Router } from 'express';
import type { Request, Response } from 'express';
import type { TwentyFourHourInput } from './types.js';
import { mapScenario } from './scenario.mapper.js';
import { calculateOutput } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { getIntel } from './intel.js';

import { quizQuestions } from './quiz.questions.js';

const router = Router();

router.get('/questions', (req: Request, res: Response): void => {
  res.json(quizQuestions);
});

router.post('/', (req: Request, res: Response): void => {
  try {
    const input: TwentyFourHourInput = req.body;
    
    if (!input.bookingDateTimeLocal || !input.departureDateTimeLocal || !input.originAirportIATA || !input.bookingChannel) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // 1. INPUT -> 2. GEOGRAPHY -> 3. SCENARIO
    const nowUTC = new Date(); // Server-side strict time
    const { scenario, jurisdiction } = mapScenario(input, nowUTC);

    // 4. CALCULATOR
    const output = calculateOutput(scenario, jurisdiction);

    // 5. STORYLINE
    const storyline = buildStoryline(output);

    // 6. INTEL
    const intel = getIntel(scenario);

    res.json({
      output,
      storyline,
      intel,
       // Include tracking data per spec
      tracking: {
        toolId: "24h_cancellation",
        scenario: output.scenario,
        outcomeRisk: output.outcomeRisk,
        jurisdiction: output.jurisdiction
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
