import {StatsService} from "../StatsService";
import {UIController} from "../../Interface/UIController";

jest.mock("../../Interface/UIController");

describe('Stats service', () => {

    test('Increments landed count', () => {
        const service = new StatsService({})

        expect(service.landedCount).toBe(0)

        service.incrementLanded()

        expect(service.landedCount).toBe(1)
    })

    test('Increments lost count', () => {
        const service = new StatsService({})

        expect(service.lostCount).toBe(0)

        service.incrementLost()

        expect(service.lostCount).toBe(1)
    })

    test('Increments departed count', () => {
        const service = new StatsService({})

        expect(service.departedCount).toBe(0)

        service.incrementDeparted()

        expect(service.departedCount).toBe(1)
    })

    test('Increments lost count when existing stats', () => {
        const service = new StatsService({})
        service.landedCount = 3
        service.lostCount = 5

        expect(service.lostCount).toBe(5)

        service.incrementLost()

        expect(service.lostCount).toBe(6)
    })

})