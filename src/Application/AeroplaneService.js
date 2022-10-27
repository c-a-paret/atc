import {parseCommand} from "../Command/CommandParser/CommandParser";
import {Flying} from "../Domain/Aeroplane/states/Flying";
import {FLYING} from "../Domain/Aeroplane/aeroplaneStates";

export class AeroplaneService {
    constructor(map, statsService, weather) {
        this.aeroplanes = []
        this.map = map
        this.statsService = statsService
        this.weather = weather

        this.state = undefined
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

        let passedCommands = {
            "callSign": undefined,
            "speed": {passed: false},
            "heading": {passed: false},
            "altitude": {passed: false},
            "waypoint": {passed: false},
            "runway": {passed: false},
            "hold": {passed: false},
            "taxiAndHold": {passed: false},
            "clearedForTakeoff": {passed: false},
            "goAround": {passed: false},
        }

        this.aeroplanes.forEach(plane => {
            if (plane.callSign === command.callSign) {
                passedCommands.callSign = plane.callSign

                if (command.speed) {
                    passedCommands.speed = {...plane.setSpeed(this.map, command.speed), passed: true}
                }
                if (command.heading) {
                    passedCommands.heading = {...plane.setHeading(this.map, command.heading), passed: true}
                }
                if (command.altitude) {
                    passedCommands.altitude = {...plane.setAltitude(this.map, command.altitude), passed: true}
                }
                if (command.waypoint) {
                    passedCommands.waypoint = {...plane.setWaypoint(this.map, command.waypoint), passed: true}
                }
                if (command.runway) {
                    passedCommands.runway = {...plane.clearForLanding(this.map, command.runway), passed: true}
                }
                if (command.hold) {
                    passedCommands.hold = {...plane.setHold(this.map, command.hold), passed: true}
                }
                if (command.taxiAndHold) {
                    passedCommands.taxiAndHold = {...plane.setTaxiAndHold(this.map, command.taxiAndHold), passed: true}
                }
                if (command.clearedForTakeoff) {
                    passedCommands.clearedForTakeoff = {...plane.clearForTakeoff(this.map), passed: true}
                }
                if (command.goAround) {
                    passedCommands.goAround = {...plane.goAround(this.map), passed: true}
                }
            }
        })

        return passedCommands
    }

    hasEmergencyPlane = () => {
        return this.aeroplanes.some(plane => plane.state.isEmergency)
    }

    clearEmergencies = () => {
        this.aeroplanes.map(plane => {
            if (plane.state.isEmergency) {
                plane.transitionTo(new Flying())
            }
        })
    }

    flyingPlanes = () => {
        return this.aeroplanes.filter(plane => plane.is([FLYING]))
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
            if (
                plane.isArrivalOutsideBoundaries(
                    this.map.mapBoundaries,
                    this.statsService.incrementLost) ||
                plane.isDepartureOutsideBoundaries(
                    this.map.mapBoundaries,
                    this.statsService.incrementCorrectlyDeparted,
                    this.statsService.incrementIncorrectlyDeparted) ||
                plane.hasDeparted(
                    this.map,
                    this.statsService.incrementCorrectlyDeparted
                ) ||
                plane.hasLanded(
                    this.map,
                    this.statsService.incrementCorrectlyLanded,
                    this.statsService.incrementIncorrectlyLanded,
                ) ||
                plane.outOfFuel(
                    this.statsService.incrementOutOfFuelCount
                )
            ) {
                this.aeroplanes = this.aeroplanes.filter(activePlane => activePlane !== plane)
            }
        })
    }

    applyActions = () => {
        this.state.applyActions(this.map, this.weather)
    }

    consumeFuel = () => {
        this.aeroplanes.forEach(plane => {
            plane.consumeFuel()
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
            this.map.features.restrictedZones.forEach(zone => {
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
