import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {ARRIVAL} from "../../../config/constants";
import {Altitude} from "../Altitude";
import {GoAround} from "../GoAround";
import {FLYING, GOING_AROUND, LANDING} from "../../Aeroplane/aeroplaneStates";
import {Landing} from "../Landing";
import {testGameMap} from "./actionTest.utils";


describe("Go Around", () => {
    test("Adds relevant actions to aeroplane", () => {
        const correctRunway = '9L';
        const aeroplane = new Aeroplane("BA123", "A321", 350, 500, 140, 90, 1900, 3, ARRIVAL, FLYING, correctRunway)
        expect(aeroplane.state).toBe(FLYING)

        aeroplane.clearForLanding(testGameMap(),  correctRunway)

        expect(aeroplane.state).toBe(LANDING)

        aeroplane.goAround(testGameMap())

        expect(aeroplane.state).toBe(GOING_AROUND)

        aeroplane.applyActions()

        expect(aeroplane.actions.length).toBe(4)
        expect(aeroplane.actions[0].type()).toBe('GoAround')
        expect(aeroplane.actions[1].type()).toBe('Waypoint')
        expect(aeroplane.actions[2].type()).toBe('Speed')
        expect(aeroplane.actions[3].type()).toBe('Altitude')
    })

    test("Completes go around execution when at correct altitude", () => {
        const correctRunway = '9L';

        const aeroplane = new Aeroplane("BA123", "A321", 350, 500, 140, 90, 1900, 3, GOING_AROUND, FLYING, correctRunway)

        expect(aeroplane.state).toBe(FLYING)
        aeroplane.clearForLanding(testGameMap(), correctRunway)
        expect(aeroplane.state).toBe(LANDING)
        aeroplane.goAround(testGameMap())
        expect(aeroplane.state).toBe(GOING_AROUND)

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
        expect(aeroplane.state).toBe(FLYING)

        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2040)
        aeroplane.applyActions()
        expect(aeroplane.altitude).toBe(2060)

        // etc...

    })

    test("Is not valid if the runway aiming for does not exist", () => {
        const aimingForRunway = "16C"
        const goAround = new GoAround(testGameMap(), {}, aimingForRunway);

        expect(goAround.isValid()).toBeFalsy()
    })

    test("Is not valid if the aircraft is not landing", () => {
        const correctRunway = '9L';
        const aeroplane = {isLanding: () => false}

        const goAround = new GoAround(testGameMap(), aeroplane, correctRunway);
        expect(goAround.isValid()).toBeFalsy()
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
