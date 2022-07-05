import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {parseCommand} from "../Command/CommandParser/CommandParser";

export class AeroplaneService {
    constructor(map, statsService, initialState) {
        this.aeroplanes = []
        this.map = map
        this.statsService = statsService

        this.state = undefined
        this.transitionTo(initialState)
    }

    transitionTo = (state) => {
        this.state = state
        this.state.setMachine(this)
        this.state.setMap(this.map)
    }

    tick = () => {
        this.state.tick()
    }

    clear = () => {
        this.aeroplanes = []
        this.statsService.reset()
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
            new Aeroplane("BA123", "A321", 1300, 425, 200, 90, 6000, 1),
            // new Aeroplane("BA999", "A321", 300, 425, 200, 90, 6000, 1),
            // new Aeroplane("BA789", "A321", 500, 400, 200, 135, 6000, 1),
            // new Aeroplane("BA101", "A321", 500, 500, 200, 180, 6000, 1),
            // new Aeroplane("BA112", "A321", 500, 250, 200, 305, 6000, 1),
            // new Aeroplane("BA131", "A321", 500, 350, 200, 270, 6000, 1),
            // new Aeroplane("BA415", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA161", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA171", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA181", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA191", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA202", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA212", "A321", 500, 450, 200, 225, 6000, 1),
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
        let holdSet;
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
                if (command.hold) {
                    holdSet = plane.setHold(this.map, command.hold)
                }
            }
        })
        return {
            "callSign": callSign,
            "speed": speedSet,
            "heading": headingSet,
            "altitude": altitudeSet,
            "waypoint": waypointSet,
            "runway": runwaySet,
            "hold": holdSet
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
            if (plane.isOutsideBoundaries(this.map.mapBoundaries, this.statsService.incrementExited) || plane.hasLanded(this.statsService.incrementLanded)) {
                this.aeroplanes = this.aeroplanes.filter(activePlane => activePlane !== plane)
            }
        })
    }

    applyActions = () => {
        this.aeroplanes.forEach(plane => {
            plane.applyActions()
            plane.simulatePath()
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
    }
}