import { Router } from 'express';
import type { Request, Response } from 'express';
import type { PetBreedInput } from './types.js';
import { quizQuestions } from './quiz.questions.js';
import { lookupBreed } from './breed.lookup.js';
import { fetchPolicy } from './policy.fetch.js';
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
  const input: PetBreedInput = req.body;

  // 1. Breed Lookup
  const breedMeta = lookupBreed(input.breedId);
  
  // 2. Policy Fetch
  const policy = fetchPolicy(input.airline);

  // 3. Scenario Mapping
  const scenario = mapScenario(input, policy, breedMeta);

  // 4. Output Generation
  const output = calculateOutput(input, scenario, policy, breedMeta);

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

export { router as petBreedBanRouter };
