import {range, round, roundToNearest} from "../maths";

describe("range", () => {
    test("Creates range between 0 and 10 with unit step", () => {
        expect(() => range(0, 10, 0)).toThrow('Step cannot be 0')
    })

    test("Creates range between 0 and 10 with unit step", () => {
        const result = range(0, 10, 1)

        expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    test("Creates range between 0 and 10 with undefined step", () => {
        const result = range(10, 0, 1)

        expect(result).toStrictEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    })

    test("Creates range between 10 and 0 with negative step 2", () => {
        const result = range(10, -1, 2)

        expect(result).toStrictEqual([10, 8, 6, 4, 2, 0])
    })

    test("Creates range between 0 and 10 with step 2", () => {
        const result = range(0, 11, 2)

        expect(result).toStrictEqual([0, 2, 4, 6, 8, 10])
    })

    test("Creates range between 100 and 0 with step 20", () => {
        const result = range(100, 0, 20)

        expect(result).toStrictEqual([100, 80, 60, 40, 20])
    })

    test("Creates empty range when start and stop are equal", () => {
        const result = range(10, 10, 1)

        expect(result).toStrictEqual([])
    })
})

describe("round", () => {
    test("Rounds number to 0dp", () => {
        const result = round(12.4, 0)
        expect(result).toBe(12)
    })

    test("Rounds 1sf number to 1dp", () => {
        const result = round(12.4, 1)
        expect(result).toBe(12.4)
    })

    test("Rounds 3sf number to 1dp", () => {
        const result = round(12.446, 1)
        expect(result).toBe(12.4)
    })

    test("Rounds number to 2dp", () => {
        const result = round(12.779, 2)
        expect(result).toBe(12.78)
    })

    test("Rounds number to 3dp", () => {
        const result = round(12.44523, 3)
        expect(result).toBe(12.445)
    })

    test("Rounds already rounded number", () => {
        const result = round(12, 0)
        expect(result).toBe(12)
    })
})

describe("roundToNearest", () => {
    test("Rounds number to nearest 10", () => {
        const result = roundToNearest(257, 10)
        expect(result).toBe(260)
    })

    test("Rounds number to nearest 100", () => {
        const result = roundToNearest(3582, 100)
        expect(result).toBe(3600)
    })
})