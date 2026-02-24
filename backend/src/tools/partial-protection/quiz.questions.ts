export const questions = [
  {
    step: 1,
    question: "Enter your trip costs",
    mapsTo: "tripCosts",
    inputType: "multi-currency",
    fields: [
      { name: "airfare", label: "Airfare", required: true },
      { name: "hotel", label: "Hotel", required: true },
      { name: "cruise", label: "Cruise", required: false },
      { name: "excursions", label: "Excursions", required: false },
      { name: "baggageFees", label: "Baggage Fees", required: false },
      { name: "petFees", label: "Pet Fees", required: false }
    ]
  },
  {
    step: 2,
    question: "Do you have travel protection?",
    mapsTo: "protectionType",
    inputType: "radio",
    options: [
      { label: "Insurance Policy", value: "insurance" },
      { label: "Credit Card Coverage", value: "credit_card" },
      { label: "None", value: "none" }
    ]
  },
  {
    step: 3,
    question: "Which provider is covering this trip?",
    mapsTo: "protectionProviderId",
    inputType: "select",
    options: [
      { label: "Allianz Global Assistance", value: "allianz_premium" },
      { label: "Amex Platinum Travel Protection", value: "amex_platinum" },
      { label: "Chase Sapphire Reserve Coverage", value: "chase_sapphire" },
      { label: "Generali Global", value: "generali_standard" }
    ],
    condition: (answers: any) => answers.protectionType !== "none"
  },
  {
    step: 4,
    question: "When did you book this trip?",
    mapsTo: "bookingDateLocal",
    inputType: "date"
  },
  {
    step: 5,
    question: "When was the protection purchased?",
    mapsTo: "insurancePurchaseDateLocal",
    inputType: "date",
    condition: (answers: any) => answers.protectionType === "insurance"
  },
  {
    step: 6,
    question: "What is the cancellation reason?",
    mapsTo: "cancellationReason",
    inputType: "radio",
    options: [
      { label: "Illness or Injury", value: "illness" },
      { label: "Carrier Schedule Change", value: "schedule_change" },
      { label: "Weather/Natural Disaster", value: "weather" },
      { label: "Personal Preference / Change of Mind", value: "personal" }
    ]
  }
];
