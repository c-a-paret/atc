import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {HoldingPattern} from "../HoldingPattern";
import {testGameMap} from "./actionTest.utils";
import {FLYING, HOLDING_PATTERN, LANDING} from "../../Aeroplane/aeroplaneStates";
import {ARRIVAL} from "../../../config/constants";

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

    test("Is valid when flying", () => {
        const holdDirection = 1;
        const speed = 190;
        const heading = 358;
        const weight = 1;
        const x = 500;
        const y = 500;

        const aeroplane = new Aeroplane("123", "", x, y, speed, heading, 3000, weight, ARRIVAL, FLYING)
        const hold = new HoldingPattern(map, aeroplane, holdDirection);
        expect(hold.isValid()).toBeTruthy()
    })

    test("Is valid when in holding pattern", () => {
        const holdDirection = 1;
        const speed = 190;
        const heading = 358;
        const weight = 1;
        const x = 500;
        const y = 500;

        const aeroplane = new Aeroplane("123", "", x, y, speed, heading, 3000, weight, ARRIVAL, HOLDING_PATTERN)
        const hold = new HoldingPattern(map, aeroplane, holdDirection);
        expect(hold.isValid()).toBeTruthy()
    })


    test("Is not valid when landing", () => {
        const holdDirection = 1;
        const speed = 190;
        const heading = 358;
        const weight = 1;
        const x = 500;
        const y = 500;

        const aeroplane = new Aeroplane("123", "", x, y, speed, heading, 3000, weight, ARRIVAL, LANDING)
        const hold = new HoldingPattern(map, aeroplane, holdDirection);
        expect(hold.isValid()).toBeFalsy()
    })


    test("Is only actionable when flying", () => {
        const hold = new HoldingPattern(map, {is: () => true}, 1);
        expect(hold.isActionable()).toBeTruthy()
    })
})

