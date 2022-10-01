import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {Speed} from "../Speed";
import {Waypoint} from "../Waypoint";
import {Landing} from "../Landing";
import {testGameMap} from "./actionTest.utils";


describe("Landing", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Applies landing sequence actions", () => {
        const correctRunway = "27R";
        const speed = 190;
        const heading = 272;
        const altitude = 2800;
        const x = 710;
        const y = 555;

        const aeroplane = new Aeroplane("BA123", "A321", x, y, speed, heading, altitude, 3)

        expect(aeroplane.actions.length).toBe(0)
        aeroplane.clearForLanding(testGameMap(), correctRunway)

        expect(aeroplane.actions.length).toBe(1)

        aeroplane.applyActions()

        expect(aeroplane.actions.length).toBe(3)
        expect(aeroplane.actions[0].type()).toBe("Landing")
        expect(aeroplane.actions[1].type()).toBe("Speed")
        expect(aeroplane.actions[2].type()).toBe("Waypoint")

        expect(aeroplane.actions[0].executed).toBeFalsy()
    })

    test("Is valid if aeroplane is in correct landing configuration", () => {
        const correctRunway = "27R";
        const speed = 190;
        const heading = 272;
        const altitude = 2800;
        const x = 710;
        const y = 555;

        const aeroplane = new Aeroplane("BA123", "A321", x, y, speed, heading, altitude, 3)

        const landing = new Landing(map, aeroplane, correctRunway);

        const expected = {
            "errors": [],
            "isValid": true,
            "targetValue": "27R",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)

    })

    test("Is not valid if the runway does not exist", () => {
        let incorrectRunway = "66C";

        const aeroplane = new Aeroplane("BA123", "A321", 710, 555, 190, 272, 2800, 3)

        const landing = new Landing(map, aeroplane, incorrectRunway);

        const expected = {
            "errors": [
                "Runway 66C does not exist",
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "66C",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not within maximum X range of inner marker", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 549, 450, 190, 90, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not outside minimum X range of inner marker", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 601, 450, 190, 90, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is to the other side of the runway", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 800, 450, 190, 90, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not within negative Y range of inner marker", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 429, 190, 90, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not within positive Y range of inner marker", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 471, 190, 90, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not within minimum angle of runway heading", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 450, 190, 101, 2800, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not below maximum altitude for runway altitude", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 450, 190, 90, 3001, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not above minimum altitude for runway altitude", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 450, 190, 90, 999, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aeroplane is not below minimum approach speed", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 450, 201, 90, 2000, 3)

        const landing = new Landing(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Not correctly configured for landing",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(landing.validate()).toStrictEqual(expected)
    })
})

