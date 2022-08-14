import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {testGameMap} from "./actionTest.utils";
import {FLYING, HOLDING_SHORT, READY_TO_TAXI, TAKING_OFF, TAXIING} from "../../Aeroplane/aeroplaneStates";
import {DEPARTURE, MIN_GROUND_CLEARANCE, TAKEOFF_SPEED} from "../../../config/constants";
import {Takeoff} from "../Takeoff";

describe("Takeoff", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Initialises with correct existing runway", () => {
        const action = new Takeoff(map, {positionDescription: '9L'})

        expect(action.runway.label).toBe('9L')
        expect(action.targetX).toBe(510)
        expect(action.targetY).toBe(500)
    })

    test("Initialises when non-existing runway", () => {
        const action = new Takeoff(map, {positionDescription: '31C'})

        expect(action.runway).toBe(null)
        expect(action.targetX).toBe(undefined)
        expect(action.targetY).toBe(undefined)
    })

    test("Initialises with provided runway", () => {
        const action = new Takeoff(map, {}, '16C')

        expect(action.runway).toBe('16C')
        expect(action.targetX).toBe(undefined)
        expect(action.targetY).toBe(undefined)
    })

    test("Is actionable when not executed", () => {
        const action = new Takeoff(map, {})

        expect(action.isActionable()).toBeTruthy()
    })

    test("Is not actionable when executed", () => {
        const action = new Takeoff(map, {})
        action.executed = true

        expect(action.isActionable()).toBeFalsy()
    })

    test("Is future actionable when ready to taxi", () => {
        const state = READY_TO_TAXI;
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, state)
        const action = new Takeoff(map, aeroplane)
        expect(action.isFutureActionable()).toBeTruthy()
    })

    test("Is future actionable when taxiing", () => {
        const state = TAXIING;
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, state)
        const action = new Takeoff(map, aeroplane)
        expect(action.isFutureActionable()).toBeTruthy()
    })

    test("Is future actionable when holding short", () => {
        const state = HOLDING_SHORT;
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, state)
        const action = new Takeoff(map, aeroplane)
        expect(action.isFutureActionable()).toBeTruthy()
    })

    test("Is future actionable when flying", () => {
        const state = FLYING;
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, state)
        const action = new Takeoff(map, aeroplane)
        expect(action.isFutureActionable()).toBeFalsy()
    })

    test("Increases speed when below takeoff speed", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, TAKING_OFF)
        aeroplane.positionDescription = '9L'
        const action = new Takeoff(map, aeroplane)

        expect(aeroplane.speed).toBe(0)
        action.apply()
        expect(aeroplane.speed).toBe(20)
        action.apply()
        expect(aeroplane.speed).toBe(40)
    })

    test("Maintains speed when takeoff speed achieved", () => {
        const currentSpeed = TAKEOFF_SPEED - 20;
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, currentSpeed, 90, 0, 1, DEPARTURE, TAKING_OFF)
        aeroplane.positionDescription = '9L'
        const action = new Takeoff(map, aeroplane)

        expect(aeroplane.speed).toBe(TAKEOFF_SPEED - 20)
        action.apply()
        expect(aeroplane.speed).toBe(TAKEOFF_SPEED)
        action.apply()
        expect(aeroplane.speed).toBe(TAKEOFF_SPEED)
    })

    test("Stays on the ground when below takeoff speed", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 0, 90, 0, 1, DEPARTURE, TAKING_OFF)
        aeroplane.positionDescription = '9L'
        const action = new Takeoff(map, aeroplane)

        expect(aeroplane.altitude).toBe(0)
        action.apply()
        expect(aeroplane.altitude).toBe(0)
        action.apply()
        expect(aeroplane.altitude).toBe(0)
    })

    test("Increases altitude when above takeoff speed", () => {
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, TAKEOFF_SPEED, 90, 0, 1, DEPARTURE, TAKING_OFF)
        aeroplane.positionDescription = '9L'
        const action = new Takeoff(map, aeroplane)

        expect(aeroplane.altitude).toBe(0)
        action.apply()
        expect(aeroplane.altitude).toBe(60)
        action.apply()
        expect(aeroplane.altitude).toBe(120)
    })

    test("Ends takeoff sequence when at correct speed and altitude", () => {
        const currentSpeed = TAKEOFF_SPEED - 20;
        const currentAltitude = MIN_GROUND_CLEARANCE - 60;

        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, currentSpeed, 90, currentAltitude, 1, DEPARTURE, TAKING_OFF)
        aeroplane.positionDescription = '9L'
        const action = new Takeoff(map, aeroplane)

        expect(aeroplane.speed).toBe(currentSpeed)
        expect(aeroplane.altitude).toBe(currentAltitude)
        expect(aeroplane.state).toBe(TAKING_OFF)
        action.apply()
        expect(aeroplane.speed).toBe(TAKEOFF_SPEED)
        expect(aeroplane.altitude).toBe(MIN_GROUND_CLEARANCE)
        expect(aeroplane.state).toBe(FLYING)
        expect(action.executed).toBeTruthy()
        action.apply()
        expect(aeroplane.speed).toBe(TAKEOFF_SPEED)
        expect(aeroplane.altitude).toBe(MIN_GROUND_CLEARANCE)
        expect(aeroplane.state).toBe(FLYING)
        expect(action.executed).toBeTruthy()
    })
})