export const parseCommand = (rawCommand) => {
    const command = rawCommand.toUpperCase()
    let callSign = command.substring(0, 5).toUpperCase();
    let actionCommands = command.substring(5);
    let parsedHeading = parseHeading(actionCommands);
    // debugger
    let parsedWaypoint = parseWaypoint(actionCommands);
    let parsedRunway = parseRunway(actionCommands)

    const heading = parsedWaypoint || parsedRunway ? null : parsedHeading
    const waypoint = parsedHeading || parsedRunway ? null : parsedWaypoint

    return {
        callSign: callSign,
        speed: parseSpeed(actionCommands),
        heading: heading,
        altitude: parseAltitude(actionCommands),
        waypoint: waypoint,
        runway: parsedRunway,
        hold: parseHold(actionCommands),
        taxiAndHold: parseTaxiAndHold(actionCommands),
        clearedForTakeoff: parseClearedForTakeoff(command),
        goAround: parseGoAround(command)
    }
}

export const commandMessage = (acceptedCommands) => {
    if ([
        acceptedCommands.callSign,
        acceptedCommands.speed,
        acceptedCommands.heading,
        acceptedCommands.altitude,
        acceptedCommands.waypoint,
        acceptedCommands.runway,
        acceptedCommands.hold,
        acceptedCommands.taxiAndHold,
        acceptedCommands.clearedForTakeoff,
        acceptedCommands.goAround
    ].every(value => value === undefined)) {
        return 'Unrecognised command'
    }
    if ([acceptedCommands.speed,
        acceptedCommands.heading,
        acceptedCommands.altitude,
        acceptedCommands.waypoint,
        acceptedCommands.runway,
        acceptedCommands.hold,
        acceptedCommands.taxiAndHold,
        acceptedCommands.clearedForTakeoff,
        acceptedCommands.goAround
    ].every(value => value === undefined)) {
        return 'No valid commands'
    }
    return `${acceptedCommands.callSign}` +
        `${acceptedCommands.speed ? ' Speed: ' + acceptedCommands.speed : ''}` +
        `${acceptedCommands.heading ? ' Heading: ' + acceptedCommands.heading : ''}` +
        `${acceptedCommands.altitude ? ' Altitude: ' + acceptedCommands.altitude + 'ft' : ''}` +
        `${acceptedCommands.waypoint ? ' Waypoint: ' + acceptedCommands.waypoint : ''}` +
        `${acceptedCommands.runway ? ' cleared to land runway ' + acceptedCommands.runway : ''}` +
        `${acceptedCommands.goAround ? ' go around' : ''}` +
        `${acceptedCommands.taxiAndHold ? ' taxi and hold ' + acceptedCommands.taxiAndHold : ''}` +
        `${acceptedCommands.clearedForTakeoff ? ' cleared for takeoff' : ''}` +
        `${Math.abs(acceptedCommands.hold) === 1 ? ` hold to the ${acceptedCommands.hold === 1 ? 'right' : 'left'}` : ''}`
}

export const parseSpeed = (command) => {
    const match = command.match(/S(\d{2,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1))
    }
    return null
}

export const parseHeading = (command) => {
    const match = command.match(/T(\d{3})/g);
    if (match && match.length === 1) {
        let heading = parseInt(match[0].substring(1));
        return heading === 0 ? 360 : heading
    }
    return null
}

export const parseAltitude = (command) => {
    const match = command.match(/[A](\d{1,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1)) * 100
    }
    return null
}

export const parseWaypoint = (command) => {
    const match = command.match(/[-]([a-zA-Z]{3})/g);
    if (match && match.length === 1) {
        return match[0].substring(1)
    }
    return null
}

export const parseRunway = (command) => {
    const matches = command.match(/(.)*?ILS(\d{1,2}[LRC])(.)*?/);
    if (matches) {
        return matches[2]
    }
    return null
}

export const parseHold = (command) => {
    const match = command.match(/H[LR]/g);
    if (match && match.length === 1) {
        return match[0][1] === "R" ? 1 : -1
    }
    return null
}

export const parseTaxiAndHold = (command) => {
    const matches = command.match(/(.)*?TH(\d{1,2}[LRC])(.)*?/);
    if (matches) {
        return matches[2]
    }
    return null
}

export const parseClearedForTakeoff = (command) => {
    const matches = command.match(/(.)*?(CTO)(.)*?/);
    if (matches) {
        return matches[2] === "CTO"
    }
    return null
}

export const parseGoAround = (command) => {
    const matches = command.match(/(.)*?(GA)(.)*?/);
    if (matches) {
        return matches[2] === "GA"
    }
    return null
}

