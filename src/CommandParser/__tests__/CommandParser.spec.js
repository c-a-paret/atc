import {parseCommand, parseSpeed} from "../CommandParser";

describe("Parse Command", () => {
    test("Extracts the call sign", () => {
        const command = "BA423S200"
        const expectedCallSign = "BA423"

        const result = parseCommand(command)

        expect(result["callSign"]).toBe(expectedCallSign)
    })

    test("Extracts the desired speed sign", () => {
        const command = "BA423S200"
        const expectedSpeed = 200

        const result = parseCommand(command)

        expect(result["speed"]).toBe(expectedSpeed)
    })

})

describe("Speed Commands", () => {
    test("Extracts speed inside larger command", () => {
        const command = "BA423S200H070"
        const expectedSpeed = 200

        const result = parseSpeed(command)

        expect(result).toBe(expectedSpeed)
    })

    test("Extracts three digit speed from correctly formatted command", () => {
        const command = "S200"
        const expectedSpeed = 200

        const result = parseSpeed(command)

        expect(result).toBe(expectedSpeed)
    })

    test("Extracts two digit speed from correctly formatted command", () => {
        const command = "S80"
        const expectedSpeed = 80

        const result = parseSpeed(command)

        expect(result).toBe(expectedSpeed)
    })

    test("Returns null if no speed command found", () => {
        const command = "J123H678"

        const result = parseSpeed(command)

        expect(result).toBeNull()
    })
})