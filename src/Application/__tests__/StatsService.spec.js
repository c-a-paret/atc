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

    test('Increments exited count', () => {
        const service = new StatsService({})

        expect(service.exitedBoundaryCount).toBe(0)

        service.incrementExited()

        expect(service.exitedBoundaryCount).toBe(1)
    })

    test('Increments exited count when existing stats', () => {
        const service = new StatsService({})
        service.landedCount = 3
        service.exitedBoundaryCount = 5

        expect(service.exitedBoundaryCount).toBe(5)

        service.incrementExited()

        expect(service.exitedBoundaryCount).toBe(6)
    })

})