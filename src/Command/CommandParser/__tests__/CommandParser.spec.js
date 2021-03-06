import {
    commandMessage,
    parseAltitude,
    parseClearedForTakeoff,
    parseCommand,
    parseGoAround,
    parseHeading,
    parseHold,
    parseRunway,
    parseSpeed,
    parseTaxiAndHold,
    parseWaypoint
} from "../CommandParser";

describe("Parse command", () => {
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
        const command = "BA423T342S200"
        const expectedSpeed = 342

        const result = parseCommand(command)

        expect(result.heading).toBe(expectedSpeed)
    })

    test("Extracts the desired two digit altitude", () => {
        const command = "BA423H342A13S200"
        const expectedAltitude = 1300

        const result = parseCommand(command)

        expect(result.altitude).toBe(expectedAltitude)
    })

    test("Extracts the desired three digit altitude", () => {
        const command = "BA423H342A270S200"
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

    test("Extracts the hold pattern", () => {
        const command = "BA423HLS220"
        const expectedHoldDirection = -1

        const result = parseCommand(command)

        expect(result.hold).toBe(expectedHoldDirection)
    })

    test("Sets heading and waypoint null if both supplied", () => {
        const command = "BA423>OCKD13T200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
    })

    test("Sets heading null if runway supplied", () => {
        const command = "BA423ILS9LH200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
        expect(result.runway).toBe("9L")
    })

    test("Sets waypoint null if runway supplied", () => {
        const command = "BA423>OCKILS27RS200"

        const result = parseCommand(command)

        expect(result.heading).toBeNull()
        expect(result.waypoint).toBeNull()
        expect(result.runway).toBe("27R")
    })
})

describe("Speed commands", () => {
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

describe("Heading commands", () => {
    test("Extracts heading inside larger command", () => {
        const command = "BA423S200T070WLAM"
        const expectedHeading = 70

        const result = parseHeading(command)

        expect(result).toBe(expectedHeading)
    })

    test("Extracts heading of 000 to 360", () => {
        const command = "BA423S200T000WLAM"
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

describe("Altitude commands", () => {
    test("Extracts two digit flight level altitude inside larger command", () => {
        const command = "200A31>LAM"
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

describe("Waypoint commands", () => {
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

describe("Landing commands", () => {
    test("Extracts one digit runway when only command", () => {
        const command = "ILS9L"
        const expectedRunway = "9L"

        const result = parseRunway(command)

        expect(result).toBe(expectedRunway)
    })

    test("Extracts one digit runway inside command with speed command", () => {
        const command = "BA423ILS9LS200"
        const expectedRunway = "9L"

        const result = parseRunway(command)

        expect(result).toBe(expectedRunway)
    })

    test("Extracts two digit runway inside command with speed command", () => {
        const command = "BA423ILS27RS200"
        const expectedRunway = "27R"

        const result = parseRunway(command)

        expect(result).toBe(expectedRunway)
    })

    test("Returns null if no landing command found", () => {
        const command = "J123S150"

        const result = parseRunway(command)

        expect(result).toBeNull()
    })
})

describe("Go around commands", () => {
    test("Extracts go around when only command", () => {
        const command = "GA"
        const goAround = true

        const result = parseGoAround(command)

        expect(result).toBe(goAround)
    })

    test("Extracts go around when only command inside command with speed and altitude commands", () => {
        const command = "BA423S200GAA300"
        const goAround = true

        const result = parseGoAround(command)

        expect(result).toBe(goAround)
    })

    test("Returns null if no go around command found", () => {
        const command = "J123S150"

        const result = parseGoAround(command)

        expect(result).toBeNull()
    })
})

describe("Hold commands", () => {
    test("Extracts hold right command", () => {
        const command = "BA423HR"
        const expectedDirection = 1

        const result = parseHold(command)

        expect(result).toBe(expectedDirection)
    })

    test("Extracts hold left command", () => {
        const command = "BA423HL"
        const expectedDirection = -1

        const result = parseHold(command)

        expect(result).toBe(expectedDirection)
    })

    test("Returns null if no hold command found", () => {
        const command = "J123S150"

        const result = parseHold(command)

        expect(result).toBeNull()
    })
})

describe("Taxi and hold commands", () => {
    test("Extracts taxi and hold to 27R command", () => {
        const command = "BA423TH27R"
        const expectedRunway = "27R"

        const result = parseTaxiAndHold(command)

        expect(result).toBe(expectedRunway)
    })

    test("Extracts taxi and hold to 9L command", () => {
        const command = "BA423TH9L"
        const expectedRunway = "9L"

        const result = parseTaxiAndHold(command)

        expect(result).toBe(expectedRunway)
    })

    test("Returns null if command incomplete", () => {
        const command = "J123TH"

        const result = parseTaxiAndHold(command)

        expect(result).toBeNull()
    })

    test("Returns null if no taxi and hold command found", () => {
        const command = "J123S150"

        const result = parseTaxiAndHold(command)

        expect(result).toBeNull()
    })
})

describe("Cleared for takeoff commands", () => {
    test("Extracts takeoff clearance when the only command", () => {
        const command = "BA423CTO"
        const expectedCommand = true

        const result = parseClearedForTakeoff(command)

        expect(result).toBe(expectedCommand)
    })

    test("Extracts takeoff clearance when amongst other command", () => {
        const command = "BA423S200T360CTOA500"
        const expectedCommand = true

        const result = parseClearedForTakeoff(command)

        expect(result).toBe(expectedCommand)
    })

    test("Returns null if command incomplete", () => {
        const command = "J123CT"

        const result = parseClearedForTakeoff(command)

        expect(result).toBeNull()
    })

    test("Returns null if no taxi and hold command found", () => {
        const command = "J123S150"

        const result = parseClearedForTakeoff(command)

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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe('No valid commands')
    })

    test("Returns message with defined commands [Heading, Speed, Altitude]", () => {
        const commands = {
            callSign: 'BA123',
            speed: 340,
            heading: 50,
            altitude: 12000,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
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
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 cleared to land runway 27R")
    })

    test("Returns message with defined commands [Hold right]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: 1,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 hold to the right")
    })

    test("Returns message with defined commands [Taxi]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: '27R',
            clearedForTakeoff: undefined,
            goAround: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 taxi and hold 27R")
    })

    test("Returns message with defined commands [Takeoff]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: true,
            goAround: undefined,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 cleared for takeoff")
    })

    test("Returns message with defined commands [Go around]", () => {
        const commands = {
            callSign: 'BA123',
            speed: undefined,
            heading: undefined,
            altitude: undefined,
            waypoint: undefined,
            runway: undefined,
            hold: undefined,
            taxiAndHold: undefined,
            clearedForTakeoff: undefined,
            goAround: true,
        }

        const result = commandMessage(commands)

        expect(result).toBe("BA123 go around")
    })
})