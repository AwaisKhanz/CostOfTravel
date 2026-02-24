export type OutcomeRisk = 'safe' | 'partial_loss' | 'high_risk' | 'full_loss' | 'cannot_determine';

export interface BaseToolOutput {
  schemaVersion: string;
  scenario: string;
  outcomeRisk: OutcomeRisk;
  reasonCode: string;
}

export interface CancellationOutput extends BaseToolOutput {
  refundAmount: number;
  creditAmount: number;
  totalLoss: number;
  currency: string;
  storyline: string;
  intel: any;
}

export interface CruisePenaltyOutput extends BaseToolOutput {
  daysBeforeSail: number;
  penaltyAmount: number;
  refundAmount: number;
  refundMethod: 'cash' | 'fcc' | 'none';
  currency: string;
  daysUntilNextCliff: number | null;
  storyline: string;
  intel: any;
}

export interface CheckInOutput extends BaseToolOutput {
  deadlinePassed: boolean;
  onlineDeadlineHours: number;
  airportFeePerPassenger: number;
  totalAirportFee: number;
  currency: string;
  storyline: string;
  intel: any;
}

export interface PregnancyOutput extends BaseToolOutput {
  weeksAtDeparture: number;
  isAllowed: boolean;
  requiresDocumentation: boolean;
  isHighRisk: boolean;
  policyDetails: {
    maxWeeksSingle: number;
    maxWeeksMultiple: number;
    documentationRequiredAfterWeeks: number;
  };
  storyline: string;
  intel: any;
}

export interface PetBanOutput extends BaseToolOutput {
  breedStatus: 'allowed' | 'restricted' | 'banned';
  restrictionDetails: string | null;
  storyline: string;
  intel: any;
}
