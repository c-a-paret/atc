import {ILS_MAX_X} from "../constants";

const x = document.body.clientWidth
const y = document.body.clientHeight
const runwayWidth = x / 25
const runwayGap = x / 60

export const EGLL = {
    name: "London Heathrow",
    shortCode: "LHR",
    defaultWaypoint: "LON",
    maxX: x,
    maxY: y,
    features: {
        runways: [
            {
                start: {
                    label: "9L",
                    heading: 90,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x / 2 - (runwayWidth / 2),
                            y: y / 2,
                        },
                        outerMarker: {
                            x: x / 2 - (runwayWidth / 2) - ILS_MAX_X,
                            y: y / 2,
                        }
                    }
                },
                end: {
                    label: "27R",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x / 2 + (runwayWidth / 2),
                            y: y / 2,
                        },
                        outerMarker: {
                            x: x / 2 + (runwayWidth / 2) + ILS_MAX_X,
                            y: y / 2,
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
                            x: x / 2 - (runwayWidth / 2),
                            y: y / 2 + runwayGap,
                        },
                        outerMarker: {
                            x: x / 2 - (runwayWidth / 2) - ILS_MAX_X,
                            y: y / 2 + runwayGap,
                        }
                    }
                },
                end: {
                    label: "27L",
                    heading: 270,
                    altitude: 0,
                    ILS: {
                        innerMarker: {
                            x: x / 2 + (runwayWidth / 2),
                            y: y / 2 + runwayGap,
                        },
                        outerMarker: {
                            x: x / 2 + (runwayWidth / 2) + ILS_MAX_X,
                            y: y / 2 + runwayGap,
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

            {type: "RWY", id: "9L", name: "Runway 9L", x: x / 2 - (runwayWidth / 2), y: y / 2},
            {type: "RWY", id: "9R", name: "Runway 9R", x: x / 2 - (runwayWidth / 2), y: y / 2 + runwayGap},
            {type: "RWY", id: "27L", name: "Runway 27L", x: x / 2 + (runwayWidth / 2), y: y / 2 + runwayGap},
            {type: "RWY", id: "27R", name: "Runway 27R", x: x / 2 + (runwayWidth / 2), y: y / 2},
        ],
        exclusionZones: [
            {
                level: "critical",
                dashes: 2,
                label: {text: "D139", location: {"x": 0.39 * x, "y": 0.68 * y}},
                minAltitude: null,
                maxAltitude: null,
                boundaries: [
                    {x: (0.34 * x), y: (0.74 * y), inv_y: y - (0.74 * y)},
                    {x: (0.36 * x), y: (0.67 * y), inv_y: y - (0.67 * y)},
                    {x: (0.42 * x), y: (0.6 * y), inv_y: y - (0.6 * y)},
                    {x: (0.47 * x), y: (0.6 * y), inv_y: y - (0.6 * y)},
                    {x: (0.44 * x), y: (0.67 * y), inv_y: y - (0.67 * y)},
                    {x: (0.39 * x), y: (0.76 * y), inv_y: y - (0.76 * y)},
                ]
            },
            {
                level: "moderate",
                dashes: 2,
                label: {text: "C422", location: {"x": 0.66 * x, "y": 0.47 * y}},
                minAltitude: 3000,
                maxAltitude: 5000,
                boundaries: [
                    {x: (0.62 * x), y: (0.395 * y), inv_y: y - (0.395 * y)},
                    {x: (0.67 * x), y: (0.37 * y), inv_y: y - (0.37 * y)},
                    {x: (0.705 * x), y: (0.388 * y), inv_y: y - (0.388 * y)},
                    {x: (0.715 * x), y: (0.49 * y), inv_y: y - (0.49 * y)},
                    {x: (0.66 * x), y: (0.62 * y), inv_y: y - (0.62 * y)},
                    {x: (0.63 * x), y: (0.52 * y), inv_y: y - (0.52 * y)},
                ]
            },
            {
                level: "informational",
                dashes: 0,
                label: {text: "F79J", location: {"x": 0.353 * x, "y": 0.115 * y}},
                minAltitude: 5000,
                maxAltitude: 40000,
                boundaries: [
                    {x: 0.4 * x, y: 0.1 * y, inv_y: y - (0.1 * y)},
                    {x: 0.4 * x, y: 0.15 * y, inv_y: y - (0.15 * y)},
                    {x: 0.35 * x, y: 0.15 * y, inv_y: y - (0.15 * y)},
                    {x: 0.35 * x, y: 0.1 * y, inv_y: y - (0.1 * y)},
                ]
            }
        ],
        mapLines: [
            {dashes: 3, start: {"x": 0, "y": 0}, end: {"x": 0.3 * x, "y": 0.3 * y}},
            {dashes: 3, start: {"x": 0.3 * x, "y": 0.3 * y}, end: {"x": 0, "y": 0.6 * y}},
            {dashes: 3, start: {"x": 0.3 * x, "y": 0.3 * y}, end: {"x": x, "y": 0.3 * y}},
            {dashes: 3, start: {"x": 0.15 * x, "y": 0.15 * y}, end: {"x": 0.4 * x, "y": 0.1 * y}},
            {dashes: 3, start: {"x": 0.4 * x, "y": 0.1 * y}, end: {"x": 0.45 * x, "y": 0.3 * y}},
            {dashes: 20, start: {"x": 0, "y": 0.7 * y}, end: {"x": 0.38 * x, "y": 0.3 * y}},

            {dashes: 20, start: {"x": 0.8 * x, "y": 0}, end: {"x": 0.75 * x, "y": 0.3 * y}},
            {dashes: 20, start: {"x": 0.75 * x, "y": 0.3 * y}, end: {"x": 0.6 * x, "y": 0.6 * y}},
            {dashes: 20, start: {"x": 0.6 * x, "y": 0.6 * y}, end: {"x": 0.5 * x, "y": 0.6 * y}},
            {dashes: 20, start: {"x": 0.5 * x, "y": 0.6 * y}, end: {"x": 0.3 * x, "y": y}},
            {dashes: 20, start: {"x": 0.6 * x, "y": 0.6 * y}, end: {"x": 0.63 * x, "y": y}},
        ],
        crosses: [
            {"x": 0.3 * x, "y": 0.3 * y},
            {"x": 0.38 * x, "y": 0.3 * y},
            {"x": 0.15 * x, "y": 0.15 * y},
            {"x": 0.4 * x, "y": 0.1 * y},
            {"x": 0.45 * x, "y": 0.3 * y},
            {"x": 0.75 * x, "y": 0.3 * y},
            {"x": 0.6 * x, "y": 0.6 * y},
            {"x": 0.5 * x, "y": 0.6 * y},

            {"x": 0.45 * x, "y": 0.7 * y},
            {"x": 0.35 * x, "y": 0.8 * y},
            {"x": 0.25 * x, "y": 0.85 * y},

            {"x": 0.7 * x, "y": 0.35 * y},
            {"x": 0.65 * x, "y": 0.35 * y},
            {"x": 0.60 * x, "y": 0.4 * y},

            {"x": 0.80 * x, "y": 0.8 * y},
            {"x": 0.70 * x, "y": 0.88 * y},
            {"x": 0.87 * x, "y": 0.52 * y},
            {"x": 0.55 * x, "y": 0.17 * y},

            {"x": 0.1 * x, "y": 0.17 * y},
            {"x": 0.15 * x, "y": 0.3 * y},

        ]
    },
    terrain: {
        rivers: [
            // {
            //     name: "Thames",
            //     borders: [
            //         [
            //             {x: x, y: 0.5 * y },
            //             {x: 0.995 * x, y: 0.49 * y },
            //             {x: 0.99 * x, y: 0.47 * y },
            //             {x: 0.975 * x, y: 0.45 * y },
            //             {x: 0.965 * x, y: 0.452 * y },
            //         ]
            //     ]
            // }
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