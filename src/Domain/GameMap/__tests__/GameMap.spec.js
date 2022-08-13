import {GameMap} from "../GameMap";

describe('Runway existence', () => {
    let map;

    beforeEach(() => {
        map = new GameMap({
            features: {
                runways: [
                    {
                        start: {
                            label: "4C",
                        },
                        end: {
                            label: "220L",
                        }
                    }
                ]
            }
        })
    })

    test('Gets existing runway', () => {
        expect(map.runwayExists("4C")).toBeTruthy()
    })

    test('Does not get non-existent runway', () => {
        expect(map.runwayExists("12R")).toBeFalsy()
    })
})

describe('Runway information', () => {
    let map;

    beforeEach(() => {
        map = new GameMap({
            features: {
                runways: [
                    {
                        start: {
                            label: "4C",
                            key: "Value1"
                        },
                        end: {
                            label: "22L",
                            key: "Value2"
                        }
                    }
                ]
            }
        })
    })

    test('Gets existing runway start', () => {
        const result = map.getRunwayInfo("4C");
        expect(result.key).toBe("Value1")
    })

    test('Gets existing runway end', () => {
        const result = map.getRunwayInfo("22L");
        expect(result.key).toBe("Value2")
    })

    test('Returns null for non-existent runway', () => {
        expect(map.getRunwayInfo("12R")).toBeNull()
    })
})

describe('Waypoint information', () => {
    let map;

    beforeEach(() => {
        map = new GameMap({
            features: {
                waypoints: [
                    {type: "VOR", id: "OCK", name: "Ockham", x: 134, y: 354},
                    {type: "VOR", id: "GWC", name: "Goodwood", x: 721, y: 859},
                ]
            }
        })
    })

    test('Gets existing waypoint', () => {
        const result = map.getWaypointInfo("GWC");
        expect(result.name).toBe("Goodwood")
        expect(result.x).toBe(721)
        expect(result.y).toBe(859)
    })

    test('Returns null for non-existent waypoint', () => {
        expect(map.getWaypointInfo("XXX")).toBeNull()
    })
})