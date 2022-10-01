export const parseCommand = (rawCommand) => {
    const command = rawCommand.toUpperCase()
    let callSign = command.substring(0, 5).toUpperCase();
    let actionCommands = command.substring(5);
    let parsedHeading = parseHeading(actionCommands);
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

export const commandMessage = (passedCommands) => {
    if (passedCommands.callSign === undefined) {
        return {success: false, callSign: null, messages: [{state: 'error', text:'Unrecognised aircraft'}]}
    }

    return {
        success: true,
        callSign: passedCommands.callSign,
        messages: [
            buildMessage(passedCommands.speed, 'Speed:'),
            buildMessage(passedCommands.heading, 'Heading:'),
            buildMessage(passedCommands.altitude, 'Altitude:', 'ft'),
            buildMessage(passedCommands.waypoint, 'Direct to'),
            buildMessage(passedCommands.runway, 'Cleared to land runway'),
            buildGoAroundMessage(passedCommands.goAround, 'Go around'),
            buildMessage(passedCommands.taxiAndHold, 'Taxi and hold'),
            buildTakeoffMessage(passedCommands.clearedForTakeoff, 'Cleared for takeoff'),
            buildHoldingPatternMessage(passedCommands.hold, 'Hold to the')
        ].filter(message => !!message)
    }
}

const buildMessage = (aspect, prefix, suffix) => {
    if (aspect.passed) {
        if (aspect.isValid) {
            return {
                state: 'valid',
                text: `${prefix} ${aspect.targetValue}${suffix ? suffix : ''}`
            }
        }
        return handleInvalidAspect(aspect)
    }
    return null
}

const buildTakeoffMessage = (aspect, prefix) => {
    if (aspect.passed) {
        if (aspect.isValid) {
            return {
                state: 'valid',
                text: `${prefix}`
            }
        }
        return handleInvalidAspect(aspect)
    }
    return null
}

const buildGoAroundMessage = (aspect, prefix) => {
    if (aspect.passed) {
        if (aspect.isValid) {
            return {
                state: 'valid',
                text: `${prefix}`
            }
        }
        return handleInvalidAspect(aspect)
    }
    return null
}

const buildHoldingPatternMessage = (aspect, prefix) => {
    if (aspect.passed) {
        if (aspect.isValid) {
            return {
                state: 'valid',
                text: `${prefix} ${aspect.targetValue === -1 ? 'left' : 'right'}`
            }
        }
        return handleInvalidAspect(aspect)
    }
    return null
}

const handleInvalidAspect = (aspect) => {
    if (aspect.errors.length > 0) {
        return {
            state: 'error',
            text: aspect.errors[0]
        }
    }
    if (aspect.warnings.length > 0) {
        return {
            state: 'warning',
            text: aspect.warnings[0]
        }
    }
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

