import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {TaxiToRunway} from "../TaxiToRunway";
import {testGameMap} from "./actionTest.utils";
import {HOLDING_SHORT, TAXIING} from "../../Aeroplane/aeroplaneStates";
import {DEPARTURE} from "../../../config/constants";
import {Taxiing} from "../../Aeroplane/states/Taxiing";
import {ReadyToTaxi} from "../../Aeroplane/states/ReadyToTaxi";
import {HoldingShort} from "../../Aeroplane/states/HoldingShort";

describe("Taxi to runway", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Is actionable when some taxi time remaining", () => {
        const action = new TaxiToRunway(map, {}, "9L")
        action.taxiTime = 5

        expect(action.isActionable()).toBeTruthy()
    })

    test("Is not actionable when no taxi time remaining", () => {
        const action = new TaxiToRunway(map, {}, "9L")
        action.taxiTime = 0

        expect(action.isActionable()).toBeFalsy()
    })

    test("Updates aeroplane appropriately when taxiing complete", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new Taxiing())

        const action = new TaxiToRunway(map, aeroplane, "9L")
        action.taxiTime = 1

        expect(aeroplane.x).toBe(1)
        expect(aeroplane.y).toBe(1)
        expect(aeroplane.state.name).toBe(TAXIING)
        expect(aeroplane.heading).toBe(0)
        expect(aeroplane.positionDescription).toBe('')

        action.apply()

        expect(aeroplane.x).toBe(510)
        expect(aeroplane.y).toBe(500)
        expect(aeroplane.state.name).toBe(HOLDING_SHORT)
        expect(aeroplane.heading).toBe(90)
        expect(aeroplane.positionDescription).toBe('9L')
    })

    test("Is future actionable when ready or taxiing", () => {
        const aeroplane1 = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new ReadyToTaxi())
        const action1 = new TaxiToRunway(map, aeroplane1, "9L")
        expect(action1.isFutureActionable()).toBeTruthy()

        const aeroplane2 = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new Taxiing())
        const action2 = new TaxiToRunway(map, aeroplane2, "9L")
        expect(action2.isFutureActionable()).toBeTruthy()
    })

    test("Is valid when ready to taxi", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new ReadyToTaxi())
        const action = new TaxiToRunway(map, aeroplane, "9L")

        const expected = {
            "errors": [],
            "isValid": true,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(action.validate()).toStrictEqual(expected)
    })

    test("Is valid when taxiing", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new Taxiing())
        const action = new TaxiToRunway(map, aeroplane, "9L")

        const expected = {
            "errors": [],
            "isValid": true,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(action.validate()).toStrictEqual(expected)
    })

    test("Is valid when holding short", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 1, 1, 0, 0, 0, 3, DEPARTURE, new HoldingShort())
        const action = new TaxiToRunway(map, aeroplane, "9L")

        const expected = {
            "errors": [],
            "isValid": true,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(action.validate()).toStrictEqual(expected)
    })

    test("Is not valid when flying", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 575, 450, 190, 90, 3001, 3)
        const action = new TaxiToRunway(map, aeroplane, "9L")

        const expected = {
            "errors": [
                "Cannot accept taxi command right now",
            ],
            "isValid": false,
            "targetValue": "9L",
            "warnings": [],
        }

        expect(action.validate()).toStrictEqual(expected)
    })
})
