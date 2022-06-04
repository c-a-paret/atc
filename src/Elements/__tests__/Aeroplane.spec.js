import {Aeroplane} from "../Aeroplane";

describe("Speed", () => {
    let aeroplane;

    beforeEach(() => {
        aeroplane = new Aeroplane("AB123", 100, 200, 300, 90)
    })

    test("Sets speed when defined", () => {
        expect(aeroplane.speed).toBe(300)
        aeroplane.setSpeed(240)
        expect(aeroplane.speed).toBe(240)
    })

    test("Does not set speed when null", () => {
        expect(aeroplane.speed).toBe(300)
        aeroplane.setSpeed(null)
        expect(aeroplane.speed).toBe(300)
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