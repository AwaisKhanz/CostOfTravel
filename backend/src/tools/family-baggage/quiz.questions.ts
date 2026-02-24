export const quizQuestions = [
  {
    step: 1,
    question: "Which airline are you flying with?",
    mapsTo: "airline",
    inputType: "select",
    options: [
      { label: "Delta Air Lines", value: "delta" },
      { label: "United Airlines", value: "united" },
      { label: "Southwest Airlines", value: "southwest" },
      { label: "American Airlines", value: "american" },
      { label: "JetBlue Airways", value: "jetblue" },
      { label: "Spirit Airlines", value: "spirit" },
      { label: "Frontier Airlines", value: "frontier" }
    ]
  },
  {
    step: 2,
    question: "How many passengers are traveling?",
    mapsTo: "numberOfPassengers",
    inputType: "number",
    min: 1,
    placeholder: "e.g. 4"
  },
  {
    step: 3,
    question: "How many checked bags per passenger?",
    mapsTo: "bagsPerPassenger",
    inputType: "number",
    min: 0,
    placeholder: "e.g. 1"
  },
  {
    step: 4,
    question: "What is the weight of each checked bag (Kg)?",
    mapsTo: "bagWeightKg",
    inputType: "number",
    min: 0,
    placeholder: "e.g. 23"
  },
  {
    step: 5,
    question: "What is the total linear size (L+W+H) of each bag (cm)?",
    mapsTo: "bagLinearSizeCm",
    inputType: "number",
    min: 0,
    placeholder: "e.g. 157"
  },
  {
    step: 6,
    question: "Is this a domestic or international flight?",
    mapsTo: "routeType",
    inputType: "radio",
    options: [
      { label: "Domestic", value: "domestic" },
      { label: "International", value: "international" }
    ]
  },
  {
    step: 7,
    question: "When are you paying for these bags?",
    mapsTo: "purchaseChannel",
    inputType: "radio",
    options: [
      { label: "Online / In-Advance", value: "online" },
      { label: "At the Airport", value: "airport" }
    ]
  }
];
