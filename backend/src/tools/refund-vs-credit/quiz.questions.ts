export const quizQuestions = [
  {
    step: 1,
    question: "Which airline are you flying with?",
    mapsTo: "airline",
    inputType: "select",
    options: [
      { label: "Delta Air Lines", value: "delta" },
      { label: "United Airlines", value: "united" },
      { label: "American Airlines", value: "american" },
      { label: "Southwest Airlines", value: "southwest" },
      { label: "JetBlue", value: "jetblue" }
    ]
  },
  {
    step: 2,
    question: "Is this cancellation initiated by the airline?",
    mapsTo: "isAirlineInitiated",
    inputType: "radio",
    options: [
      { label: "Yes (Airline cancelled or delayed my flight)", value: true },
      { label: "No (I am choosing to cancel my trip)", value: false }
    ]
  },
  {
    step: 3,
    question: "What type of fare did you purchase?",
    mapsTo: "fareClassId",
    inputType: "radio",
    options: [
      { label: "Basic Economy (Non-flexible)", value: "basic_economy" },
      { label: "Standard Economy / Main Cabin", value: "standard_economy" },
      { label: "Refundable / Flexible", value: "refundable" },
      { label: "Award Ticket (Points/Miles)", value: "award" }
    ]
  },
  {
    step: 4,
    question: "When did you book this ticket?",
    mapsTo: "bookingDateTimeLocal",
    inputType: "datetime-local"
  },
  {
    step: 5,
    question: "When does the flight depart?",
    mapsTo: "departureDateTimeLocal",
    inputType: "datetime-local"
  },
  {
    step: 6,
    question: "What was the total ticket price paid?",
    mapsTo: "ticketPrice",
    inputType: "number",
    placeholder: "0.00"
  },
  {
    step: 7,
    question: "Where does the flight depart from?",
    mapsTo: "originAirportIATA",
    inputType: "text",
    placeholder: "e.g. JFK"
  }
];
