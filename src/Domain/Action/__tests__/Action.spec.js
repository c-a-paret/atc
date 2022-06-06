import {Altitude, Heading, Speed} from "../Action";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../../utils/common";
import {Aeroplane} from "../../Aeroplane/Aeroplane";

describe("Speed", () => {
    test("Creates speed action with decreasing speed", () => {
        let weight = 3;
        let currentSpeed = 300;
        let desiredSpeed = 290;

        const aeroplane = new Aeroplane("BA123", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed(aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(300)
        action.apply()
        expect(aeroplane.speed).toBe(299)
        action.apply()
        expect(aeroplane.speed).toBe(298)
    })

    test("Creates speed action with increasing speed", () => {
        let weight = 3;
        let currentSpeed = 295;
        let desiredSpeed = 300;

        const aeroplane = new Aeroplane("BA123", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed(aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(295)
        action.apply()
        expect(aeroplane.speed).toBe(296)
        action.apply()
        expect(aeroplane.speed).toBe(297)
    })

    test("Is not valid if the target speed is below 0", () => {
        let desiredSpeed = -12;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is not multiple of 10", () => {
        let desiredSpeed = 207;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is same as current speed", () => {
        let desiredSpeed = 200;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is lower than the minimum speed", () => {
        let desiredSpeed = 10;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })
})

describe("Heading", () => {
    test("Turning right within circle", () => {
        let currentHeading = 5;
        let desiredHeading = 10;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(5)
        action.apply()
        expect(aeroplane.heading).toBe(8)
        action.apply()
        expect(aeroplane.heading).toBe(10)
    })

    test("Turning left within circle", () => {
        let currentHeading = 10;
        let desiredHeading = 5;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(10)
        action.apply()
        expect(aeroplane.heading).toBe(7)
        action.apply()
        expect(aeroplane.heading).toBe(5)
    })

    test("Turning left outside circle", () => {
        let currentHeading = 5;
        let desiredHeading = 355;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(5)
        action.apply()
        expect(aeroplane.heading).toBe(2)
        action.apply()
        expect(aeroplane.heading).toBe(359)
        action.apply()
        expect(aeroplane.heading).toBe(356)
        action.apply()
        expect(aeroplane.heading).toBe(355)
    })

    test("Turning right outside circle", () => {
        let currentHeading = 355;
        let desiredHeading = 5;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(355)
        action.apply()
        expect(aeroplane.heading).toBe(358)
        action.apply()
        expect(aeroplane.heading).toBe(1)
        action.apply()
        expect(aeroplane.heading).toBe(4)
        action.apply()
        expect(aeroplane.heading).toBe(5)
    })

    test("Defaults to right turn within circle", () => {
        let currentHeading = 90;
        let desiredHeading = 270;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(93)
        action.apply()
        expect(aeroplane.heading).toBe(96)
        // etc.
    })

    test("Defaults to right turn from 360 to 180", () => {
        let currentHeading = 360;
        let desiredHeading = 180;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(360)
        action.apply()
        expect(aeroplane.heading).toBe(3)
        action.apply()
        expect(aeroplane.heading).toBe(6)
        // etc.
    })

    test("Is not valid if the target heading is same as current heading", () => {
        let desiredAltitude = 243;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target heading is less than zero", () => {
        let desiredAltitude = -1;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target heading is greater than 360", () => {
        let desiredAltitude = 361;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })
})

describe("Altitude", () => {
    test("Creates altitude action with increasing altitude", () => {
        let currentAltitude = 1000;
        let desiredAltitude = 1100;

        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude(aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1000)
        action.apply()
        expect(aeroplane.altitude).toBe(1020)
        action.apply()
        expect(aeroplane.altitude).toBe(1040)
    })

    test("Creates altitude action with decreasing altitude", () => {
        let currentAltitude = 1100;
        let desiredAltitude = 1000;

        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude(aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1100)
        action.apply()
        expect(aeroplane.altitude).toBe(1080)
        action.apply()
        expect(aeroplane.altitude).toBe(1060)
    })

    test("Is not valid if the target altitude is below minimum altitude", () => {
        let desiredAltitude = MIN_ALTITUDE - 1;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is above max altitude", () => {
        let desiredAltitude = MAX_ALTITUDE + 1;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is same as current altitude", () => {
        let currentAltitude = 2000;

        expect(new Altitude({altitude: currentAltitude}, currentAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is not multiple of 100", () => {
        let desiredAltitude = 2116;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })
})

