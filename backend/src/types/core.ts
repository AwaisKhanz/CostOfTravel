export type Region = 'US' | 'EU' | 'INTL';

export type OutcomeRisk = 
  | 'safe' 
  | 'partial_loss' 
  | 'high_risk' 
  | 'full_loss' 
  | 'cannot_determine';

export type CoverageLevel = 'none' | 'minimal' | 'limited' | 'broad';

/** 
 * Money is always USD and always rounded to 2 decimal places.
 * Calculations should use integer cents if precision is an issue, 
 * but final output is always rounded number.
 */
export type Money = number;
