export const parseCommand = (command) => {
    let callSign = command.substring(0, 5);
    let actionCommands = command.substring(5);
    return {
        callSign: callSign,
        speed: parseSpeed(actionCommands),
        heading: parseHeading(actionCommands),
        altitude: parseAltitude(actionCommands)
    }
}

export const commandMessage = (parsedCommand) => {
    return `${parsedCommand.callSign}\n${parsedCommand.speed ? ' Speed: ' + parsedCommand.speed + '\n' : ''}${parsedCommand.heading ? ' Heading: ' + parsedCommand.heading + '\n' : ''}${parsedCommand.altitude ? ' Altitude: ' + parsedCommand.altitude + '' : ''}`
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
    const match = command.match(/[CD](\d{1,2})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1)) * 1000
    }
    return null
}