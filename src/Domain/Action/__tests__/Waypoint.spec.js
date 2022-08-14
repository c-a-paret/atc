import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {Waypoint} from "../Waypoint";
import {testGameMap} from "./actionTest.utils";
import {ARRIVAL} from "../../../config/constants";
import {HOLDING_SHORT, READY_TO_TAXI, TAXIING} from "../../Aeroplane/aeroplaneStates";

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

    test("Is not actionable if aeroplane is not flying or going around", () => {
        let waypoint = "LAM";

        const aeroplane1 = new Aeroplane("BA123", "A321", 200, 700, 200, 90, 5000, 3, ARRIVAL, READY_TO_TAXI)
        expect(new Waypoint(map, aeroplane1, waypoint).isActionable()).toBeFalsy()

        const aeroplane2 = new Aeroplane("BA123", "A321", 200, 700, 200, 90, 5000, 3, ARRIVAL, TAXIING)
        expect(new Waypoint(map, aeroplane2, waypoint).isActionable()).toBeFalsy()

        const aeroplane3 = new Aeroplane("BA123", "A321", 200, 700, 200, 90, 5000, 3, ARRIVAL, HOLDING_SHORT)
        expect(new Waypoint(map, aeroplane3, waypoint).isActionable()).toBeFalsy()

    })
})

