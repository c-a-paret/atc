import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {HoldingPattern} from "../HoldingPattern";
import {testGameMap} from "./actionTest.utils";

describe("Holding Pattern", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Turns aeroplane to correct heading when turning left across 0", () => {
        const holdDirection = -1;
        const speed = 190;
        const heading = 3;
        const weight = 1;
        const x = 500;
        const y = 500;

        const aeroplane = new Aeroplane("123", "", x, y, speed, heading, 3000, weight)
        const hold = new HoldingPattern(map, aeroplane, holdDirection);

        expect(aeroplane.heading).toBe(3)

        hold.apply()

        expect(aeroplane.heading).toBeLessThanOrEqual(360)
    })

    test("Turns aeroplane to correct heading when turning right across 0", () => {
        const holdDirection = 1;
        const speed = 190;
        const heading = 358;
        const weight = 1;
        const x = 500;
        const y = 500;

        const aeroplane = new Aeroplane("123", "", x, y, speed, heading, 3000, weight)
        const hold = new HoldingPattern(map, aeroplane, holdDirection);

        expect(aeroplane.heading).toBe(358)

        hold.apply()

        expect(aeroplane.heading).toBeGreaterThanOrEqual(0)
    })

    test("Is always valid", () => {
        const hold = new HoldingPattern(map, {}, "anything");
        expect(hold.isValid()).toBeTruthy()
    })

    test("Is only actionable when flying", () => {
        const hold = new HoldingPattern(map, {is: () => true}, 1);
        expect(hold.isActionable()).toBeTruthy()
    })
})

