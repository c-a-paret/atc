import {Aeroplane} from "../Elements/Aeroplane";
import {AIRCRAFT, getRandomNumberBetween} from "../common";
import {parseCommand} from "../Command/CommandParser/CommandParser";

export class AeroplaneService {
    constructor() {
        this.aeroplanes = []
    }

    initArrival = () => {
        const callSign = `${AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)].operatorIATA}${getRandomNumberBetween(100, 999)}`
        const startX = getRandomNumberBetween(100, 1100)
        const startY = getRandomNumberBetween(100, 800)
        const startSpeed = getRandomNumberBetween(100, 300)
        const startHeading = getRandomNumberBetween(0, 359)
        const plane = new Aeroplane(callSign, startX, startY, startSpeed, startHeading)
        this.aeroplanes.push(plane)
    }

    sendCommand = (rawCommand) => {
        const command = parseCommand(rawCommand)
        this.aeroplanes.forEach(plane => {
            if (plane.callSign === command.callSign) {
                plane.setSpeed(command.speed)
            }
        })
    }
}