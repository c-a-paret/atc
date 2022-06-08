import {Aeroplane} from "../Aeroplane";
import {Speed} from "../../Action/Action";
import {MIN_SPEED} from "../../../utils/common";

describe("Speed", () => {
    let aeroplane;

    beforeEach(() => {
        aeroplane = new Aeroplane("AB123", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets speed action when valid", () => {
        let desiredSpeed = 290;

        aeroplane.setSpeed(desiredSpeed)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetValue).toBe(desiredSpeed)
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
        aeroplane = new Aeroplane("AB123", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets heading action when valid", () => {
        let desiredHeading = 100;

        aeroplane.setHeading(desiredHeading)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetValue).toBe(desiredHeading)
    })

    test("Does not set heading when over 360", () => {
        let desiredHeading = 361;
        aeroplane.setHeading(desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set speed when below 0", () => {
        let desiredHeading = 0;
        aeroplane.setHeading(desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set heading when null", () => {
        let desiredHeading = null;
        aeroplane.setHeading(desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Apply Actions", () => {

    describe("When no actions available", () => {
        let startX = 100;
        let startY = 100;
        let aeroplane;

        beforeEach(() => {
            aeroplane = new Aeroplane("AB123", startX, startY, 150, 0, 3000, 3)
        })

        test("Change in position responsive at minimum speed and 1 degree heading", () => {
            aeroplane = new Aeroplane("AB123", 100, 100, MIN_SPEED, 91, 3000, 3)

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(100)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.5)
            expect(aeroplane.y).toBe(100.03)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(103)
            expect(aeroplane.y).toBe(100.06)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(104.5)
            expect(aeroplane.y).toBe(100.09)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(106)
            expect(aeroplane.y).toBe(100.12)
        })

        test("Continues north if no actions available", () => {
            let north = 0
            aeroplane.heading = north

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(97.75)
        })

        test("Continues east if no actions available", () => {
            let east = 90
            aeroplane.heading = east

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(102.25)
            expect(aeroplane.y).toBe(100)
        })

        test("Continues south if no actions available", () => {
            let south = 180
            aeroplane.heading = south

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(102.25)
        })

        test("Continues west if no actions available", () => {
            let west = 270
            aeroplane.heading = west

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(97.75)
            expect(aeroplane.y).toBe(100)
        })

        test("Continues north east if no actions available", () => {
            let northEast = 45
            aeroplane.heading = northEast

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.59)
            expect(aeroplane.y).toBe(98.41)
        })

        test("Continues south east if no actions available", () => {
            let southEast = 135
            aeroplane.heading = southEast

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.59)
            expect(aeroplane.y).toBe(101.59)
        })

        test("Continues south west if no actions available", () => {
            let southWest = 225
            aeroplane.heading = southWest

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(98.41)
            expect(aeroplane.y).toBe(101.59)
        })

        test("Continues north west if no actions available", () => {
            let northWest = 315
            aeroplane.heading = northWest

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(98.41)
            expect(aeroplane.y).toBe(98.41)
        })
    })

    describe("When actions available", () => {
        test("Applies all actions and moves forward", () => {
            const aeroplane = new Aeroplane("AB123", 50, 100, 150, 90, 5000, 3)

            aeroplane.setSpeed(160)
            aeroplane.setHeading(100)
            aeroplane.setAltitude(10000)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(52.27)
            expect(aeroplane.y).toBe(100.08)
            expect(aeroplane.heading).toBe(92)
            expect(aeroplane.altitude).toBe(5020)
        })
    })
})

describe("Sequential Actions", () => {

    describe("Overwrites existing action when one same action exits", () => {
        let aeroplane;

        beforeEach(() => {
            aeroplane = new Aeroplane("AB123", 100, 100, 150, 0, 3000, 3)
        })

        test("Speed", () => {
            aeroplane.setSpeed(160)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(160)

            aeroplane.setSpeed(170)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(170)
        })

        test("Heading", () => {
            aeroplane.setHeading(90)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(90)

            aeroplane.setHeading(180)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(180)
        })

        test("Altitude", () => {
            aeroplane.setAltitude(5000)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(5000)

            aeroplane.setAltitude(10000)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(10000)
        })
    })

    describe("Overwrites existing action when multiple different actions exist", () => {
        let aeroplane;

        beforeEach(() => {
            aeroplane = new Aeroplane("AB123", 100, 100, 150, 0, 3000, 3)
        })

        test("Speed", () => {
            aeroplane.setSpeed(160)
            aeroplane.setHeading(90)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(90)

            aeroplane.setSpeed(170)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(170)
            expect(aeroplane.actions[1].targetValue).toBe(90)
        })

        test("Heading", () => {
            aeroplane.setSpeed(160)
            aeroplane.setHeading(90)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(90)

            aeroplane.setHeading(180)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(180)
        })

        test("Altitude", () => {
            aeroplane.setSpeed(160)
            aeroplane.setAltitude(5000)
            aeroplane.setHeading(90)
            expect(aeroplane.actions.length).toBe(3)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(5000)
            expect(aeroplane.actions[2].targetValue).toBe(90)

            aeroplane.setAltitude(12000)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(12000)
            expect(aeroplane.actions[2].targetValue).toBe(90)
        })

    })

    describe("Landing action clears all other actions", () => {
        const aeroplane = new Aeroplane("AB123", 550, 450, 150, 91, 3000, 3)

        aeroplane.setSpeed(160)
        aeroplane.setAltitude(2000)
        aeroplane.setHeading(90)
        expect(aeroplane.actions.length).toBe(3)
        expect(aeroplane.actions[0].targetValue).toBe(160)
        expect(aeroplane.actions[1].targetValue).toBe(2000)
        expect(aeroplane.actions[2].targetValue).toBe(90)

        aeroplane.setLanding("9L")
        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].type()).toBe("Landing")
    })

})

describe("Outside boundaries", () => {

    describe("Determines when outside boundaries", () => {
        let aeroplane;
        let mapBoundaries;

        beforeEach(() => {
            mapBoundaries = {
                minX: 0,
                maxX: 100,
                minY: 0,
                maxY: 100,
            }
        })

        test("Too far north", () => {
            const x = 50
            const y = -1
            aeroplane = new Aeroplane("AB123", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far east", () => {
            const x = 101
            const y = 50
            aeroplane = new Aeroplane("AB123", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far south", () => {
            const x = 50
            const y = 101
            aeroplane = new Aeroplane("AB123", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far west", () => {
            const x = -1
            const y = 50
            aeroplane = new Aeroplane("AB123", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })
    })
})

