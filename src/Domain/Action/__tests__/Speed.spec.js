import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {Speed} from "../Speed";

describe("Speed", () => {
    test("Creates speed action with decreasing speed", () => {
        let weight = 3;
        let currentSpeed = 300;
        let desiredSpeed = 290;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed({}, aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(300)
        action.apply()
        expect(aeroplane.speed).toBe(299)
        action.apply()
        expect(aeroplane.speed).toBe(298)
    })

    test("Creates speed action with increasing speed", () => {
        let weight = 3;
        let currentSpeed = 295;
        let desiredSpeed = 304;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed({}, aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(295)
        action.apply()
        expect(aeroplane.speed).toBe(296)
        action.apply()
        expect(aeroplane.speed).toBe(297)
    })

    test("Is not valid if the target speed is same as current speed", () => {
        let desiredSpeed = 200;

        const aeroplane = new Aeroplane("BA123", "A321", 575, 429, 200, 90, 2800, 3)

        const expected = {
            "errors": [],
            "isValid": false,
            "targetValue": 200,
            "warnings": [
                "Speed already set"
            ]
        }

        expect(new Speed({}, aeroplane, desiredSpeed).validate()).toStrictEqual(expected)
    })

    test("Is not valid if the target speed is lower than the minimum speed", () => {
        let desiredSpeed = 10;

        const aeroplane = new Aeroplane("BA123", "A321", 575, 429, 200, 90, 2800, 3)

        const expected = {
            "errors": [
                "Cannot set speed lower than 120"
            ],
            "isValid": false,
            "targetValue": 10,
            "warnings": []
        }

        expect(new Speed({}, aeroplane, desiredSpeed).validate()).toStrictEqual(expected)
    })
})