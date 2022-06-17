import {StatsService} from "../StatsService";
import {UIController} from "../../Interface/UIController";

jest.mock("../../Interface/UIController");

describe('Stats service', () => {

    beforeEach(() => {
        UIController.mockClear()
    })

    test('Increments landed count', () => {
        const uiController = new UIController({})
        const mockSetStats = jest.fn();
        uiController.setStats = mockSetStats
        const service = new StatsService(uiController)

        expect(service.landedCount).toBe(0)

        service.incrementLanded()

        expect(service.landedCount).toBe(1)
        expect(mockSetStats.mock.calls.length).toBe(1)
        expect(mockSetStats.mock.calls[0][0]).toBe(1)
        expect(mockSetStats.mock.calls[0][1]).toBe(0)
    })

    test('Increments exited count', () => {
        const uiController = new UIController({})
        const mockSetStats = jest.fn();
        uiController.setStats = mockSetStats
        const service = new StatsService(uiController)

        expect(service.exitedBoundaryCount).toBe(0)

        service.incrementExited()

        expect(service.exitedBoundaryCount).toBe(1)
        expect(mockSetStats.mock.calls.length).toBe(1)
        expect(mockSetStats.mock.calls[0][0]).toBe(0)
        expect(mockSetStats.mock.calls[0][1]).toBe(1)
    })

    test('Increments exited count when existing stats', () => {
        const uiController = new UIController({})
        const mockSetStats = jest.fn();
        uiController.setStats = mockSetStats
        const service = new StatsService(uiController)
        service.landedCount = 3
        service.exitedBoundaryCount = 5

        expect(service.exitedBoundaryCount).toBe(5)

        service.incrementExited()

        expect(service.exitedBoundaryCount).toBe(6)
        expect(mockSetStats.mock.calls.length).toBe(1)
        expect(mockSetStats.mock.calls[0][0]).toBe(3)
        expect(mockSetStats.mock.calls[0][1]).toBe(6)
    })

})