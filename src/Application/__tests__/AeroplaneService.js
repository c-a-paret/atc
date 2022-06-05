import {AeroplaneService} from "../AeroplaneService";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";

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
})