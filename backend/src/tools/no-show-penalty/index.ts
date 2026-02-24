import { Router } from 'express';
import type { Request, Response } from 'express';
import type { NoShowInput } from './types.js';
import { quizQuestions } from './quiz.questions.js';
import { fetchNoShowPolicy } from './policy.fetch.js';
import { mapScenario } from './scenario.mapper.js';
import { calculateOutput } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { getIntel } from './intel.js';

const router = Router();

// GET: Questions for the form
router.get('/questions', (req: Request, res: Response) => {
  res.json(quizQuestions);
});

// POST: Main calculation endpoint
router.post('/', (req: Request, res: Response) => {
  const input: NoShowInput = req.body;
  const nowUTC = new Date();

  // 1. Basic Validation
  if (!input.departureDateTimeLocal || !input.ticketPrice || !input.passengerCount) {
    return res.status(400).json({ error: "Missing required details" });
  }

  if (input.ticketPrice <= 0) {
    return res.status(400).json({ error: "Ticket price must be greater than 0" });
  }

  if (input.passengerCount < 1) {
    return res.status(400).json({ error: "Passenger count must be at least 1" });
  }

  const departureDate = new Date(input.departureDateTimeLocal);

  // You cannot be a no-show for a flight in the future
  if (input.missedFlight && departureDate > nowUTC) {
    return res.status(400).json({ error: "Cannot calculate no-show penalty for a flight that has not yet departed." });
  }

  // 2. Policy Retrieval
  const policy = fetchNoShowPolicy(input.airline, input.fareClassId);

  // 3. Scenario Mapping
  const scenario = mapScenario(input, policy, nowUTC);

  // 4. Output Generation
  const output = calculateOutput(input, scenario, policy);

  // 5. Narrative Building
  const storyline = buildStoryline(output);

  // 6. Citations/Intel
  const intel = getIntel(scenario);

  res.json({
    output,
    storyline,
    intel
  });
});

export { router as noShowPenaltyRouter };
