import { Router } from 'express';
import { quizQuestions } from './quiz.questions.js';
import { fetchBaggagePolicy } from './policy.fetch.js';
import { mapScenario } from './scenario.mapper.js';
import { calculateBaggageFee } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { getIntel } from './intel.js';
const router = Router();
router.get('/questions', (req, res) => {
    res.json(quizQuestions);
});
router.post('/', (req, res) => {
    const input = req.body;
    // Basic Validation
    if (!input.airline ||
        input.numberOfPassengers < 1 ||
        input.bagsPerPassenger < 0 ||
        input.bagWeightKg < 0 ||
        input.bagLinearSizeCm < 0 ||
        !input.routeType ||
        !input.purchaseChannel) {
        return res.status(400).json({ error: "Missing or invalid baggage details. All fields are required." });
    }
    const policy = fetchBaggagePolicy(input.airline);
    const scenario = mapScenario(input, policy);
    const output = calculateBaggageFee(input, scenario, policy);
    const storyline = buildStoryline(output);
    const intel = getIntel(scenario);
    res.json({
        output,
        storyline,
        intel,
        schemaVersion: "v1"
    });
});
export const familyBaggageRouter = router;
