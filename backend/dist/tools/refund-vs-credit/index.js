import { Router } from 'express';
import { quizQuestions } from './quiz.questions.js';
import { fetchFarePolicy } from './policy.fetch.js';
import { mapScenario } from './scenario.mapper.js';
import { calculateOutput } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { getIntel } from './intel.js';
const router = Router();
// GET: Questions for the form
router.get('/questions', (req, res) => {
    res.json(quizQuestions);
});
// POST: Main calculation endpoint
router.post('/', (req, res) => {
    const input = req.body;
    const nowUTC = new Date();
    // 1. Basic Validation
    if (!input.bookingDateTimeLocal || !input.cancellationDateTimeLocal || !input.departureDateTimeLocal || !input.ticketPrice) {
        return res.status(400).json({ error: "Missing required booking details" });
    }
    const bookingDate = new Date(input.bookingDateTimeLocal);
    const cancellationDate = new Date(input.cancellationDateTimeLocal);
    const departureDate = new Date(input.departureDateTimeLocal);
    if (bookingDate > departureDate) {
        return res.status(400).json({ error: "Booking date cannot be after departure date" });
    }
    if (cancellationDate > nowUTC) {
        return res.status(400).json({ error: "Cancellation date cannot be in the future" });
    }
    if (cancellationDate > departureDate) {
        return res.status(400).json({ error: "Cancellation date cannot be after departure date" });
    }
    if (input.ticketPrice <= 0) {
        return res.status(400).json({ error: "Ticket price must be greater than 0" });
    }
    // 2. Policy Retrieval
    const policy = fetchFarePolicy(input.airline, input.fareClassId);
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
export { router as refundVsCreditRouter };
