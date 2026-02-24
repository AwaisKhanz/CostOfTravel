import { Router } from 'express';
import { generateExplanation } from '../services/llm.service.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const outputData = req.body;
        if (!outputData || !outputData.scenario) {
            return res.status(400).json({ error: 'Valid BaseToolOutput is required' });
        }
        const explanation = await generateExplanation(outputData);
        res.json({ explanation });
    }
    catch (error) {
        res.status(500).json({ error: 'LLM Generation Failed', details: error.message });
    }
});
export default router;
