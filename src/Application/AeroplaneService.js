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
            {x: 0.2 * this.mapBoundaries.maxX, y: 1, heading: 135},
            {x: 0.5 * this.mapBoundaries.maxX, y: 1, heading: 135},
            {x: 0.8 * this.mapBoundaries.maxX, y: 1, heading: 225},
            {x: 1, y: 0.33 * this.mapBoundaries.maxY, heading: 110},
            {x: 1, y: 0.66 * this.mapBoundaries.maxY, heading: 80},
            {x: this.mapBoundaries.maxX - 1, y: 0.33 * this.mapBoundaries.maxY, heading: 260},
            {x: this.mapBoundaries.maxX - 1, y: 0.66 * this.mapBoundaries.maxY, heading: 280},
            {x: 0.2 * this.mapBoundaries.maxX, y: this.mapBoundaries.maxY, heading: 20},
            {x: 0.5 * this.mapBoundaries.maxX, y: this.mapBoundaries.maxY, heading: 360},
            {x: 0.8 * this.mapBoundaries.maxX, y: this.mapBoundaries.maxY, heading: 340},
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

        // for (let x = 0; x < this.spawnLocations.length; x++) {
        //     const callSign = `${AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)].operatorIATA}${getRandomNumberBetween(100, 999)}`
        //     const location = this.spawnLocations[x];
        //     const startX = location.x
        //     const startY = location.y
        //     const startHeading = location.heading
        //     const aeroplane = new Aeroplane(callSign, startX, startY, 120, startHeading, 2800, 1)
        //     this.aeroplanes.push(aeroplane)
        // }
        this.aeroplanes = [
            new Aeroplane("BA123", 470, 425, 200, 90, 2800, 1),
            // new Aeroplane("BA456", 500, 300, 200, 90, 3000, 1),
            // new Aeroplane("BA789", 500, 400, 200, 135, 6000, 1),
            // new Aeroplane("BA101", 500, 500, 200, 180, 6000, 1),
            // new Aeroplane("BA112", 500, 250, 200, 305, 6000, 1),
            // new Aeroplane("BA131", 500, 350, 200, 270, 6000, 1),
            // new Aeroplane("BA415", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA161", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA171", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA181", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA191", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA202", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA212", 500, 450, 200, 225, 6000, 1),
        ]

        // this.aeroplanes.forEach(plane => {
        //     plane.setLanding(this.map, "9L")
        // })
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
            if (plane.isOutsideBoundaries(this.mapBoundaries, this.statsService.incrementExited) || plane.hasLanded(this.statsService.incrementLanded)) {
                this.aeroplanes = this.aeroplanes.filter(activePlane => activePlane !== plane)
            }
        })
    }

    markAeroplanesBreakingProximity = () => {
        this.aeroplanes.forEach(plane => {
            plane.markAdheringProximityLimits()
        })

        // With other aeroplanes
        this.aeroplanes.forEach(plane => {
            this.aeroplanes.forEach(comparisonPlane => {
                if (plane.callSign !== comparisonPlane.callSign) {
                    if (comparisonPlane.proximalTo(plane)) {
                        plane.markBreachingProximityLimits()
                        comparisonPlane.markBreachingProximityLimits()
                    }
                }
            })
        })

        // With restricted zones
        this.aeroplanes.forEach(plane => {
            this.map.features.exclusionZones.forEach(zone => {
                if (plane.breachingRestrictedZone(this.map, zone)) {
                    plane.markBreachingProximityLimits()
                }
            })
        })

        if (this.aeroplanes.some(plane => plane.breachingProximity)) {
            this.statsService.startProximityTimer()
        } else {
            this.statsService.stopProximityTimer()
        }
    }
}