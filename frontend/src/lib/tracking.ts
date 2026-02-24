// Frontend Tracking Client (Mocked for Rybbit)

export type ToolEvent = 
  | 'tool_view' 
  | 'tool_submit' 
  | 'tool_complete' 
  | 'llm_explanation_shown'
  | 'outcome_safe'
  | 'outcome_high_risk'
  | 'outcome_denied'
  | 'outcome_partial_loss'
  | 'outcome_full_loss'
  | 'outcome_high_cost'
  | 'outcome_cannot_determine';

export interface TrackingPayload {
  toolId: string;
  scenario?: string;
  outcomeRisk?: string;
  [key: string]: any; 
}

export const trackEvent = (event: ToolEvent, payload: TrackingPayload) => {
  if (typeof window === 'undefined') return;

  // In production, this would send an active beacon or fetch request to the ingestion server.
  // For the architectural build, we log to console to prove events are firing synchronously.
  console.log(`[Rybbit Frontend] => ${event}`, payload);
};
