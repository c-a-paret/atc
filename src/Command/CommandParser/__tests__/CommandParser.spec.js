import {
    commandMessage,
    parseAltitude,
    parseCommand,
    parseHeading,
    parseRunway,
    parseSpeed,
    parseWaypoint
} from "../CommandParser";

describe("Parse Command", () => {
    test("Extracts the call sign", () => {
        const command = "BA423S200"
        const expectedCallSign = "BA423"

        const result = parseCommand(command)

        expect(result.callSign).toBe(expectedCallSign)
    })

    test("Extracts the desired speed", () => {
        const command = "BA423S200"
        const expectedSpeed = 200

        const result = parseCommand(command)

        expect(result.speed).toBe(expectedSpeed)
    })

    test("Extracts the desired heading", () => {
        const command = "BA423H342S200"
        const expectedSpeed = 342

        const result = parseCommand(command)

        expect(result.heading).toBe(expectedSpeed)
    })

    test("Extracts the desired two digit altitude", () => {
        const command = "BA423H342D13S200"
        const expectedAltitude = 1300

        const result = parseCommand(command)

        expect(result.altitude).toBe(expectedAltitude)
    })

    test("Extracts the desired three digit altitude", () => {
        const command = "BA423H342D270S200"
        const expectedAltitude = 27000

        const result = parseCommand(command)

        expect(result.altitude).toBe(expectedAltitude)
    })

    test("Extracts the desired waypoint", () => {
        const command = "BA423>OCKD13S200"
        const expectedWaypoint = "OCK"

        const result = parseCommand(command)

        expect(result.waypoint).toBe(expectedWaypoint)
    })

    test("Sets heading and waypoint null if both supplied", () => {
        const command = "BA423>OCKD13H200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
    })

    test("Sets heading null if runway supplied", () => {
        const command = "BA423.9L.H200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
        expect(result.runway).toBe("9L")
    })

    test("Sets waypoint null if runway supplied", () => {
        const command = "BA423>OCK.27R.S200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
        expect(result.runway).toBe("27R")
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

describe("Heading Commands", () => {
    test("Extracts heading inside larger command", () => {
        const command = "BA423S200H070WLAM"
        const expectedHeading = 70

        const result = parseHeading(command)

        expect(result).toBe(expectedHeading)
    })

    test("Extracts heading of 000 to 360", () => {
        const command = "BA423S200H000WLAM"
        const expectedHeading = 360

        const result = parseHeading(command)

        expect(result).toBe(expectedHeading)
    })

    test("Returns null if no heading command found", () => {
        const command = "J123S150"

        const result = parseHeading(command)

        expect(result).toBeNull()
    })
})

describe("Altitude Commands", () => {
    test("Extracts one digit flight level altitude inside larger command", () => {
        const command = "BA423S200C2WLAM"
        const expectedAltitude = 200

        const result = parseAltitude(command)

        expect(result).toBe(expectedAltitude)
    })

    test("Extracts two digit flight level altitude inside larger command", () => {
        const command = "BA423S200C31WLAM"
        const expectedAltitude = 3100

        const result = parseAltitude(command)

        expect(result).toBe(expectedAltitude)
    })

    test("Returns null if no heading command found", () => {
        const command = "J123S150"

        const result = parseAltitude(command)

        expect(result).toBeNull()
    })
})

describe("Waypoint Commands", () => {
    test("Extracts waypoint inside larger command", () => {
        const command = "BA423>LAMS200C2"
        const expectedWaypoint = "LAM"

        const result = parseWaypoint(command)

        expect(result).toBe(expectedWaypoint)
    })

    test("Returns null if no heading command found", () => {
        const command = "J123S150"

        const result = parseWaypoint(command)

        expect(result).toBeNull()
    })
})

describe("Landing Commands", () => {
    test("Extracts runway inside larger command", () => {
        const command = "BA423.9L.S200"
        const expectedRunway = "9L"

        const result = parseRunway(command)

        expect(result).toBe(expectedRunway)
    })

    test("Returns null if no landing command found", () => {
        const command = "J123S150"

        const result = parseRunway(command)

        expect(result).toBeNull()
    })
})

describe("Command message", () => {
    test("Returns unrecognised when all command fields are undefined", () => {
        const commands = {
            callSign: undefined,
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe('Unrecognised command')
    })

    test("Returns no valid commands when only call sign defined", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe('No valid commands')
    })

    test("Returns message with defined commands [Heading]", () => {
        const commands = {
            callSign: 'BA123',
            speed: 340,
            heading: 50,
            altitude: 12000,
            waypoint: undefined,
            runway: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 Speed: 340 Heading: 50 Altitude: 12000ft")
    })

    test("Returns message with defined commands [Waypoint]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: "JAM",
            runway: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 Waypoint: JAM")
    })

    test("Returns message with defined commands [Landing]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: "27R",
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 cleared to land runway 27R")
    })
})