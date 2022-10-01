import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {wouldEndUpTurningBeyondTarget} from "../Action";

describe("Would end up turning beyond target", () => {
    describe('Turning shortest distance', () => {
        test("When would be beyond target", () => {
            const targetHeading = 91
            const currentHeading = 90
            const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, currentHeading, 4000, 3)

            const result = wouldEndUpTurningBeyondTarget(aeroplane, targetHeading, currentHeading)

            expect(result).toBeTruthy()
        })

        test("When would not be beyond target", () => {
            const targetHeading = 100
            const currentHeading = 90
            const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, currentHeading, 4000, 3)

            const result = wouldEndUpTurningBeyondTarget(aeroplane, targetHeading, currentHeading)

            expect(result).toBeFalsy()
        })
    })
})
