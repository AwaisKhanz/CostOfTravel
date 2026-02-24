// Quiz questions sequence exposed to the frontend wrapper for Tool #3
export const quizQuestions = [
    {
        step: 1,
        question: "Which airline are you flying with?",
        mapsTo: "airline",
        inputType: "select",
        options: [
            { label: "Ryanair", value: "ryanair" },
            { label: "Wizz Air", value: "wizz" },
            { label: "Spirit Airlines", value: "spirit" },
            { label: "Frontier Airlines", value: "frontier" },
            { label: "EasyJet", value: "easyjet" },
            { label: "AirAsia", value: "airasia" },
            { label: "JetBlue", value: "jetblue" }
        ]
    },
    {
        step: 2,
        question: "When does your flight depart?",
        mapsTo: "departureDateTimeLocal",
        inputType: "datetime-local",
    },
    {
        step: 3,
        question: "Is this a domestic or international flight?",
        mapsTo: "routeType",
        inputType: "radio",
        options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" }
        ]
    },
    {
        step: 4,
        question: "Have you already checked in online?",
        mapsTo: "hasCheckedInOnline",
        inputType: "radio",
        options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" }
        ]
    },
    {
        step: 5,
        question: "How many passengers are on this booking?",
        mapsTo: "passengerCount",
        inputType: "number",
        validation: "Minimum: 1 passenger",
    }
];
