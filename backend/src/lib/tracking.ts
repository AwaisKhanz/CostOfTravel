import type { ToolEvent, TrackingPayload } from '../types/tracking.js';

class RybbitTracker {
  
  // In a real production scenario, this would POST to a tracking ingestion API
  // For now, we strictly log the typed payload to standard out to satisfy the spec
  public track(event: ToolEvent, payload: TrackingPayload) {
    if (!payload.toolId) {
       console.warn(`[Rybbit Warning] Dropped event '${event}'. Missing required field 'toolId'.`);
       return;
    }

    const timestamp = new Date().toISOString();
    
    // Simulate async network request
    process.nextTick(() => {
       console.log(JSON.stringify({
         timestamp,
         event,
         payload
       }));
    });
  }

}

export const rybbit = new RybbitTracker();
