const x = document.body.clientWidth
const y = document.body.clientHeight
const runwayWidth = x/25
const runwayGap = x/70

export const EGLL = {
    name: "London Heathrow",
    shortCode: "LHR",
    features: {
        runways: [
            {
                start: {
                    label: "9L",
                    heading: 90,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x/2 - (runwayWidth / 2),
                            y: y/2,
                        },
                        outerMarker: {
                            x: undefined,
                            y: undefined,
                        }
                    }
                },
                end: {
                    label: "27R",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x/2 + (runwayWidth / 2),
                            y: y/2,
                        },
                        outerMarker: {
                            x: undefined,
                            y: undefined,
                        }
                    }
                }
            },
            {
                start: {
                    label: "9R",
                    heading: 90,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x/2 - (runwayWidth / 2),
                            y: y/2 + runwayGap,
                        },
                        outerMarker: {
                            x: undefined,
                            y: undefined,
                        }
                    }
                },
                end: {
                    label: "27L",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x/2 + (runwayWidth / 2),
                            y: y/2 + runwayGap,
                        },
                        outerMarker: {
                            x: undefined,
                            y: undefined,
                        }
                    }
                }
            }
        ],
        waypoints: [
            {type: "VOR", id: "OCK", name: "Ockham", x: (0.51 * x), y: (0.75 * y)},
            {type: "VOR", id: "GWC", name: "Goodwood", x: (0.32 * x), y: (0.84 * y)},
            {type: "VOR", id: "LON", name: "London", x: (0.495 * x), y: (0.48 * y)},
            {type: "VOR", id: "BPK", name: "Brookman's Park", x: (0.75 * x), y: (0.1 * y)},
            {type: "VOR", id: "CPT", name: "Compton", x: (0.15 * x), y: (0.48 * y)},
            {type: "VOR", id: "DET", name: "Detling", x: (0.95 * x), y: (0.85 * y)},
            {type: "VOR", id: "MAY", name: "Mayfield", x: (0.65 * x), y: (0.85 * y)},
            {type: "VOR", id: "LAM", name: "Lambourne", x: (0.7 * x), y: (0.28 * y)},
            {type: "VOR", id: "EPM", name: "Epsom", x: (0.55 * x), y: (0.73 * y)},

            {type: "RWY", id: "9L", name: "Runway 9L", x: x/2 - (runwayWidth / 2), y: y/2},
            {type: "RWY", id: "9R", name: "Runway 9R", x: x/2 - (runwayWidth / 2), y: y/2 + runwayGap},
            {type: "RWY", id: "27L", name: "Runway 27L", x: x/2 + (runwayWidth / 2), y: y/2 + runwayGap},
            {type: "RWY", id: "27R", name: "Runway 27R", x: x/2 + (runwayWidth / 2), y: y/2},
        ],
        exclusionZones: [
            {
                level: "critical",
                boundaries: [
                    {x: (0.34 * x), y: (0.74 * y)},
                    {x: (0.36 * x), y: (0.67 * y)},
                    {x: (0.42 * x), y: (0.6 * y)},
                    {x: (0.47 * x), y: (0.6 * y)},
                    {x: (0.44 * x), y: (0.67 * y)},
                    {x: (0.39 * x), y: (0.76 * y)},
                ]
            },
            {
                level: "moderate",
                boundaries: [
                    {x: (0.62 * x), y: (0.395 * y)},
                    {x: (0.67 * x), y: (0.37 * y)},
                    {x: (0.705 * x), y: (0.388 * y)},
                    {x: (0.715 * x), y: (0.49 * y)},
                    {x: (0.66 * x), y: (0.62 * y)},
                    {x: (0.63 * x), y: (0.52 * y)},
                ]
            }
        ]
    },

    runwayExists(targetRunway) {
        for (let x = 0; x < this.features.runways.length; x++) {
            let runway = this.features.runways[x]
            if (runway.start.label === targetRunway || runway.end.label === targetRunway) {
                return true
            }
        }
        return false
    },

    getRunwayInfo(targetRunway) {
        for (let x = 0; x < this.features.runways.length; x++) {
            let runway = this.features.runways[x]
            if (runway.start.label === targetRunway) {
                return runway.start
            }
            if (runway.end.label === targetRunway) {
                return runway.end
            }
        }
        return null
    }
}