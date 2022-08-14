import {StatsService} from "../StatsService";

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

    test('Calculates correctly landed percentage when none landed', () => {
        const service = new StatsService()
        service.correctlyLandedCount = 0

        expect(service.correctlyLandedPercentage()).toBe(0)
    })

    test('Calculates correctly departed percentage', () => {
        const service = new StatsService()
        service.correctlyDepartedCount = 12
        service.incorrectlyDepartedCount = 43

        expect(service.correctlyDepartedPercentage()).toBe(22)
    })

    test('Calculates correctly departed percentage when none departed', () => {
        const service = new StatsService()
        service.correctlyDepartedCount = 0

        expect(service.correctlyDepartedPercentage()).toBe(0)
    })

    test('Increments correctly landed count', () => {
        const service = new StatsService({})

        expect(service.correctlyLandedCount).toBe(0)

        service.incrementCorrectlyLanded()

        expect(service.correctlyLandedCount).toBe(1)
    })

    test('Increments incorrectly landed count', () => {
        const service = new StatsService({})

        expect(service.incorrectlyLandedCount).toBe(0)

        service.incrementIncorrectlyLanded()

        expect(service.incorrectlyLandedCount).toBe(1)
    })

    test('Increments correctly departed count', () => {
        const service = new StatsService({})

        expect(service.correctlyDepartedCount).toBe(0)

        service.incrementCorrectlyDeparted()

        expect(service.correctlyDepartedCount).toBe(1)
    })

    test('Increments incorrectly departed count', () => {
        const service = new StatsService({})

        expect(service.incorrectlyDepartedCount).toBe(0)

        service.incrementIncorrectlyDeparted()

        expect(service.incorrectlyDepartedCount).toBe(1)
    })

    test('Increments lost count', () => {
        const service = new StatsService({})

        expect(service.lostCount).toBe(0)

        service.incrementLost()

        expect(service.lostCount).toBe(1)
    })

    test('Increments out of fuel count', () => {
        const service = new StatsService({})

        expect(service.outOfFuelCount).toBe(0)

        service.incrementOutOfFuelCount()

        expect(service.outOfFuelCount).toBe(1)
    })

    test('Increments lost count when existing stats', () => {
        const service = new StatsService({})
        service.landedCount = 3
        service.lostCount = 5

        expect(service.lostCount).toBe(5)

        service.incrementLost()

        expect(service.lostCount).toBe(6)
    })

    test('Increments breached proximity timer', () => {
        const service = new StatsService({})

        expect(service.proximityTimer).toBe(0)

        service.incrementBreachedTimer()

        expect(service.proximityTimer).toBe(1)
    })

    test('Resets all stats', () => {
        const service = new StatsService({})
        service.correctlyLandedCount = 13
        service.incorrectlyLandedCount = 2
        service.correctlyDepartedCount = 6
        service.incorrectlyDepartedCount = 4
        service.lostCount = 5
        service.proximityTimer = 67

        service.reset()

        expect(service.correctlyLandedCount).toBe(0)
        expect(service.incorrectlyLandedCount).toBe(0)
        expect(service.correctlyDepartedCount).toBe(0)
        expect(service.incorrectlyDepartedCount).toBe(0)
        expect(service.lostCount).toBe(0)
        expect(service.proximityTimer).toBe(0)
    })
})