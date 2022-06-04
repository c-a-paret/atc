import {Speed} from "../Action";

describe("Speed", () => {
    test("Creates speed action with decreasing speed", () => {
        let currentSpeed = 300;
        let desiredSpeed = 290;

        const action = new Speed(currentSpeed, desiredSpeed)

        expect(action.type).toBe("speed")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredSpeed)
        expect(action.tickValues).toStrictEqual([299, 298, 297, 296, 295, 294, 293, 292, 291, 290])
    })

    test("Creates speed action with increasing speed", () => {
        let currentSpeed = 295;
        let desiredSpeed = 300;

        const action = new Speed(currentSpeed, desiredSpeed)

        expect(action.type).toBe("speed")
        expect(action.concurrent).toBe(true)
        expect(action.targetValue).toBe(desiredSpeed)
        expect(action.tickValues).toStrictEqual([296, 297, 298, 299, 300])
    })

    test("Throws an error is the target speed is below 0", () => {
        let currentSpeed = 300;
        let desiredSpeed = -12;

        expect(() => new Speed(currentSpeed, desiredSpeed)).toThrow('Invalid target speed [-12]')
    })
})
