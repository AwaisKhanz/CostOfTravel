import type { PregnancyTravelInput, PregnancyPolicy, Scenario } from './types.js';

export interface MapperOutput {
  scenario: Scenario;
  policy: PregnancyPolicy | null;
}

export function mapScenario(input: PregnancyTravelInput, policy: PregnancyPolicy | null): MapperOutput {
  if (!policy) {
    return { scenario: "pregnancy.policy_missing", policy: null };
  }

  const { weeksPregnantAtDeparture, isMultiplePregnancy, hasMedicalCertificate } = input;
  const { absoluteCutoffWeeks, maxWeeksMultiple, maxWeeksSingle, documentationRequiredAfterWeeks } = policy;

  if (weeksPregnantAtDeparture >= absoluteCutoffWeeks) {
    return { scenario: "pregnancy.denied", policy };
  }

  if (isMultiplePregnancy && weeksPregnantAtDeparture >= maxWeeksMultiple) {
    return { scenario: "pregnancy.denied", policy };
  }

  if (!isMultiplePregnancy && weeksPregnantAtDeparture >= maxWeeksSingle) {
    return { scenario: "pregnancy.high_risk", policy };
  }

  if (weeksPregnantAtDeparture >= documentationRequiredAfterWeeks && !hasMedicalCertificate) {
    return { scenario: "pregnancy.documentation_required", policy };
  }

  return { scenario: "pregnancy.allowed", policy };
}
