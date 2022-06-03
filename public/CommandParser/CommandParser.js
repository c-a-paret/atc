export const parseCommand = (command) => {
    return {
        "callSign": command.substring(0, 5),
        "speed": parseSpeed(command)
    }
}

export const parseSpeed = (command) => {
    const match = command.match(/S(\d{2,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1))
    }
    return null
}
