import {AeroplaneService} from "../AeroplaneService";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";

describe('Send command', () => {

    test('Sends command to relevant aeroplane', () => {
        const service = new AeroplaneService()
        service.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456S140C12H070"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: 140,
            heading: 70,
            altitude: 12000
        })

        const unaffectedAeroplane = service.aeroplanes[0]
        expect(unaffectedAeroplane.callSign).toBe("BA123")
        expect(unaffectedAeroplane.actions.length).toBe(0)

        const affectedAeroplane = service.aeroplanes[1]
        expect(affectedAeroplane.callSign).toBe("BA456")
        expect(affectedAeroplane.actions.length).toBe(3)
    })

    test('All aeroplanes unaffected if command not valid', () => {
        const service = new AeroplaneService()
        service.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 180, 5000, 3),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000, 3),
        ]

        const rawCommand = "BA456X140Y12P070"

        const result = service.sendCommand(rawCommand)

        expect(result).toStrictEqual({
            callSign: "BA456",
            speed: null,
            heading: null,
            altitude: null
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
        const service = new AeroplaneService()
        service.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000),
        ]

        const providedX = 501
        const providedY = 304

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBe("BA123")
    })

    test('Gets second aeroplane when provided position is within its tolerances', () => {
        const service = new AeroplaneService()
        service.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000),
        ]

        const providedX = 496
        const providedY = 354

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBe("BA456")
    })

    test('Returns null if no aeroplanes in the area', () => {
        const service = new AeroplaneService()
        service.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 180, 5000),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000),
        ]

        const providedX = 5
        const providedY = 5

        const result = service.getCallSignByPosition(providedX, providedY)

        expect(result).toBeNull()
    })
})

describe('Deactivate aeroplanes', () => {

    test('Deactivates aeroplanes outside of map boundaries', () => {
        const mapBoundaries = {
            minX: 0,
            maxX: 100,
            minY: 0,
            maxY: 100,
        }

        const service = new AeroplaneService(mapBoundaries)

        service.aeroplanes = [
            new Aeroplane("BA123", -1, 50, 120, 180, 5000),
            new Aeroplane("BA456", 50, 50, 120, 90, 10000),
        ]

        expect(service.aeroplanes[0].active).toBeTruthy()
        expect(service.aeroplanes[1].active).toBeTruthy()

        service.deactivateAeroplanes()

        expect(service.aeroplanes[0].active).toBeFalsy()
        expect(service.aeroplanes[1].active).toBeTruthy()
    })
})