export const quizQuestions = [
    {
        step: 0,
        question: "Is this travel by air or cruise?",
        mapsTo: "transportType",
        inputType: "radio",
        options: [
            { value: "air", label: "Air" },
            { value: "cruise", label: "Cruise" }
        ]
    },
    {
        step: 1,
        question: "Which airline or cruise line are you traveling with?",
        mapsTo: "carrier",
        inputType: "select",
        options: [
            { value: "delta", label: "Delta Air Lines" },
            { value: "united", label: "United Airlines" },
            { value: "american", label: "American Airlines" },
            { value: "southwest", label: "Southwest Airlines" },
            { value: "ryanair", label: "Ryanair" },
            { value: "royal_caribbean", label: "Royal Caribbean" },
            { value: "carnival", label: "Carnival Cruise Line" },
            { value: "norwegian", label: "Norwegian Cruise Line" }
        ]
    },
    {
        step: 2,
        question: "When does your trip depart?",
        mapsTo: "departureDateLocal",
        inputType: "datetime-local"
    },
    {
        step: 3,
        question: "How many weeks pregnant will you be on the departure date?",
        mapsTo: "weeksPregnantAtDeparture",
        inputType: "number",
        validation: "Range: 0–45 weeks"
    },
    {
        step: 4,
        question: "Is this a multiple pregnancy (twins or more)?",
        mapsTo: "isMultiplePregnancy",
        inputType: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
        ]
    },
    {
        step: 5,
        question: "Do you have a medical clearance certificate?",
        mapsTo: "hasMedicalCertificate",
        inputType: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
        ]
    }
];
