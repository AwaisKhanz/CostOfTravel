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
            { value: "ryanair", label: "Ryanair" },
            { value: "lufthansa", label: "Lufthansa" },
            { value: "emirates", label: "Emirates" }
        ]
    },
    {
        step: 1,
        question: "Is your pet a dog or a cat?",
        mapsTo: "petType",
        inputType: "radio",
        options: [
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" }
        ]
    },
    {
        step: 2,
        question: "What breed is your pet?",
        mapsTo: "breedId",
        inputType: "select",
        options: [
            // Dogs
            { value: "french_bulldog", label: "French Bulldog" },
            { value: "pug", label: "Pug" },
            { value: "pit_bull", label: "Pit Bull Terrier" },
            { value: "golden_retriever", label: "Golden Retriever" },
            { value: "beagle", label: "Beagle" },
            { value: "rottweiler", label: "Rottweiler" },
            { value: "mastiff", label: "Mastiff" },
            // Cats
            { value: "persian_cat", label: "Persian Cat" },
            { value: "siamese_cat", label: "Siamese Cat" },
            { value: "ragdoll", label: "Ragdoll" }
        ]
    },
    {
        step: 3,
        question: "Will your pet travel in the cabin or as cargo?",
        mapsTo: "travelMethod",
        inputType: "radio",
        options: [
            { value: "cabin", label: "In Cabin" },
            { value: "cargo", label: "As Cargo / Manifested" }
        ]
    },
    {
        step: 4,
        question: "Is this a domestic or international route?",
        mapsTo: "routeType",
        inputType: "radio",
        options: [
            { value: "domestic", label: "Domestic" },
            { value: "international", label: "International" }
        ]
    }
];
