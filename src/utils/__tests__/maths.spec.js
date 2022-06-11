import {range} from "../maths";

describe("range", () => {
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