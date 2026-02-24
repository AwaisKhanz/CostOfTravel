import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import twentyFourHourRouter from './tools/24h-cancellation/index.js';
import cruisePenaltyRouter from './tools/cruise-penalty/index.js';
import budgetCheckinRouter from './tools/budget-checkin/index.js';
import pregnancyCutoffRouter from './tools/pregnancy-cutoff/index.js';
import { petBreedBanRouter } from './tools/pet-breed-ban/index.js';
import { flightCancellationRouter } from './tools/flight-cancellation/index.js';
import { refundVsCreditRouter } from './tools/refund-vs-credit/index.js';
import { noShowPenaltyRouter } from './tools/no-show-penalty/index.js';
import { familyBaggageRouter } from './tools/family-baggage/index.js';
import explainRouter from './routes/explain.js';
import airportsRouter from './routes/airports.js';

import { geographyService } from './utils/geography.js';
import { trackToolResult } from './middleware/tracking.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Geography Data
await geographyService.init();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/api/tools/24h-cancellation', trackToolResult('24h_cancellation'), twentyFourHourRouter);
app.use('/api/tools/cruise-penalty', trackToolResult('cruise_penalty'), cruisePenaltyRouter);
app.use('/api/tools/budget-checkin', trackToolResult('budget_checkin'), budgetCheckinRouter);
app.use('/api/tools/pregnancy-cutoff', pregnancyCutoffRouter);
app.use('/api/tools/pet-breed-ban', petBreedBanRouter);
app.use('/api/tools/flight-cancellation', flightCancellationRouter);
app.use('/api/tools/refund-vs-credit', refundVsCreditRouter);
app.use('/api/tools/no-show-penalty', noShowPenaltyRouter);
app.use('/api/tools/family-baggage', familyBaggageRouter);

app.use('/api/explain', explainRouter);
app.use('/api/airports', airportsRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve Frontend Static Bundle in Production
const frontendBuildPath = path.resolve(__dirname, '../../frontend/out');
app.use(express.static(frontendBuildPath));
app.get(/.*$/, (req: Request, res: Response) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
