import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {Waypoint} from "../Waypoint";
import {wouldEndUpTurningBeyondTarget} from "../Action";

describe("Would End Up Turning Beyond Target", () => {
    test("When beyond target", () => {
        const targetHeading = 91
        const currentHeading = 90
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, currentHeading, 4000, 3)

        const result = wouldEndUpTurningBeyondTarget(aeroplane, targetHeading, currentHeading)

        expect(result).toBeTruthy()
    })

    test("When not beyond target", () => {
        const targetHeading = 100
        const currentHeading = 90
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, currentHeading, 4000, 3)

        const result = wouldEndUpTurningBeyondTarget(aeroplane, targetHeading, currentHeading)

        expect(result).toBeFalsy()
    })
})
