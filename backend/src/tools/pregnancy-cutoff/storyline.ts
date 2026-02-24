import type { PregnancyTravelOutput, Storyline } from './types.js';

export function buildStoryline(output: PregnancyTravelOutput): Storyline {
  const { scenario, outcomeRisk } = output;

  if (outcomeRisk === "cannot_determine") {
    return {
      headline: "Policy Information Missing",
      verdict: "We cannot determine eligibility at this time.",
      riskSummary: "The carrier policy for pregnancy is not in our database.",
      whyThisHappens: "Specific cutoff rules vary significantly by airline and cruise line.",
      whatHappensNext: [
        "Contact the carrier directly for their pregnancy policy",
        "Consult with your healthcare provider",
        "Check your ticket terms for medical cancellation rules"
      ]
    };
  }

  switch (scenario) {
    case "pregnancy.denied":
      return {
        headline: "Here’s what happens if you attempt to board.",
        verdict: "Boarding is likely to be denied.",
        riskSummary: "This exceeds the carrier’s absolute pregnancy cutoff policy.",
        whyThisHappens: "This carrier prohibits travel beyond the specified gestation period for safety reasons.",
        whatHappensNext: [
          "Boarding may be refused at check-in",
          "Standard ticket rules and penalties remain in effect",
          "Rebooking or cancellation may be required"
        ]
      };

    case "pregnancy.high_risk":
      return {
        headline: "High Risk of Boarding Denial",
        verdict: "Boarding is restricted by policy.",
        riskSummary: "You are within the carrier's high-restriction window.",
        whyThisHappens: "Most carriers have a hard stop for travel (usually 36 weeks for air, 24 for cruise).",
        whatHappensNext: [
          "Expect boarding to be refused if gestation exceeds policy limits",
          "Verify if a medical waiver is available (rare for absolute cutoffs)",
          "Review your travel insurance for 'Fit to Travel' requirements"
        ]
      };

    case "pregnancy.documentation_required":
      return {
        headline: "Documentation Required for Travel",
        verdict: "Travel is allowed WITH medical clearance.",
        riskSummary: "A 'Fit to Fly' or 'Fit to Travel' certificate is required.",
        whyThisHappens: "Carriers require medical confirmation of gestation and fitness after a certain week.",
        whatHappensNext: [
          "Obtain a signed medical certificate from your doctor",
          "Ensure the certificate is dated within the carrier's required window",
          "Present the certificate at check-in to avoid boarding delays"
        ]
      };

    case "pregnancy.allowed":
    default:
      return {
        headline: "Eligibility Confirmed",
        verdict: "Travel is currently within policy limits.",
        riskSummary: "No specific pregnancy restrictions apply for this gestation period.",
        whyThisHappens: "Your gestation age at departure is below the carrier's primary documentation and cutoff triggers.",
        whatHappensNext: [
          "Travel as planned",
          "Monitor for any changes in your health status before departure",
          "Keep a copy of your gestation dating for reference"
        ]
      };
  }
}
