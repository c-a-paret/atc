import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {ARRIVAL} from "../../../config/constants";
import {Altitude} from "../Altitude";
import {GoAround} from "../GoAround";
import {FLYING, GOING_AROUND, LANDING} from "../../Aeroplane/aeroplaneStates";
import {testGameMap} from "./actionTest.utils";
import {Flying} from "../../Aeroplane/states/Flying";


describe("Go Around", () => {
    test("Adds relevant actions to aeroplane", () => {
        const correctRunway = '9L';
        const aeroplane = new Aeroplane("BA123", "A321", 350, 500, 140, 90, 1900, 3, ARRIVAL, new Flying(), correctRunway)
        expect(aeroplane.state.name).toBe(FLYING)

        aeroplane.clearForLanding(testGameMap(), correctRunway)

        expect(aeroplane.state.name).toBe(LANDING)

        aeroplane.goAround(testGameMap())

        expect(aeroplane.state.name).toBe(GOING_AROUND)

        aeroplane.applyActions()

        expect(aeroplane.actions.length).toBe(4)
        expect(aeroplane.actions[0].type()).toBe('GoAround')
        expect(aeroplane.actions[1].type()).toBe('Waypoint')
        expect(aeroplane.actions[2].type()).toBe('Speed')
        expect(aeroplane.actions[3].type()).toBe('Altitude')
    })

    test("Completes go around execution when at correct altitude", () => {
        const correctRunway = '9L';

        const aeroplane = new Aeroplane("BA123", "A321", 350, 500, 140, 90, 1900, 3, ARRIVAL, new Flying(), correctRunway)

        expect(aeroplane.state.name).toBe(FLYING)
        aeroplane.clearForLanding(testGameMap(), correctRunway)
        expect(aeroplane.state.name).toBe(LANDING)
        aeroplane.goAround(testGameMap())
        expect(aeroplane.state.name).toBe(GOING_AROUND)

        aeroplane.applyActions()
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(1920)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(1940)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(1960)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(1980)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2000)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2020)

        // Transition to flying when 2000ft achieved
        expect(aeroplane.state.name).toBe(FLYING)

        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2040)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2060)

        // etc...

    })

    test("Is not valid if the runway aiming for does not exist", () => {
        const aimingForRunway = "16C"
        const aeroplane = {isLanding: () => true}

        const goAround = new GoAround(testGameMap(), aeroplane, aimingForRunway);

        const expected = {
            "errors": [
                "Cannot go around",
            ],
            "isValid": false,
            "targetValue": null,
            "warnings": [],
        }

        expect(goAround.validate()).toStrictEqual(expected)
    })

    test("Is not valid if the aircraft is not landing", () => {
        const correctRunway = '9L';
        const aeroplane = {isLanding: () => false}

        const goAround = new GoAround(testGameMap(), aeroplane, correctRunway);

        const expected = {
            "errors": [
                "Cannot go around, aircraft not landing",
            ],
            "isValid": false,
            "targetValue": null,
            "warnings": [],
        }

        expect(goAround.validate()).toStrictEqual(expected)
    })

    test("Is actionable when targets not added or not executed", () => {
        const goAround = new GoAround(testGameMap(), {}, '9R');
        expect(goAround.isActionable()).toBeTruthy()
    })

    test("Is not future actionable", () => {
        const goAround = new GoAround(testGameMap(), {}, '9R');
        expect(goAround.isFutureActionable()).toBeFalsy()
    })
})
