import { Router } from 'express';
import { questions } from './quiz.questions.js';
import { fetchPolicy } from './policy.fetch.js';
import { mapScenario, getReasonCode } from './scenario.mapper.js';
import { calculateProtection, getOutcomeRisk } from './calculator.js';
import { buildStoryline } from './storyline.js';
import { fetchIntel } from './intel.js';
import type { PartialProtectionInput, PartialProtectionOutput } from './types.js';

const router = Router();

// GET /questions
router.get('/questions', (req, res) => {
  res.json(questions);
});

// POST /
router.post('/', (req, res) => {
  try {
    const input = req.body as PartialProtectionInput;
    
    if (input.protectionType === 'insurance' && input.insurancePurchaseDateLocal && input.bookingDateLocal) {
      const bookingDate = new Date(input.bookingDateLocal);
      const insuranceDate = new Date(input.insurancePurchaseDateLocal);
      if (bookingDate > insuranceDate) {
        res.status(400).json({ error: 'Trip must be booked on or before insurance purchase date' });
        return;
      }
    }
    
    // 1. Fetch Policy
    const policy = fetchPolicy(input.protectionProviderId);
    
    // 2. Map Scenario
    const scenario = mapScenario(input, policy);
    
    // 3. Calculate
    const calc = calculateProtection(input, policy, scenario);
    
    // 4. Determine Reason & Risk
    const reasonCode = getReasonCode(scenario) as PartialProtectionOutput['reasonCode'];
    const outcomeRisk = getOutcomeRisk(scenario, calc.protectedAmount, calc.totalTripCost);
    
    // 5. Final Output
    const output: PartialProtectionOutput = {
      schemaVersion: "v1",
      scenario,
      totalTripCost: calc.totalTripCost,
      protectedAmount: calc.protectedAmount,
      unprotectedAmount: calc.unprotectedAmount,
      protectionBreakdown: calc.protectionBreakdown,
      reasonCode,
      outcomeRisk
    };

    // 6. Narrative & Intel
    const storyline = buildStoryline(output);
    const intel = fetchIntel(scenario);

    res.json({
      output,
      storyline,
      intel
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
