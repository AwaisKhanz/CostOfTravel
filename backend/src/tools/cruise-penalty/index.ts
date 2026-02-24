import { Router } from 'express';
import type { Request, Response } from 'express';
import type { CruisePenaltyInput } from './types.js';
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
    const input: CruisePenaltyInput = req.body;
    
    if (!input.cruiseLine || !input.sailDateLocal || !input.cancellationDateLocal || !input.totalTripCost || !input.fareType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (input.totalTripCost <= 0) {
       res.status(400).json({ error: 'Total trip cost must be greater than 0' });
       return;
    }

    const nowUTC = new Date(); // Strict server-side time control

    // 1. INPUT -> 2. POLICY FETCH & SCENARIO
    const mapper = mapScenario(input, nowUTC);

    // 3. CALCULATOR & NEXT CLIFF
    const output = calculateOutput(input, mapper);

    // 4. STORYLINE
    const storyline = buildStoryline(output);

    // 5. INTEL
    const intel = getIntel(output.scenario);

    res.json({
      output,
      storyline,
      intel,
       // Include tracking data per spec
      tracking: {
        toolId: "cruise_penalty",
        scenario: output.scenario,
        outcomeRisk: output.outcomeRisk,
        cruiseLine: input.cruiseLine
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
