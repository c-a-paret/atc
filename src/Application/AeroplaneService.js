import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {AIRCRAFT, getRandomNumberBetween} from "../utils/common";
import {parseCommand} from "../Command/CommandParser/CommandParser";

export class AeroplaneService {
    constructor(mapBoundaries) {
        this.aeroplanes = []
        this.mapBoundaries = mapBoundaries
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

    initTestAeroplanes = () => {

        // for (let x = 0; x < 360; x++) {
        //     this.aeroplanes.push(new Aeroplane("BA123", 500, 300, 300, x))
        // }
        this.aeroplanes = [
            new Aeroplane("BA123", 500, 300, 120, 5, 5000),
            new Aeroplane("BA456", 500, 350, 120, 90, 10000),
            // new Aeroplane("BA789", 500, 300, 120, 92),
            // new Aeroplane("BA789", 500, 300, 120, 93),
            // new Aeroplane("BA789", 500, 300, 120, 94),
            // new Aeroplane("BA789", 500, 300, 120, 95),
            // new Aeroplane("BA789", 500, 300, 120, 96),
            // new Aeroplane("BA789", 500, 300, 120, 97),
            // new Aeroplane("BA789", 500, 300, 120, 98),
            // new Aeroplane("BA789", 500, 300, 120, 99),
            // new Aeroplane("BA789", 500, 300, 120, 100),
        ]
    }

    sendCommand = (rawCommand) => {
        const command = parseCommand(rawCommand)
        this.aeroplanes.forEach(plane => {
            if (plane.callSign === command.callSign) {
                plane.setSpeed(command.speed)
                plane.setHeading(command.heading)
                plane.setAltitude(command.altitude)
            }
        })
        return command
    }

    getCallSignByPosition = (x, y) => {
        for (let n = 0; n < this.aeroplanes.length; n++) {
            let plane = this.aeroplanes[n]
            if (plane.withinPosition(x, y)) {
                return plane.callSign
            }
        }
        return null
    }

    deactivateAeroplanes = () => {
        this.aeroplanes.forEach(plane => {
            if (plane.isOutsideBoundaries(this.mapBoundaries)) {
                plane.makeInactive()
            }
        })
    }
}