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

    sendCommand = (rawCommand) => {
        const command = parseCommand(rawCommand)
        let callSign;
        let speedSet;
        let headingSet;
        let altitudeSet;
        let waypointSet;
        let runwaySet;
        let holdSet;
        let taxiAndHoldSet;
        let clearedForTakeoff;
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
                if (command.taxiAndHold) {
                    taxiAndHoldSet = plane.setTaxiAndHold(this.map, command.taxiAndHold)
                }
                if (command.clearedForTakeoff) {
                    // TODO: Implement properly
                    clearedForTakeoff = command.clearedForTakeoff
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
            "hold": holdSet,
            "taxiAndHold": taxiAndHoldSet,
            "clearedForTakeoff": clearedForTakeoff
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

        // With ground
        this.aeroplanes.forEach(plane => {
            if (plane.breachingGroundClearance()) {
                plane.markBreachingProximityLimits()
            }
        })
    }
}