import {Aeroplane} from "../Aeroplane";

describe("Speed", () => {
    let aeroplane;

    beforeEach(() => {
        aeroplane = new Aeroplane("AB123", 100, 200, 300, 90)
    })

    test("Sets speed action when valid", () => {
        let desiredSpeed = 290;

        aeroplane.setSpeed(desiredSpeed)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].type).toBe("speed")
        expect(aeroplane.actions[0].concurrent).toBeTruthy()
        expect(aeroplane.actions[0].targetValue).toBe(desiredSpeed)
        expect(aeroplane.actions[0].tickValues).toStrictEqual([299, 298, 297, 296, 295, 294, 293, 292, 291, 290])
    })

    test("Does not set speed when same as current speed", () => {
        expect(aeroplane.actions.length).toBe(0)
        aeroplane.setSpeed(300)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set speed when null", () => {
        expect(aeroplane.actions.length).toBe(0)
        aeroplane.setSpeed(null)
        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Heading", () => {
    let aeroplane;

    beforeEach(() => {
        aeroplane = new Aeroplane("AB123", 100, 200, 300, 90)
    })

    test("Sets heading when defined correctly", () => {
        expect(aeroplane.heading).toBe(90)
        aeroplane.setHeading(182)
        expect(aeroplane.heading).toBe(182)
    })

    test("Does not set speed when over 360", () => {
        expect(aeroplane.heading).toBe(90)
        aeroplane.setHeading(361)
        expect(aeroplane.heading).toBe(90)
    })

    test("Does not set speed when below 0", () => {
        expect(aeroplane.heading).toBe(90)
        aeroplane.setHeading(-2)
        expect(aeroplane.heading).toBe(90)
    })

    test("Does not set speed when null", () => {
        expect(aeroplane.heading).toBe(90)
        aeroplane.setHeading(null)
        expect(aeroplane.heading).toBe(90)
    })
})