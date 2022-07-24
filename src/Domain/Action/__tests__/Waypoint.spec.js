import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {GameMap} from "../../GameMap/GameMap";
import {Waypoint} from "../Waypoint";

const testGameMap = () => {
    return new GameMap({
        features: {
            runways: [{
                start: {
                    label: "9L", heading: 90, altitude: 0, landingZone: {
                        x: 510, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 500,
                        }, outerMarker: {
                            x: 280, y: 500,
                        }
                    }
                }, end: {
                    label: "27R", heading: 270, altitude: 0, landingZone: {
                        x: 490, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 550,
                        }, outerMarker: {
                            x: 720, y: 550,
                        }
                    }
                }
            }], waypoints: [{type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},]
        }
    })
}

describe("Waypoint", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Turns to face waypoint top right quadrant", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 5000, 3)

        const action = new Waypoint(map, aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBeLessThan(90)
    })

    test("Turns to face waypoint bottom right quadrant", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 300, 200, 200, 90, 5000, 3)

        const action = new Waypoint(map, aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBeGreaterThan(90)
    })

    test("Turns to face waypoint top left quadrant", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 600, 600, 200, 90, 5000, 3)

        const action = new Waypoint(map, aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBeLessThan(90)
    })

    test("Turns to face waypoint bottom left quadrant", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 1000, 200, 200, 90, 5000, 3)

        const action = new Waypoint(map, aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBeGreaterThan(90)
    })

    test("Turns to face LAM from slightly North West", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 200, 800, 200, 355, 5000, 3)

        const action = new Waypoint(map, aeroplane, "LAM")

        expect(aeroplane.heading).toBe(355)
        action.apply()
        expect(aeroplane.heading).toBeGreaterThan(355)
        action.apply()
        expect(aeroplane.heading).toBeGreaterThan(357)
    })

    test("Is not valid if the waypoint does not exist", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 5000, 3)
        let incorrectWaypoint = "BIP";

        expect(new Waypoint(map, aeroplane, incorrectWaypoint).isValid()).toBeFalsy()
    })

    test("Is actionable if far away from waypoint", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 100, 672, 200, 90, 5000, 3)
        let waypoint = "LAM";

        expect(new Waypoint(map, aeroplane, waypoint).isActionable()).toBeTruthy()
    })

    test("Is not actionable if close to waypoint", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 495, 505, 200, 90, 5000, 3)
        let waypoint = "LAM";

        expect(new Waypoint(map, aeroplane, waypoint).isActionable()).toBeFalsy()
    })
})

