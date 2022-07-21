import {Aeroplane} from "../Aeroplane";
import {Altitude, Heading, HoldingPattern, Landing, Speed, Waypoint} from "../../Action/Action";
import {GameMap} from "../../GameMap/GameMap";
import {MIN_SPEED} from "../../../config/constants";


const testGameMap = () => {
    return new GameMap({
        features: {
            runways: [{
                start: {
                    label: "9L",
                    heading: 90,
                    altitude: 0,
                    landingZone: {
                        x: 510,
                        y: 500,
                    },
                    ILS: {
                        innerMarker: {
                            x: 500,
                            y: 500,
                        },
                        outerMarker: {
                            x: 280,
                            y: 500,
                        }
                    }
                },
                end: {
                    label: "27R",
                    heading: 270,
                    altitude: 0,
                    landingZone: {
                        x: 490,
                        y: 500,
                    },
                    ILS: {
                        innerMarker: {
                            x: 500,
                            y: 550,
                        },
                        outerMarker: {
                            x: 720,
                            y: 550,
                        }
                    }
                }
            }],
            waypoints: [
                {type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},
                {type: "VOR", id: "CPT", name: "Compton", x: 600, y: 600},
            ]
        }
    })
}


describe("Set Speed", () => {
    let aeroplane;
    let map;

    beforeEach(() => {
        map = testGameMap()
        aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets speed action when valid", () => {
        let desiredSpeed = 290;

        aeroplane.setSpeed(map, desiredSpeed)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetValue).toBe(desiredSpeed)
    })

    test("Does not set speed when same as current speed", () => {
        expect(aeroplane.actions.length).toBe(0)
        aeroplane.setSpeed(map, 300)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set speed when null", () => {
        expect(aeroplane.actions.length).toBe(0)
        aeroplane.setSpeed(map, null)
        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Set Heading", () => {
    let aeroplane;
    let map;
    beforeEach(() => {
        map = testGameMap()
        aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets heading action when valid", () => {
        let desiredHeading = 100;

        aeroplane.setHeading(map, desiredHeading)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetValue).toBe(desiredHeading)
    })

    test("Does not set heading when over 360", () => {
        let desiredHeading = 361;
        aeroplane.setHeading(map, desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set speed when below 0", () => {
        let desiredHeading = 0;
        aeroplane.setHeading(map, desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })

    test("Does not set heading when null", () => {
        let desiredHeading = null;
        aeroplane.setHeading(map, desiredHeading)
        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Set Waypoint", () => {
    let aeroplane;
    let map;
    beforeEach(() => {
        map = testGameMap()
        aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets waypoint action when valid", () => {
        let desiredWaypoint = "LAM";

        aeroplane.setWaypoint(map, desiredWaypoint)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetWaypoint).toBe(desiredWaypoint)
    })

    test("Does not set waypoint when does not exist", () => {
        let desiredWaypoint = "CAT";
        aeroplane.setWaypoint(map, desiredWaypoint)
        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Set Altitude", () => {
    let aeroplane;
    let map;
    beforeEach(() => {
        map = testGameMap()
        aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
    })

    test("Sets altitude action when valid", () => {
        let desiredAltitude = 12000;

        aeroplane.setAltitude(map, desiredAltitude)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetValue).toBe(desiredAltitude)
    })

    test("Does not set altitude when not valid", () => {
        let desiredAltitude = 1234;

        aeroplane.setAltitude(map, desiredAltitude)

        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Set Landing", () => {
    let aeroplane;
    let map;
    beforeEach(() => {
        map = testGameMap()
        aeroplane = new Aeroplane("AB123", "A321", 290, 500, 190, 90, 2500, 3)
    })

    test("Sets landing action when valid", () => {
        let desiredRunway = "9L";

        aeroplane.setLanding(map, desiredRunway)

        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].targetRunway).toBe(desiredRunway)
    })

    test("Does not set landing when not valid", () => {
        let desiredRunway = "24C";

        aeroplane.setLanding(map, desiredRunway)

        expect(aeroplane.actions.length).toBe(0)
    })
})

describe("Add Actions", () => {
    describe('When no pre-existing actions', () => {
        test('Adds single Landing action to aeroplane', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            const action = new Landing(testGameMap(), aeroplane, "9R")
            aeroplane.addAction(action)

            expect(aeroplane.actions.length).toBe(1)
        })

        test('Adds single Waypoint action to aeroplane', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            const action = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(action)

            expect(aeroplane.actions.length).toBe(1)
        })

        test('Adds single Heading action to aeroplane', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            const action = new Heading(testGameMap(), aeroplane, 87)
            aeroplane.addAction(action)

            expect(aeroplane.actions.length).toBe(1)
        })

        test('Adds single Speed action to aeroplane', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            const action = new Speed(testGameMap(), aeroplane, 220)
            aeroplane.addAction(action)

            expect(aeroplane.actions.length).toBe(1)
        })

        test('Adds single Altitude action to aeroplane', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            const action = new Altitude(testGameMap(), aeroplane, 4600)
            aeroplane.addAction(action)

            expect(aeroplane.actions.length).toBe(1)
        })
    })

    describe('Landing overwrites all pre-existing actions', () => {
        test('With one pre-existing action', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Altitude(testGameMap(), aeroplane, 4600)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Altitude")

            const landingAction = new Landing(testGameMap(), aeroplane, "9R")
            aeroplane.addAction(landingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Landing")
        })

        test('With multiple pre-existing actions', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Altitude(testGameMap(), aeroplane, 4600),
                new Speed(testGameMap(), aeroplane, 220),
                new Waypoint(testGameMap(), aeroplane, "LAM")
            ]

            expect(aeroplane.actions.length).toBe(3)
            expect(aeroplane.actions[0].type()).toBe("Altitude")
            expect(aeroplane.actions[1].type()).toBe("Speed")
            expect(aeroplane.actions[2].type()).toBe("Waypoint")

            const landingAction = new Landing(testGameMap(), aeroplane, "9R")
            aeroplane.addAction(landingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Landing")
        })

    })

    describe('Directional actions overwrite one another', () => {
        test('Hold overwrites waypoint action', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "LAM")
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")

            const holdAction = new HoldingPattern(testGameMap(), aeroplane, 1)
            aeroplane.addAction(holdAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")
        })

        test('Hold overwrites heading action', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Heading(testGameMap(), aeroplane, 272)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")

            const holdAction = new HoldingPattern(testGameMap(), aeroplane, 1)
            aeroplane.addAction(holdAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")
        })

        test('Heading overwrites Waypoint', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "LAM")
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")

            const headingAction = new Heading(testGameMap(), aeroplane, 87)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
        })

        test('Heading overwrites Hold', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new HoldingPattern(testGameMap(), aeroplane, 1)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")

            const headingAction = new Heading(testGameMap(), aeroplane, 87)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
        })

        test('Waypoint overwrites Heading', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Heading(testGameMap(), aeroplane, 87)
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
        })

        test('Waypoint overwrites Hold', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new HoldingPattern(testGameMap(), aeroplane, 1)
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
        })

        test('Waypoint overwrites Waypoint', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "OCK")
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("OCK")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("LAM")
        })

        test('Heading does not overwrite altitude', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 7000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "LAM"),
                new Altitude(testGameMap(), aeroplane, 4000)
            ]

            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("LAM")
            expect(aeroplane.actions[1].type()).toBe("Altitude")
            expect(aeroplane.actions[1].targetValue).toBe(4000)

            const headingAction = new Heading(testGameMap(), aeroplane, 180)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].type()).toBe("Heading")
            expect(aeroplane.actions[0].targetValue).toBe(180)
            expect(aeroplane.actions[1].type()).toBe("Altitude")
            expect(aeroplane.actions[1].targetValue).toBe(4000)
        })
    })

    describe('Nothing overwrites landing', () => {
        test('Hold does not overwrite Landing', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 500, 425, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Landing(testGameMap(), aeroplane, "9L")
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Landing")

            const holdAction = new HoldingPattern(testGameMap(), aeroplane, 1)
            aeroplane.addAction(holdAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Landing")
        })

        test('Hold overwrites heading action', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Heading(testGameMap(), aeroplane, 272)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")

            const holdAction = new HoldingPattern(testGameMap(), aeroplane, 1)
            aeroplane.addAction(holdAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")
        })

        test('Heading overwrites Waypoint', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "LAM")
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")

            const headingAction = new Heading(testGameMap(), aeroplane, 87)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
        })

        test('Heading overwrites Hold', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new HoldingPattern(testGameMap(), aeroplane, 1)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")

            const headingAction = new Heading(testGameMap(), aeroplane, 87)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
        })

        test('Waypoint overwrites Heading', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Heading(testGameMap(), aeroplane, 87)
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
        })

        test('Waypoint overwrites Hold', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new HoldingPattern(testGameMap(), aeroplane, 1)
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("HoldingPattern")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
        })

        test('Waypoint overwrites Waypoint', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "OCK")
            ]
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("OCK")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "LAM")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("LAM")
        })
    })

    describe('Updated action overwrites pre-existing same action', () => {
        test('Waypoint updates', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Waypoint(testGameMap(), aeroplane, "LAM")
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("LAM")

            const waypointAction = new Waypoint(testGameMap(), aeroplane, "CPT")
            aeroplane.addAction(waypointAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Waypoint")
            expect(aeroplane.actions[0].targetWaypoint).toBe("CPT")
        })

        test('Speed updates', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Speed(testGameMap(), aeroplane, 220)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Speed")
            expect(aeroplane.actions[0].targetValue).toBe(220)

            const speedAction = new Speed(testGameMap(), aeroplane, 250)
            aeroplane.addAction(speedAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Speed")
            expect(aeroplane.actions[0].targetValue).toBe(250)
        })

        test('Heading updates', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Heading(testGameMap(), aeroplane, 87)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
            expect(aeroplane.actions[0].targetValue).toBe(87)

            const headingAction = new Heading(testGameMap(), aeroplane, 102)
            aeroplane.addAction(headingAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Heading")
            expect(aeroplane.actions[0].targetValue).toBe(102)
        })

        test('Altitude updates', () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 200, 300, 90, 3000, 3)
            aeroplane.actions = [
                new Altitude(testGameMap(), aeroplane, 4600)
            ]

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Altitude")
            expect(aeroplane.actions[0].targetValue).toBe(4600)

            const altitudeAction = new Altitude(testGameMap(), aeroplane, 12200)
            aeroplane.addAction(altitudeAction)

            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].type()).toBe("Altitude")
            expect(aeroplane.actions[0].targetValue).toBe(12200)
        })
    })
})

describe("Apply Actions", () => {
    describe("When no actions available", () => {
        let startX = 100;
        let startY = 100;
        let aeroplane;

        beforeEach(() => {
            aeroplane = new Aeroplane("AB123", "A321", startX, startY, 150, 0, 3000, 3)
        })

        test("Change in position responsive at minimum speed and 1 degree heading", () => {
            aeroplane = new Aeroplane("AB123", "A321", 100, 100, MIN_SPEED, 91, 3000, 3)

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(100)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.75)
            expect(aeroplane.y).toBe(100.03)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(103.5)
            expect(aeroplane.y).toBe(100.06)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(105.25)
            expect(aeroplane.y).toBe(100.09)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(107)
            expect(aeroplane.y).toBe(100.12)
        })

        test("Continues north if no actions available", () => {
            let north = 0
            aeroplane.heading = north

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(97.75)
        })

        test("Continues east if no actions available", () => {
            let east = 90
            aeroplane.heading = east

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(102.25)
            expect(aeroplane.y).toBe(100)
        })

        test("Continues south if no actions available", () => {
            let south = 180
            aeroplane.heading = south

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(100)
            expect(aeroplane.y).toBe(102.25)
        })

        test("Continues west if no actions available", () => {
            let west = 270
            aeroplane.heading = west

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(97.75)
            expect(aeroplane.y).toBe(100)
        })

        test("Continues north east if no actions available", () => {
            let northEast = 45
            aeroplane.heading = northEast

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.59)
            expect(aeroplane.y).toBe(98.41)
        })

        test("Continues south east if no actions available", () => {
            let southEast = 135
            aeroplane.heading = southEast

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(101.59)
            expect(aeroplane.y).toBe(101.59)
        })

        test("Continues south west if no actions available", () => {
            let southWest = 225
            aeroplane.heading = southWest

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(98.41)
            expect(aeroplane.y).toBe(101.59)
        })

        test("Continues north west if no actions available", () => {
            let northWest = 315
            aeroplane.heading = northWest

            expect(aeroplane.x).toBe(startX)
            expect(aeroplane.y).toBe(startY)

            expect(aeroplane.actions.length).toBe(0)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(98.41)
            expect(aeroplane.y).toBe(98.41)
        })
    })

    describe("When actions available", () => {
        let map;

        beforeEach(() => {
            map = testGameMap()
        })

        test("Applies all actions and moves forward", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 50, 100, 150, 90, 5000, 3)

            aeroplane.setSpeed(map, 160)
            aeroplane.setHeading(map, 100)
            aeroplane.setAltitude(map, 10000)

            aeroplane.applyActions()

            expect(aeroplane.x).toBe(52.27)
            expect(aeroplane.y).toBe(100.08)
            expect(aeroplane.heading).toBeCloseTo(91.99)
            expect(aeroplane.altitude).toBe(5020)
        })
    })
})

describe("Sequential Actions", () => {

    describe("Overwrites existing action when one same action exits", () => {
        let aeroplane;
        let map;

        beforeEach(() => {
            map = testGameMap()
            aeroplane = new Aeroplane("AB123", "A321", 100, 100, 150, 0, 3000, 3)
        })

        test("Speed", () => {
            aeroplane.setSpeed(map, 160)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(160)

            aeroplane.setSpeed(map, 170)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(170)
        })

        test("Heading", () => {
            aeroplane.setHeading(map, 90)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(90)

            aeroplane.setHeading(map, 180)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(180)
        })

        test("Altitude", () => {
            aeroplane.setAltitude(map, 5000)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(5000)

            aeroplane.setAltitude(map, 10000)
            expect(aeroplane.actions.length).toBe(1)
            expect(aeroplane.actions[0].targetValue).toBe(10000)
        })
    })

    describe("Overwrites existing action when multiple different actions exist", () => {
        let aeroplane;
        let map;

        beforeEach(() => {
            map = testGameMap()
            aeroplane = new Aeroplane("AB123", "A321", 100, 100, 150, 0, 3000, 3)
        })

        test("Speed", () => {
            aeroplane.setSpeed(map, 160)
            aeroplane.setHeading(map, 90)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(90)

            aeroplane.setSpeed(map, 170)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(170)
            expect(aeroplane.actions[1].targetValue).toBe(90)
        })

        test("Heading", () => {
            aeroplane.setSpeed(map, 160)
            aeroplane.setHeading(map, 90)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(90)

            aeroplane.setHeading(map, 180)
            expect(aeroplane.actions.length).toBe(2)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(180)
        })

        test("Altitude", () => {
            aeroplane.setSpeed(map, 160)
            aeroplane.setAltitude(map, 5000)
            aeroplane.setHeading(map, 90)
            expect(aeroplane.actions.length).toBe(3)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(5000)
            expect(aeroplane.actions[2].targetValue).toBe(90)

            aeroplane.setAltitude(map, 12000)
            expect(aeroplane.actions[0].targetValue).toBe(160)
            expect(aeroplane.actions[1].targetValue).toBe(12000)
            expect(aeroplane.actions[2].targetValue).toBe(90)
        })

    })

    describe("Landing action clears all other actions", () => {
        const map = testGameMap()
        const aeroplane = new Aeroplane("AB123", "A321", 290, 505, 150, 91, 3000, 3)

        aeroplane.setSpeed(map, 160)
        aeroplane.setAltitude(map, 2000)
        aeroplane.setHeading(map, 90)
        expect(aeroplane.actions.length).toBe(3)
        expect(aeroplane.actions[0].targetValue).toBe(160)
        expect(aeroplane.actions[1].targetValue).toBe(2000)
        expect(aeroplane.actions[2].targetValue).toBe(90)

        aeroplane.setLanding(map, "9L")
        expect(aeroplane.actions.length).toBe(1)
        expect(aeroplane.actions[0].type()).toBe("Landing")
    })

})

describe("Outside boundaries", () => {

    describe("Determines when outside boundaries", () => {
        let aeroplane;
        let mapBoundaries;

        beforeEach(() => {
            mapBoundaries = {
                minX: 0,
                maxX: 100,
                minY: 0,
                maxY: 100,
            }
        })

        test("Too far north", () => {
            const x = 50
            const y = -1
            aeroplane = new Aeroplane("AB123", "A321", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isArrivalOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far east", () => {
            const x = 101
            const y = 50
            aeroplane = new Aeroplane("AB123", "A321", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isArrivalOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far south", () => {
            const x = 50
            const y = 101
            aeroplane = new Aeroplane("AB123", "A321", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isArrivalOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })

        test("Too far west", () => {
            const x = -1
            const y = 50
            aeroplane = new Aeroplane("AB123", "A321", x, y, 150, 0, 3000, 3)
            const result = aeroplane.isArrivalOutsideBoundaries(mapBoundaries)
            expect(result).toBeTruthy()
        })
    })
})

describe("Holding state", () => {
    test("Aeroplane is landing", () => {
        const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, 3000, 3)
        aeroplane.actions = [
            new HoldingPattern(testGameMap(), aeroplane, 1),
            new Speed(testGameMap(), aeroplane, 240)
        ]
        expect(aeroplane.isHolding()).toBeTruthy()
    })

    test("Aeroplane is not holding", () => {
        const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, 3000, 3)
        aeroplane.actions = [
            new Speed(testGameMap(), aeroplane, 220)
        ]
        expect(aeroplane.isHolding()).toBeFalsy()
    })
})

describe("Landing/Landed state", () => {

    describe("Determines when landing", () => {
        test("Aeroplane is landing", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, 3000, 3)
            aeroplane.actions = [
                new Landing(testGameMap(), aeroplane, "9R")
            ]
            expect(aeroplane.isLanding()).toBeTruthy()
        })

        test("Aeroplane is not landing", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, 3000, 3)
            aeroplane.actions = [
                new Speed(testGameMap(), aeroplane, 220)
            ]
            expect(aeroplane.isLanding()).toBeFalsy()
        })
    })

    describe("Determines when landed", () => {
        test("Aeroplane has landed", () => {
            const altitude = 39
            const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, altitude, 3)

            expect(aeroplane.hasLanded()).toBeTruthy()
        })

        test("Aeroplane has not landed", () => {
            const altitude = 40;
            const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, altitude, 3)
            expect(aeroplane.hasLanded()).toBeFalsy()
        })

        test("Calls landed callback", () => {
            let callCount = 0;
            const uponLandingCallback = () => {
                callCount += 1
            };

            const aeroplane = new Aeroplane("AB123", "A321", 250, 300, 150, 0, 20, 3)

            expect(callCount).toBe(0)

            aeroplane.hasLanded(uponLandingCallback)

            expect(callCount).toBe(1)
        })
    })
})

describe("Proximity breached", () => {

    describe("Determines aeroplane breached proximity limits", () => {
        test("Horizontal distance", () => {
            const aeroplane1 = new Aeroplane("AB123", "A321", 470, 470, 150, 0, 3000, 3)
            const aeroplane2 = new Aeroplane("AB123", "A321", 500, 500, 150, 0, 3000, 3)

            const result = aeroplane1.proximalTo(aeroplane2)

            expect(result).toBeTruthy()
        })

        test("Vertical distance", () => {
            const aeroplane1 = new Aeroplane("AB123", "A321", 470, 470, 150, 0, 3900, 3)
            const aeroplane2 = new Aeroplane("AB123", "A321", 500, 500, 150, 0, 3000, 3)

            const result = aeroplane1.proximalTo(aeroplane2)

            expect(result).toBeTruthy()
        })
    })

    describe("Determines aeroplane has not breached proximity limits", () => {
        test("When enough vertical separation", () => {
            const aeroplane1 = new Aeroplane("AB123", "A321", 490, 510, 150, 0, 4001, 3)
            const aeroplane2 = new Aeroplane("AB123", "A321", 500, 500, 150, 0, 3000, 3)

            const result = aeroplane1.proximalTo(aeroplane2)

            expect(result).toBeFalsy()
        })

        test("When enough horizontal separation", () => {
            const aeroplane1 = new Aeroplane("AB123", "A321", 300, 800, 150, 0, 3100, 3)
            const aeroplane2 = new Aeroplane("AB123", "A321", 500, 500, 150, 0, 3000, 3)

            const result = aeroplane1.proximalTo(aeroplane2)

            expect(result).toBeFalsy()
        })
    })
})

describe("Altitude restriction breached", () => {

    describe("Determines aeroplane breached altitude restrictions", () => {
        test("When no altitude range specified", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 470, 470, 150, 0, 3000, 3)
            const zone = {
                minAltitude: null,
                maxAltitude: null,
            }

            const result = aeroplane.breachingZoneAltitudeRestriction(zone)

            expect(result).toBeTruthy()
        })

        test("When below minimum altitude", () => {
            const currentAltitude = 2999;
            const aeroplane = new Aeroplane("AB123", "A321", 470, 470, 150, 0, currentAltitude, 3)
            const zone = {
                minAltitude: 3000,
                maxAltitude: undefined,
            }

            const result = aeroplane.breachingZoneAltitudeRestriction(zone)

            expect(result).toBeTruthy()
        })

        test("When below maximum altitude", () => {
            const currentAltitude = 5001;
            const aeroplane = new Aeroplane("AB123", "A321", 470, 470, 150, 0, currentAltitude, 3)
            const zone = {
                minAltitude: undefined,
                maxAltitude: 5000,
            }

            const result = aeroplane.breachingZoneAltitudeRestriction(zone)

            expect(result).toBeTruthy()
        })
    })

    describe("Determines aeroplane has not breached altitude restrictions", () => {
        test("When at minimum altitude", () => {
            const currentAltitude = 3000;
            const aeroplane = new Aeroplane("AB123", "A321", 470, 470, 150, 0, currentAltitude, 3)
            const zone = {
                minAltitude: 3000,
                maxAltitude: undefined,
            }

            const result = aeroplane.breachingZoneAltitudeRestriction(zone)

            expect(result).toBeFalsy()
        })

        test("When at maximum altitude", () => {
            const currentAltitude = 5000;
            const aeroplane = new Aeroplane("AB123", "A321", 470, 470, 150, 0, currentAltitude, 3)
            const zone = {
                minAltitude: undefined,
                maxAltitude: 5000,
            }

            const result = aeroplane.breachingZoneAltitudeRestriction(zone)

            expect(result).toBeFalsy()
        })
    })
})

describe("Restricted zone breached", () => {

    describe("Determines aeroplane breached restricted zone location", () => {
        test("Inside boundary", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 50, 750, 150, 0, 2800, 3)
            const zone = {
                minAltitude: 3000,
                maxAltitude: undefined,
                boundaries: [
                    {x: 0, y: undefined, inv_y: 0},
                    {x: 0, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 0},
                ]
            };
            const map = {
                maxY: 800,
                features: {
                    exclusionZones: [
                        zone
                    ]
                }
            }
            const result = aeroplane.breachingRestrictedZone(map, zone)

            expect(result).toBeTruthy()
        })

        test("On boundary", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 0, 750, 150, 0, 2800, 3)
            const zone = {
                minAltitude: 3000,
                maxAltitude: undefined,
                boundaries: [
                    {x: 0, y: undefined, inv_y: 0},
                    {x: 0, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 0},
                ]
            };
            const map = {
                maxY: 800,
                features: {
                    exclusionZones: [
                        zone
                    ]
                }
            }
            const result = aeroplane.breachingRestrictedZone(map, zone)

            expect(result).toBeTruthy()
        })
    })

    describe("Determines aeroplane not breached restricted zone location", () => {
        test("On zone corner", () => {
            const aeroplane = new Aeroplane("AB123", "A321", 100, 700, 150, 0, 2800, 3)
            const zone = {
                minAltitude: 3000,
                maxAltitude: undefined,
                boundaries: [
                    {x: 0, y: undefined, inv_y: 0},
                    {x: 0, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 100},
                    {x: 100, y: undefined, inv_y: 0},
                ]
            };
            const map = {
                maxY: 800,
                features: {
                    exclusionZones: [
                        zone
                    ]
                }
            }
            const result = aeroplane.breachingRestrictedZone(map, zone)

            expect(result).toBeFalsy()
        })
    })

})