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
        runway: parsedRunway
    }
}

export const commandMessage = (parsedCommand) => {
    return `${parsedCommand.callSign}` +
        `${parsedCommand.speed ? ' Speed: ' + parsedCommand.speed : ''}` +
        `${parsedCommand.heading ? ' Heading: ' + parsedCommand.heading : ''}` +
        `${parsedCommand.altitude ? ' Altitude: ' + parsedCommand.altitude + 'ft' : ''}` +
        `${parsedCommand.waypoint ? ' Waypoint: ' + parsedCommand.waypoint : ''}` +
        `${parsedCommand.runway ? ' Land: ' + parsedCommand.runway : ''}`
}

export const parseSpeed = (command) => {
    const match = command.match(/S(\d{2,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1))
    }
    return null
}

export const parseHeading = (command) => {
    const match = command.match(/H(\d{3})/g);
    if (match && match.length === 1) {
        let heading = parseInt(match[0].substring(1));
        return heading === 0 ? 360 : heading
    }
    return null
}

export const parseAltitude = (command) => {
    const match = command.match(/[CDcd](\d{1,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1)) * 100
    }
    return null
}

export const parseWaypoint = (command) => {
    const match = command.match(/[>](\w{3})/g);
    if (match && match.length === 1) {
        return match[0].substring(1)
    }
    return null
}

export const parseRunway = (command) => {
    const match = command.match(/\.\d{1,2}[LRC]\./g);
    if (match && match.length === 1) {
        return match[0].substring(1, match[0].length - 1)
    }
    return null
}