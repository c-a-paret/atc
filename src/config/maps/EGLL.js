export const EGLL = {
    name: "London Heathrow",
    shortCode: "LHR",
    features: {
        runways: [
            {
                start: {
                    label: "9L",
                    x: 700,
                    y: 450
                },
                end: {
                    label: "27R",
                    x: 760,
                    y: 450
                }
            },
            {
                start: {
                    label: "9R",
                    x: 700,
                    y: 470
                },
                end: {
                    label: "27L",
                    x: 760,
                    y: 470
                }
            }
        ],
        vors: [
            {id: "OCK", name: "Ockham", x: 600, y: 600},
            {id: "LAM", name: "Lambourne", x: 900, y: 300},
            {id: "EPM", name: "Epsom", x: 650, y: 580},
        ],
        exclusionZones: [
            {
                level: "critical",
                boundaries: [
                    {x: 500, y: 600},
                    {x: 530, y: 550},
                    {x: 640, y: 500},
                    {x: 700, y: 500},
                    {x: 660, y: 550},
                    {x: 530, y: 630},
                ]
            },
            {
                level: "moderate",
                boundaries: [
                    {x: 940, y: 330},
                    {x: 1000, y: 310},
                    {x: 1050, y: 315},
                    {x: 1060, y: 400},
                    {x: 980, y: 500},
                    {x: 950, y: 420},
                ]
            }
        ]
    }
}