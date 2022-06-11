import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {parseCommand} from "../Command/CommandParser/CommandParser";
import {AIRCRAFT} from "../config/aircraft";

export class AeroplaneService {
    constructor(map, mapBoundaries) {
        this.aeroplanes = []
        this.map = map
        this.mapBoundaries = mapBoundaries
        this.statsService = null
        this.spawnLocations = [
            {x: 0.33 * this.mapBoundaries.maxX, y: 1, heading: 135},
            {x: 0.5 * this.mapBoundaries.maxX, y: 1, heading: 135},
            {x: 0.8 * this.mapBoundaries.maxX, y: 1, heading: 225},
            {x: 1, y: 0.33 * this.mapBoundaries.maxY, heading: 110},
            {x: this.mapBoundaries.maxX - 1, y: 0.66 * this.mapBoundaries.maxY, heading: 300},
            {x: 0.6 * this.mapBoundaries.maxX, y: this.mapBoundaries.maxY, heading: 300},
        ]
    }

    setStatsService = (statsService) => {
        this.statsService = statsService
    }

    initArrival = () => {
        const callSign = `${AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)].operatorIATA}${getRandomNumberBetween(100, 999)}`
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(180, 260), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(5000, 8000), 500)
        const weight = [1, 2, 3][Math.floor(Math.random() * 3)];
        const plane = new Aeroplane(callSign, startX, startY, startSpeed, startHeading, startAltitude, weight)
        plane.setWaypoint(this.map, this.map.defaultWaypoint)
        this.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {

        // for (let x = 0; x < 8; x++) {
        //     // this.aeroplanes.push(new Aeroplane("BA123", 500, 300, 300, x))
        //     this.initArrival()
        // }
        this.aeroplanes = [
            new Aeroplane("BA123", 990, 411, 200, 270, 2800, 1),
            new Aeroplane("BA456", 990, 431, 160, 270, 3000, 1),
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

        this.aeroplanes.forEach(plane => {
            plane.setLanding(this.map, "9L")
        })
    }

    sendCommand = (rawCommand) => {
        const command = parseCommand(rawCommand)
        let callSign;
        let speedSet;
        let headingSet;
        let altitudeSet;
        let waypointSet;
        let runwaySet;
        this.aeroplanes.forEach(plane => {
            if (plane.callSign === command.callSign) {
                callSign = plane.callSign

                if (command.speed) {
                    speedSet = plane.setSpeed(this.map, command.speed)
                }
                if (command.heading) {
                    headingSet = plane.setHeading(this.map, command.heading)
                }
                if (command.altitude) {
                    altitudeSet = plane.setAltitude(this.map, command.altitude)
                }
                if (command.waypoint) {
                    waypointSet = plane.setWaypoint(this.map, command.waypoint)
                }
                if (command.runway) {
                    runwaySet = plane.setLanding(this.map, command.runway)
                }
            }
        })
        return {
            "callSign": callSign,
            "speed": speedSet,
            "heading": headingSet,
            "altitude": altitudeSet,
            "waypoint": waypointSet,
            "runway": runwaySet
        }
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
            if (plane.active && (plane.isOutsideBoundaries(this.mapBoundaries, this.statsService.incrementExited) || plane.hasLanded(this.statsService.incrementLanded))) {
                plane.makeInactive()
            }
        })
    }
}