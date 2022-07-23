import {StatsService} from "../StatsService";
import {UIController} from "../../Interface/UIController";

jest.mock("../../Interface/UIController");

describe('Stats service', () => {

    test('Calculates total landed count', () => {
        const service = new StatsService()
        service.correctlyLandedCount = 15
        service.incorrectlyLandedCount = 25

        expect(service.totalLanded()).toBe(40)

    })

    test('Calculates total departed count', () => {
        const service = new StatsService()
        service.correctlyDepartedCount = 12
        service.incorrectlyDepartedCount = 19

        expect(service.totalDeparted()).toBe(31)

    })

    test('Calculates correctly landed percentage', () => {
        const service = new StatsService()
        service.correctlyLandedCount = 15
        service.incorrectlyLandedCount = 25

        expect(service.correctlyLandedPercentage()).toBe(38)
    })

    test('Calculates correctly departed percentage', () => {
        const service = new StatsService()
        service.correctlyDepartedCount = 12
        service.incorrectlyDepartedCount = 43

        expect(service.correctlyDepartedPercentage()).toBe(22)
    })

    test('Increments lost count', () => {
        const service = new StatsService({})

        expect(service.lostCount).toBe(0)

        service.incrementLost()

        expect(service.lostCount).toBe(1)
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