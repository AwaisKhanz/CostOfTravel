// Quiz questions sequence exposed to the frontend wrapper for Tool #2
export const quizQuestions = [
    {
        step: 1,
        question: "Which cruise line are you sailing with?",
        mapsTo: "cruiseLine",
        inputType: "select",
        options: [
            { label: "Royal Caribbean", value: "royal_caribbean" },
            { label: "Carnival Cruise Line", value: "carnival" },
            { label: "Norwegian Cruise Line", value: "norwegian" },
            { label: "Princess Cruises", value: "princess" },
            { label: "Holland America", value: "holland" },
            { label: "Celebrity Cruises", value: "celebrity" },
            { label: "Disney Cruise Line", value: "disney" },
            { label: "MSC Cruises", value: "msc" }
        ]
    },
    {
        step: 2,
        question: "When does your cruise depart?",
        mapsTo: "sailDateLocal",
        inputType: "date",
    },
    {
        step: 3,
        question: "When are you canceling?",
        mapsTo: "cancellationDateLocal",
        inputType: "date",
        validation: "Must not be future date.",
    },
    {
        step: 4,
        question: "What type of fare did you book?",
        mapsTo: "fareType",
        inputType: "radio",
        options: [
            { label: "Standard fare", value: "standard" },
            { label: "Non-refundable deposit", value: "non_refundable" },
            { label: "Promotional fare", value: "promo" },
        ],
    },
    {
        step: 5,
        question: "What was the total cruise fare paid?",
        mapsTo: "totalTripCost",
        inputType: "currency",
    },
];
