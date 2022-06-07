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
        const startSpeed = getRandomNumberBetween(180, 260)
        const startHeading = getRandomNumberBetween(0, 359)
        const startAltitude = getRandomNumberBetween(5000, 10000)
        const weight = [1, 2, 3][Math.floor(Math.random() * 3)];
        const plane = new Aeroplane(callSign, startX, startY, startSpeed, startHeading, startAltitude, weight)
        this.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {

        // for (let x = 0; x < 8; x++) {
        //     // this.aeroplanes.push(new Aeroplane("BA123", 500, 300, 300, x))
        //     this.initArrival()
        // }
        this.aeroplanes = [
        new Aeroplane("BA123", 500, 450, 160, 90, 3000, 2),
        // new Aeroplane("BA456", 1000, 250, 160, 270, 5000, 1),
        // new Aeroplane("BA789", 500, 140, 140, 93, 6000),
        // new Aeroplane("BA111", 500, 150, 150, 94, 6000),
        // new Aeroplane("BA222", 500, 160, 160, 95, 6000),
        // new Aeroplane("BA333", 500, 170, 170, 96, 6000),
        // new Aeroplane("BA444", 500, 180, 180, 97, 6000),
        // new Aeroplane("BA555", 500, 190, 190, 98, 6000),
        // new Aeroplane("BA666", 500, 200, 200, 99, 6000),
        // new Aeroplane("BA777", 500, 210, 210, 100, 6000),
        // new Aeroplane("BA888", 500, 220, 220, 101, 6000),
        // new Aeroplane("BA888", 500, 230, 230, 102, 6000),
        // new Aeroplane("BA888", 500, 240, 240, 103, 6000),
        // new Aeroplane("BA888", 500, 250, 250, 104, 6000),
        // new Aeroplane("BA888", 500, 260, 260, 105, 6000),
        // new Aeroplane("BA888", 500, 270, 270, 106, 6000),
        // new Aeroplane("BA888", 500, 280, 280, 107, 6000),
        // new Aeroplane("BA888", 500, 290, 290, 108, 6000),
        // new Aeroplane("BA888", 500, 300, 300, 109, 6000),
        ]

        // this.aeroplanes.forEach(plane => {
        //     plane.setSpeed(220)
        // })
    }

    sendCommand = (rawCommand) => {
        const command = parseCommand(rawCommand)
        this.aeroplanes.forEach(plane => {
            if (plane.callSign === command.callSign) {
                if (command.speed) {
                    plane.setSpeed(command.speed)
                }
                if (command.heading) {
                    plane.setHeading(command.heading)
                }
                if (command.altitude) {
                    plane.setAltitude(command.altitude)
                }
                if (command.waypoint) {
                    plane.setWaypoint(command.waypoint)
                }
                if (command.runway) {
                    plane.setLanding(command.runway)
                }
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