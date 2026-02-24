import { Router } from 'express';
import { quizQuestions } from './quiz.questions.js';
import { fetchPolicy } from './policy.fetch.js';
import { mapScenario } from './scenario.mapper.js';
import { calculateOutput } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { getIntel } from './intel.js';
const router = Router();
router.get('/questions', (req, res) => {
    res.json(quizQuestions);
});
router.post('/', (req, res) => {
    const input = req.body;
    const nowUTC = new Date();
    // Basic validation
    if (!input.carrier || !input.departureDateLocal || input.weeksPregnantAtDeparture === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // Server-side date enforcement
    const departureDate = new Date(input.departureDateLocal);
    if (departureDate < nowUTC) {
        return res.status(400).json({ error: "Departure date must be in the future" });
    }
    const policy = fetchPolicy(input.carrier);
    const mapper = mapScenario(input, policy);
    const output = calculateOutput(input, mapper);
    const storyline = buildStoryline(output);
    const intel = getIntel(output.scenario);
    res.json({
        output,
        storyline,
        intel,
        tracking: {
            toolId: "pregnancy_cutoff",
            scenario: output.scenario,
            outcomeRisk: output.outcomeRisk,
            carrier: input.carrier
        }
    });
});
export default router;
