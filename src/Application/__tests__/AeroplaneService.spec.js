import {AeroplaneService} from "../AeroplaneService";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {GameMap} from "../../Domain/GameMap/GameMap";
import {DEPARTURE, LANDED_ALTITUDE} from "../../config/constants";
import {HOLDING_SHORT, READY_TO_TAXI} from "../../Domain/Aeroplane/aeroplaneStates";

const testGameMap = () => {
    return new GameMap({
        maxX: 1000,
        maxY: 1000,
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
                    takeoffPoint: {
                        x: 550,
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
                    takeoffPoint: {
                        x: 440,
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
    let mockState;

    beforeEach(() => {
        map = testGameMap()
        mockState = {
            setMachine: jest.fn(),
            setMap: jest.fn(),
        }
    })

    test('Sends base commands to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", "A321", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456S140A120T070"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: 140,
            heading: 70,
            altitude: 12000,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(3)
    })

    test('Sends waypoint command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(1)
    })

    test('Sends landing command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 300, 500, 140, 90, 2800, 3),
        ]

        const rawCommand = "BA456ILS9L"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: "9L",
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(1)
    })

    test('Sends speed and hold command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 500, 350, 120, 90, 10000, 3),
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
            hold: 1,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined
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

    test('Sends taxi and hold command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
        service.aeroplanes = [
            new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", "A321", 500, 350, 0, 360, 0, 3, DEPARTURE, READY_TO_TAXI),
        ]

        const rawCommand = "BA456TH9L"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: "9L",
            clearedForTakeoff: undefined,
            goAround: undefined
        })

        // TODO: Check actions have been added
    })

    test('Sends cleared for takeoff command to relevant aeroplane', () => {
        const service = new AeroplaneService(map, {}, mockState)
        const aeroplane1 = new Aeroplane("BA123", "A321", 500, 300, 120, 180, 5000, 3)
        const aeroplane2 = new Aeroplane("BA456", "A321", 500, 350, 0, 270, 0, 3, DEPARTURE, HOLDING_SHORT)

        aeroplane2.positionDescription = "9L"

        service.aeroplanes = [
            aeroplane1,
            aeroplane2,
        ]

        const rawCommand = "BA456CTO"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: true,
            goAround: undefined
        })

        // TODO: Check actions have been added
    })


    test('All aeroplanes unaffected if command not valid', () => {
        const service = new AeroplaneService(map, {}, mockState)
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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined
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

    let mockState;

    beforeEach(() => {
        mockState = {
            setMachine: jest.fn(),
            setMap: jest.fn(),
        }
    })

    test('Gets first aeroplane when provided position is within its tolerances', () => {
        const service = new AeroplaneService(testGameMap(), {}, mockState)
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
        const service = new AeroplaneService(testGameMap(), {}, mockState)
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
        const service = new AeroplaneService(testGameMap(), {}, mockState)
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

    let mockState;

    beforeEach(() => {
        mockState = {
            setMachine: jest.fn(),
            setMap: jest.fn(),
        }
    })

    test('Removes aeroplanes outside of map boundaries', () => {
        const landedCallback = jest.fn();
        const exitedCallback = jest.fn();
        const statsService = {
            incrementLanded: landedCallback,
            incrementLost: exitedCallback
        }
        const service = new AeroplaneService(testGameMap(), statsService, mockState)

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

        expect(landedCallback).not.toHaveBeenCalled()
        expect(exitedCallback).toHaveBeenCalled()
    })

    test('Removes aeroplanes that have landed', () => {
        const landedCallback = jest.fn();
        const exitedCallback = jest.fn();
        const statsService = {
            incrementCorrectlyLanded: landedCallback,
            incrementLost: exitedCallback
        }

        const service = new AeroplaneService(testGameMap(), statsService, mockState)

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

        expect(landedCallback).toHaveBeenCalled()
        expect(exitedCallback).not.toHaveBeenCalled()
    })
})

describe('Determine proximal aeroplanes', () => {

    test('Lists aeroplanes that breach proximity boundaries', () => {
        const mockMap = {mapBoundaries: {maxX: 1000, maxY: 1000}, features: {restrictedZones: []}};

        const service = new AeroplaneService(mockMap, {}, {
            setMachine: jest.fn(),
            setMap: jest.fn()
        })

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