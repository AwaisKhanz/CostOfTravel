import type { OutcomeRisk } from './core.js';
export type { OutcomeRisk };

export interface BaseToolOutput {
  schemaVersion: 'v1';
  scenario: string;         // namespaced e.g. cancellation.free_24h
  outcomeRisk: OutcomeRisk;
  reasonCode: string;         // machine-readable, ALL_CAPS
}
