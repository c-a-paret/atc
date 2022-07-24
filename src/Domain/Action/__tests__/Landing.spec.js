import {Aeroplane} from "../../Aeroplane/Aeroplane";
import {GameMap} from "../../GameMap/GameMap";
import {Speed} from "../Speed";
import {Waypoint} from "../Waypoint";
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
                    }
                }
            }], waypoints: [{type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},]
        }
    })
}

describe("Landing", () => {
    let map;
    beforeEach(() => {
        map = testGameMap()
    })

    test("Applies landing sequence actions", () => {
        const correctRunway = "27R";
        const speed = 190;
        const heading = 272;
        const altitude = 2800;
        const x = 710;
        const y = 555;

        const aeroplane = new Aeroplane("BA123", "A321", x, y, speed, heading, altitude, 3)

        expect(aeroplane.actions.length).toBe(0)
        const landing = new Landing(map, aeroplane, correctRunway);
        aeroplane.addAction(landing)

        expect(aeroplane.actions.length).toBe(1)

        aeroplane.applyActions()

        expect(aeroplane.actions.length).toBe(3)
        expect(aeroplane.actions[0].type()).toBe("Landing")
        expect(aeroplane.actions[1].type()).toBe("Speed")
        expect(aeroplane.actions[2].type()).toBe("Waypoint")

        expect(aeroplane.actions[0].executed).toBeFalsy()
    })

    test("Is valid if aeroplane is in correct landing configuration", () => {
        const correctRunway = "27R";
        const speed = 190;
        const heading = 272;
        const altitude = 2800;
        const x = 710;
        const y = 555;

        const landing = new Landing(map, {
            speed: speed, heading: heading, altitude: altitude, x: x, y: y
        }, correctRunway);
        expect(landing.isValid()).toBeTruthy()
    })

    test("Is not valid if the runway does not exist", () => {
        let incorrectRunway = "66C";

        const landing = new Landing(map, {}, incorrectRunway);
        expect(landing.isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not within maximum X range of inner marker", () => {
        expect(new Landing(map, {x: 549, y: 450, heading: 90}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not outside minimum X range of inner marker", () => {
        expect(new Landing(map, {x: 601, y: 450, heading: 90}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is to the other side of the runway", () => {
        expect(new Landing(map, {x: 800, y: 450, heading: 90}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not within negative Y range of inner marker", () => {
        expect(new Landing(map, {x: 575, y: 429, heading: 90}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not within positive Y range of inner marker", () => {
        expect(new Landing(map, {x: 575, y: 471, heading: 90}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not within minimum angle of runway heading", () => {
        expect(new Landing(map, {x: 575, y: 450, heading: 101}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not below maximum altitude for runway altitude", () => {
        expect(new Landing(map, {x: 575, y: 450, heading: 90, altitude: 3001}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not above minimum altitude for runway altitude", () => {
        expect(new Landing(map, {x: 575, y: 450, heading: 90, altitude: 999}, "9L").isValid()).toBeFalsy()
    })

    test("Is not valid if the aeroplane is not below minimum approach speed", () => {
        expect(new Landing(map, {x: 575, y: 450, heading: 90, altitude: 2000, speed: 201}, "9L").isValid()).toBeFalsy()
    })
})

