import {Altitude, Heading, Speed} from "../Action";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../../utils/common";

describe("Speed", () => {
    test("Creates speed action with decreasing speed", () => {
        let weight = 3;
        let currentSpeed = 300;
        let desiredSpeed = 290;

        const action = new Speed(currentSpeed, desiredSpeed, weight)

        expect(action.type).toBe("speed")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredSpeed)
        expect(action.tickValues).toStrictEqual([290, 291, 292, 293, 294, 295, 296, 297, 298, 299])
    })

    test("Creates speed action with increasing speed", () => {
        let weight = 3;
        let currentSpeed = 295;
        let desiredSpeed = 300;

        const action = new Speed(currentSpeed, desiredSpeed, weight)

        expect(action.type).toBe("speed")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredSpeed)
        expect(action.tickValues).toStrictEqual([300, 299, 298, 297, 296])
    })

    test("Throws an error is the target speed is below 0", () => {
        let currentSpeed = 300;
        let desiredSpeed = -12;

        expect(() => new Speed(currentSpeed, desiredSpeed)).toThrow('Invalid target speed [-12]')
    })
})

describe("Heading", () => {
    test("Creates heading action with increasing heading", () => {
        let currentHeading = 300;
        let desiredHeading = 305;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([305, 303, 301])
    })

    test("Creates heading action with decreasing heading", () => {
        let currentHeading = 305;
        let desiredHeading = 300;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([300, 302, 304])
    })

    test("Turns shortest distance to the right within circle", () => {
        let currentHeading = 300;
        let desiredHeading = 303;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([303, 301])
    })

    test("Turns shortest distance to the right outside circle", () => {
        let currentHeading = 355;
        let desiredHeading = 5;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([5, 3, 1, 360, 358, 356])
    })

    test("Turns shortest distance to the left within circle", () => {
        let currentHeading = 90;
        let desiredHeading = 85;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([85, 87, 89])
    })

    test("Turns shortest distance to the left outside circle", () => {
        let currentHeading = 5;
        let desiredHeading = 355;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues).toStrictEqual([355, 357, 359, 1, 3])
    })

    test("Defaults to right turn", () => {
        let currentHeading = 90;
        let desiredHeading = 270;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues[action.tickValues.length - 1]).toBe(92)
        expect(action.tickValues[action.tickValues.length - 2]).toBe(94)
        expect(action.tickValues[action.tickValues.length - 3]).toBe(96)
    })

    test("Defaults to right turn from 360 to 180", () => {
        let currentHeading = 360;
        let desiredHeading = 180;

        const action = new Heading(currentHeading, desiredHeading)

        expect(action.type).toBe("heading")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredHeading)
        expect(action.tickValues[action.tickValues.length - 1]).toBe(2)
        expect(action.tickValues[action.tickValues.length - 2]).toBe(4)
        expect(action.tickValues[action.tickValues.length - 3]).toBe(6)
    })

    test("Throws an error is the target heading is below 0", () => {
        let currentHeading = 300;
        let desiredHeading = -12;

        expect(() => new Heading(currentHeading, desiredHeading)).toThrow('Invalid target heading [-12]')
    })

    test("Throws an error is the target heading is above 360", () => {
        let currentHeading = 300;
        let desiredHeading = 361;

        expect(() => new Heading(currentHeading, desiredHeading)).toThrow('Invalid target heading [361]')
    })
})

describe("Altitude", () => {
    test("Creates altitude action with increasing altitude", () => {
        let currentAltitude = 1000;
        let desiredAltitude = 1100;

        const action = new Altitude(currentAltitude, desiredAltitude)

        expect(action.type).toBe("altitude")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredAltitude)
        expect(action.tickValues).toStrictEqual([1100, 1080, 1060, 1040, 1020])
    })

    test("Creates altitude action with decreasing altitude", () => {
        let currentAltitude = 1100;
        let desiredAltitude = 1000;

        const action = new Altitude(currentAltitude, desiredAltitude)

        expect(action.type).toBe("altitude")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredAltitude)
        expect(action.tickValues).toStrictEqual([1000, 1020, 1040, 1060, 1080])
    })

    test("Throws an error is the target altitude is below minimum altitude", () => {
        let currentAltitude = 2000;
        let desiredAltitude = MIN_ALTITUDE - 1;

        expect(() => new Altitude(currentAltitude, desiredAltitude)).toThrow(`Invalid target altitude [${desiredAltitude}]`)
    })

    test("Throws an error is the target altitude is above max altitude", () => {
        let currentAltitude = 2000;
        let desiredAltitude = MAX_ALTITUDE + 1;

        expect(() => new Altitude(currentAltitude, desiredAltitude)).toThrow(`Invalid target altitude [${desiredAltitude}]`)
    })
})

