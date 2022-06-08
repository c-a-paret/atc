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
                            x: 700,
                            y: 450,
                        },
                        outerMarker: {
                            x: 550,
                            y: 450,
                        }
                    }
                },
                end: {
                    label: "27R",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: 760,
                            y: 450,
                        },
                        outerMarker: {
                            x: 910,
                            y: 450,
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
                            x: 700,
                            y: 470,
                        },
                        outerMarker: {
                            x: 550,
                            y: 470,
                        }
                    }
                },
                end: {
                    label: "27L",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: 760,
                            y: 470,
                        },
                        outerMarker: {
                            x: 910,
                            y: 470,
                        }
                    }
                }
            }
        ],
        vors: [ // TODO: Change to be more generic
            {type: "VOR", id: "OCK", name: "Ockham", x: 600, y: 600},
            {type: "VOR", id: "LAM", name: "Lambourne", x: 900, y: 300},
            {type: "VOR", id: "EPM", name: "Epsom", x: 650, y: 580},
            // TODO: Don't render RWY type
            {type: "RWY", id: "9L", name: "Runway 9L", x: 700, y: 450},
            {type: "RWY", id: "9R", name: "Runway 9R", x: 700, y: 470},
            {type: "RWY", id: "27L", name: "Runway 27L", x: 760, y: 470},
            {type: "RWY", id: "27R", name: "Runway 27R", x: 760, y: 450},
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