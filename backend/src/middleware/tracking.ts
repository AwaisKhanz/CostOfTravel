import type { Request, Response, NextFunction } from 'express';
import { rybbit } from '../lib/tracking.js';
import type { ToolEvent, TrackingPayload } from '../types/tracking.js';

/**
 * Middleware to intercept tool outputs and fire tracking events automatically.
 * Assumes the route handler calls res.json(output) with the tool result.
 */
export const trackToolResult = (toolId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // Store original res.json
    const originalJson = res.json.bind(res);
    
    // Override res.json to capture the output payload before sending
    res.json = (body: any) => {
      
      // Fire tracking if it looks like a valid tool output
      if (body && body.schemaVersion === 'v1' && body.outcomeRisk) {
         
         const payload: TrackingPayload = {
           toolId,
           scenario: body.scenario,
           outcomeRisk: body.outcomeRisk
         };

         // Fire the completion event
         rybbit.track('tool_complete', payload);

         // Fire the specific risk outcome funnel event
         rybbit.track(`outcome_${body.outcomeRisk}` as ToolEvent, payload);
      }

      // Call the original res.json to actually send the response
      return originalJson(body);
    };

    next();
  };
};
