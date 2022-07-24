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

    test("Is not valid if the target altitude is below minimum altitude", () => {
        let desiredAltitude = MIN_ALTITUDE - 1;

        expect(new Altitude({}, {altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is above max altitude", () => {
        let desiredAltitude = MAX_ALTITUDE + 1;

        expect(new Altitude({}, {altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is same as current altitude", () => {
        let currentAltitude = 2000;

        expect(new Altitude({}, {altitude: currentAltitude}, currentAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is not multiple of 20", () => {
        let desiredAltitude = 2116;

        expect(new Altitude({}, {altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })
})
