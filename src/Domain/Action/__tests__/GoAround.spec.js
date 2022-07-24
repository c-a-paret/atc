import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {ARRIVAL} from "../../../config/constants";
import {Altitude} from "../Altitude";
import {GameMap} from "../../GameMap/GameMap";
import {GoAround} from "../GoAround";
import {FLYING} from "../../Aeroplane/aeroplaneStates";
import {Landing} from "../Landing";

const testGameMap = () => {
    return new GameMap({
        features: {
            runways: [{
                start: {
                    label: "9L", heading: 90, altitude: 0, landingZone: {
                        x: 510, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 500,
                        }, outerMarker: {
                            x: 280, y: 500,
                        }
                    },
                    goAround: {
                        targetWaypoint: "CHT",
                        targetSpeed: 200,
                        targetAltitude: 4000,
                    }
                }, end: {
                    label: "27R", heading: 270, altitude: 0, landingZone: {
                        x: 490, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 550,
                        }, outerMarker: {
                            x: 720, y: 550,
                        }
                    },
                    goAround: {
                        targetWaypoint: "LAM",
                        targetSpeed: 220,
                        targetAltitude: 5000,
                    }
                }
            }], waypoints: [{type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},]
        }
    })
}


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
