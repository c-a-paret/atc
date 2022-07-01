import {AeroplaneService} from "../AeroplaneService";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {GameMap} from "../../Domain/GameMap/GameMap";
import {LANDED_ALTITUDE} from "../../config/constants";

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
            }], waypoints: [{type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},]
        }
    })
}


describe('Send command', () => {

    let map;

    beforeEach(() => {
        map = testGameMap()
    })

    test('Sends base commands to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", "A321", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456S140C120T070"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: 140,
            heading: 70,
            altitude: 12000,
            waypoint: undefined,
            runway: undefined,
            hold: undefined
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(3)
    })

    test('Sends waypoint command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456>LAM"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: "LAM",
            runway: undefined,
            hold: undefined
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(1)
    })

    test('Sends landing command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 300, 500, 140, 90, 2800, 3),
        ]

        const rawCommand = "BA456.9L."

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: "9L",
            hold: undefined,
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(1)
    })

    test('Sends speed and hold command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", "A321", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456S140HR"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: 140,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: 1
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(2)

        expect(affectedAeroplane.actions[0].type()).toBe("Speed")
        expect(affectedAeroplane.actions[1].type()).toBe("HoldingPattern")
    })


    test('All aeroplanes unaffected if command not valid', () => {
        const service = new AeroplaneService(map, {})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456X140Y12P070"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined
        })

        const unaffectedAeroplane1 = service.aeroplanes[0]
        expect(unaffectedAeroplane1.callSign).toBe("BA123")
        expect(unaffectedAeroplane1.actions.length).toBe(0)

        const unaffectedAeroplane2 = service.aeroplanes[1]
        expect(unaffectedAeroplane2.callSign).toBe("BA456")
        expect(unaffectedAeroplane2.actions.length).toBe(0)
    })
})

describe('Get aeroplane by position', () => {

    test('Gets first aeroplane when provided position is within its tolerances', () => {
        const service = new AeroplaneService({}, {maxX: 1000, maxY: 1000})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000),
        ]

        const providedX = 501
        const providedY = 304

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBe("BA123")
    })

    test('Gets second aeroplane when provided position is within its tolerances', () => {
        const service = new AeroplaneService({}, {maxX: 1000, maxY: 1000})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000),
        ]

        const providedX = 496
        const providedY = 354

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBe("BA456")
    })

    test('Returns null if no aeroplanes in the area', () => {
        const service = new AeroplaneService({}, {maxX: 1000, maxY: 1000})
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000),
        ]

        const providedX = 5
        const providedY = 5

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBeNull()
    })
})

describe('Remove aeroplanes', () => {

    test('Removes aeroplanes outside of map boundaries', () => {
        const mapBoundaries = {
            minX: 0,
            maxX: 100,
            minY: 0,
            maxY: 100,
        }

        const statsService = {
            incrementLanded: () => {
            },
            incrementExited: () => {
            }
        }
        const service = new AeroplaneService({}, mapBoundaries)
        service.setStatsService(statsService)

        service.aeroplanes = [
            new Aeroplane("BA123", "A321", -1, 50, 120, 180, 5000),
            new Aeroplane("BA456", "A321", 50, 50, 120, 90, 10000),
        ]

        expect(service.aeroplanes.length).toBe(2)
        expect(service.aeroplanes[0].callSign).toBe('BA123')
        expect(service.aeroplanes[1].callSign).toBe('BA456')

        service.deactivateAeroplanes()

        expect(service.aeroplanes.length).toBe(1)
        expect(service.aeroplanes[0].callSign).toBe('BA456')
    })

    test('Removes aeroplanes that have landed', () => {
        const mapBoundaries = {
            minX: 0,
            maxX: 100,
            minY: 0,
            maxY: 100,
        }

        const statsService = {
            incrementLanded: () => {
            },
            incrementExited: () => {
            }
        }
        const service = new AeroplaneService({}, mapBoundaries)
        service.setStatsService(statsService)

        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 100, 100, 140, 90, LANDED_ALTITUDE - 1),
            new Aeroplane("BA456", "A321", 25, 100, 140, 90, 3000),
        ]

        expect(service.aeroplanes.length).toBe(2)
        expect(service.aeroplanes[0].callSign).toBe('BA123')
        expect(service.aeroplanes[1].callSign).toBe('BA456')

        service.deactivateAeroplanes()

        expect(service.aeroplanes.length).toBe(1)
        expect(service.aeroplanes[0].callSign).toBe('BA456')
    })
})

describe('Determine proximal aeroplanes', () => {

    test('Lists aeroplanes that breach proximity boundaries', () => {
        const mockMap = {features: {exclusionZones: []}};
        const mockStatsService = {
            startProximityTimer: () => {},
            stopProximityTimer: () => {}
        };

        const service = new AeroplaneService(mockMap, {})
        service.setStatsService(mockStatsService)

        service.aeroplanes = [
            new Aeroplane("BA123_BREACH", "A321", 50, 50, 120, 90, 5000),
            new Aeroplane("BA456_BREACH", "A321", 50, 50, 120, 90, 5500),

            new Aeroplane("BA789_BREACH", "A321", 1000, 1000, 120, 90, 10000),
            new Aeroplane("BA101_BREACH", "A321", 1030, 960, 120, 90, 9001),

            new Aeroplane("BA112_NO_BREACH", "A321", 500, 500, 120, 90, 10000),
        ]

        service.markAeroplanesBreakingProximity()

        expect(service.aeroplanes[0].breachingProximity).toBeTruthy()
        expect(service.aeroplanes[1].breachingProximity).toBeTruthy()

        expect(service.aeroplanes[2].breachingProximity).toBeTruthy()
        expect(service.aeroplanes[3].breachingProximity).toBeTruthy()

        expect(service.aeroplanes[4].breachingProximity).toBeFalsy()
    })
})