export const quizQuestions = [
    {
        step: 0,
        question: "Which airline are you flying with?",
        mapsTo: "airline",
        inputType: "select",
        options: [
            { value: "delta", label: "Delta Air Lines" },
            { value: "united", label: "United Airlines" },
            { value: "american", label: "American Airlines" },
            { value: "southwest", label: "Southwest Airlines" },
            { value: "jetblue", label: "JetBlue" }
        ]
    },
    {
        step: 1,
        question: "What type of fare did you purchase?",
        mapsTo: "fareClassId",
        inputType: "radio",
        options: [
            { value: "basic_economy", label: "Basic Economy (Non-Refundable)" },
            { value: "standard_economy", label: "Standard Economy / Main Cabin" },
            { value: "refundable", label: "Fully Refundable" },
            { value: "award", label: "Award Ticket (Points/Miles)" }
        ]
    },
    {
        step: 2,
        question: "When did you book this ticket?",
        mapsTo: "bookingDateTimeLocal",
        inputType: "datetime-local"
    },
    {
        step: 3,
        question: "When does the flight depart?",
        mapsTo: "departureDateTimeLocal",
        inputType: "datetime-local"
    },
    {
        step: 4,
        question: "What was the total ticket price paid?",
        mapsTo: "ticketPrice",
        inputType: "number",
        validation: "Must be greater than 0"
    },
    {
        step: 5,
        question: "Where does the flight depart from?",
        mapsTo: "originAirportIATA",
        inputType: "text",
        placeholder: "e.g. JFK, LAX, ORD",
        validation: "3-letter IATA code"
    }
];
