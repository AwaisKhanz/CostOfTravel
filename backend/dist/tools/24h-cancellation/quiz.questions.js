// Represents the UI sequence and mapping for the 24-hour cancellation quiz.
export const quizQuestions = [
    {
        step: 1,
        question: "When did you book this ticket?",
        mapsTo: "bookingDateTimeLocal",
        inputType: "datetime-local",
    },
    {
        step: 2,
        question: "When does the flight depart?",
        mapsTo: "departureDateTimeLocal",
        inputType: "datetime-local",
    },
    {
        step: 3,
        question: "Where does the flight depart from?",
        mapsTo: "originAirportIATA",
        inputType: "autocomplete",
        placeholder: "e.g. JFK",
        note: "Autocomplete implementation should show full name and code",
    },
    {
        step: 4,
        question: "Where did you book?",
        mapsTo: "bookingChannel",
        inputType: "radio",
        options: [
            { label: "Directly with airline", value: "direct" },
            { label: "Online travel agency", value: "ota" },
        ],
    },
];
