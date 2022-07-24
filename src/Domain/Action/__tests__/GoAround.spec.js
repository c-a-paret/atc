import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {ARRIVAL} from "../../../config/constants";
import {Altitude} from "../Altitude";
import {GoAround} from "../GoAround";
import {FLYING} from "../../Aeroplane/aeroplaneStates";
import {Landing} from "../Landing";
import {testGameMap} from "./actionTest.utils";


describe("Go Around", () => {
    test("Adds relevant actions to aeroplane", () => {
        const correctRunway = '9L';
        const aeroplane = new Aeroplane("BA123", "A321", 500, 500, 200, 90, 1900, 3, ARRIVAL, FLYING, correctRunway)

        const landing = new Landing(testGameMap(), aeroplane, correctRunway);
        landing.isValid()
        aeroplane.addAction(landing)

        const goAround = new GoAround(testGameMap(), aeroplane, correctRunway);
        goAround.isValid()
        aeroplane.addAction(goAround)
        goAround.apply()

        expect(goAround.targetsAdded).toBeTruthy()

        expect(aeroplane.actions.length).toBe(4)
        expect(aeroplane.actions[0].type()).toBe('GoAround')
        expect(aeroplane.actions[1].type()).toBe('Waypoint')
        expect(aeroplane.actions[2].type()).toBe('Speed')
        expect(aeroplane.actions[3].type()).toBe('Altitude')
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
