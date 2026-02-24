export type ToolEvent = 
  | 'tool_view' 
  | 'tool_submit' 
  | 'tool_complete' 
  | 'llm_explanation_shown'
  | 'outcome_safe'
  | 'outcome_partial_loss'
  | 'outcome_full_loss'
  | 'outcome_cannot_determine';

export interface TrackingPayload {
  toolId: string;
  scenario?: string; // Scenario IDs e.g. cancellation.free_24h
  outcomeRisk?: string; // OutcomeRisk enum
  [key: string]: any; // Allow optional tool-specific metadata like jurisdiction or airline
}
