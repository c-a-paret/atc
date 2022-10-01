import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../../config/constants";
import {Altitude} from "../Altitude";

describe("Altitude", () => {
    test("Creates altitude action with increasing altitude", () => {
        let currentAltitude = 1000;
        let desiredAltitude = 1100;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude({}, aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1000)
        action.apply()
        expect(aeroplane.altitude).toBe(1020)
        action.apply()
        expect(aeroplane.altitude).toBe(1040)
    })

    test("Creates altitude action with decreasing altitude", () => {
        let currentAltitude = 1100;
        let desiredAltitude = 1020;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude({}, aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1100)
        action.apply()
        expect(aeroplane.altitude).toBe(1080)
        action.apply()
        expect(aeroplane.altitude).toBe(1060)
    })

    test("Descends faster at higher altitude", () => {
        let currentAltitude = 15000;
        let desiredAltitude = 12000;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude({}, aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(currentAltitude)
        action.apply()
        expect(aeroplane.altitude).toBe(14920)
        action.apply()
        expect(aeroplane.altitude).toBe(14840)
    })

    test("Descends slower at medium altitude", () => {
        let currentAltitude = 10000;
        let desiredAltitude = 5000;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude({}, aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(currentAltitude)
        action.apply()
        expect(aeroplane.altitude).toBe(9950)
        action.apply()
        expect(aeroplane.altitude).toBe(9900)
    })

    test("Descends slowly at low altitude", () => {
        let currentAltitude = 5000;
        let desiredAltitude = 3000;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude({}, aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(currentAltitude)
        action.apply()
        expect(aeroplane.altitude).toBe(4980)
        action.apply()
        expect(aeroplane.altitude).toBe(4960)
    })

    test("Is not valid if the target altitude is below minimum altitude", () => {
        let desiredAltitude = MIN_ALTITUDE - 20;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 3000, 3)

        const expected = {
            "errors": [
                "Cannot set altitude lower than 1000"
            ],
            "isValid": false,
            "targetValue": 980,
            "warnings": [],
        }

        expect(new Altitude({}, aeroplane, desiredAltitude).validate()).toStrictEqual(expected)
    })

    test("Is not valid if the target altitude is above max altitude", () => {
        let desiredAltitude = MAX_ALTITUDE + 20;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 3000, 3)

        const expected = {
            "errors": [
                "Cannot set altitude higher than 40000",
            ],
            "isValid": false,
            "targetValue": 40020,
            "warnings": [],
        }

        expect(new Altitude({}, aeroplane, desiredAltitude).validate()).toStrictEqual(expected)
    })

    test("Is not valid if the target altitude is same as current altitude", () => {
        let currentAltitude = 2000;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, currentAltitude, 3)

        const expected = {
            "errors": [],
            "isValid": false,
            "targetValue": 2000,
            "warnings": [
                "Altitude already set"
            ],
        }

        expect(new Altitude({}, aeroplane, currentAltitude).validate()).toStrictEqual(expected)
    })

    test("Is not valid if the target altitude is not multiple of 20", () => {
        let desiredAltitude = 2116;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 3000, 3)

        const expected = {
            "errors": [
                "Altitude must be in increments of 20",
            ],
            "isValid": false,
            "targetValue": 2116,
            "warnings": [],
        }

        expect(new Altitude({}, aeroplane, desiredAltitude).validate()).toStrictEqual(expected)
    })
})
