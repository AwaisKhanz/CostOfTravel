export const quizQuestions = [
    {
        step: 1,
        question: "Which airline were you scheduled to fly with?",
        mapsTo: "airline",
        inputType: "select",
        options: [
            { label: "Delta Air Lines", value: "delta" },
            { label: "United Airlines", value: "united" },
            { label: "American Airlines", value: "american" },
            { label: "Southwest Airlines", value: "southwest" },
            { label: "Ryanair", value: "ryanair" }
        ]
    },
    {
        step: 2,
        question: "Did you miss this flight without canceling before departure?",
        mapsTo: "missedFlight",
        inputType: "radio",
        options: [
            { label: "Yes (I did not board and did not cancel in advance)", value: true },
            { label: "No (I made the flight)", value: false }
        ]
    },
    {
        step: 3,
        question: "Did you cancel the flight before the scheduled departure time?",
        mapsTo: "cancelledBeforeDeparture",
        inputType: "radio",
        options: [
            { label: "Yes (I officially canceled my booking before departure)", value: true },
            { label: "No (I did not cancel)", value: false }
        ]
    },
    {
        step: 4,
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
        step: 5,
        question: "When was the flight scheduled to depart?",
        mapsTo: "departureDateTimeLocal",
        inputType: "datetime-local"
    },
    {
        step: 6,
        question: "What was the total ticket price for all passengers on this booking?",
        mapsTo: "ticketPrice",
        inputType: "number",
        placeholder: "0.00"
    },
    {
        step: 7,
        question: "Where did the flight depart from?",
        mapsTo: "originAirportIATA",
        inputType: "text",
        placeholder: "e.g. JFK"
    },
    {
        step: 8,
        question: "How many passengers are on this booking?",
        mapsTo: "passengerCount",
        inputType: "number",
        placeholder: "1"
    }
];
