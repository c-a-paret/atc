import {getRandomNumberBetween, round, toRadians} from "../../utils/maths";
import {distance, isInsidePolygon} from "../../utils/geometry";
import {
    ARRIVAL,
    BASE_FUEL_CONSUMPTION_RATE,
    DEPARTURE,
    DEPARTURE_ALTITUDE,
    HORIZONTAL_SEPARATION_MINIMUM,
    LANDED_ALTITUDE,
    MIN_GROUND_CLEARANCE,
    NUM_PROJECTED_TICKS,
    SPEED_TAIL_LENGTH,
    VERTICAL_SEPARATION_MINIMUM
} from "../../config/constants";
import {
    FLYING,
    GOING_AROUND,
    HOLDING_PATTERN,
    HOLDING_SHORT,
    LANDING,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "./aeroplaneStates";
import {Speed} from "../Action/Speed";
import {Heading} from "../Action/Heading";
import {Altitude} from "../Action/Altitude";
import {Waypoint} from "../Action/Waypoint";
import {Landing} from "../Action/Landing";
import {HoldingPattern} from "../Action/HoldingPattern";
import {TaxiToRunway} from "../Action/TaxiToRunway";
import {Takeoff} from "../Action/Takeoff";
import {GoAround} from "../Action/GoAround";

export class Aeroplane {
    constructor(callSign, shortClass, x, y, speed, hdg, altitude, weight, type = ARRIVAL, state = FLYING, finalTarget = null, fuelLevel) {
        this.callSign = callSign;
        this.shortClass = shortClass;
        this.weight = weight;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
        this.altitude = altitude;
        this.type = type;
        this.state = state;
        this.finalTarget = finalTarget;
        this.fuelLevel = fuelLevel ? fuelLevel : this._determineStartingFuel();
        this.actions = []
        this.breachingProximity = false
        this.lastPositions = []
        this.nextPositions = []

        this.targetLocation = undefined
        this.targetAltitude = undefined
        this.targetSpeed = undefined
        this.aimingForRunway = undefined
        this.positionDescription = ''
        this.hasTakeoffClearance = false
    }

    hasFinalTarget = () => {
        return !!this.finalTarget
    }

    isArrival = () => {
        return this.type === ARRIVAL
    }

    isDeparture = () => {
        return this.type === DEPARTURE
    }

    addAction = (action) => {
        // Only Go Around overwrites Landing
        if (this.state === LANDING) {
            if (action.type() === 'GoAround') {
                this.actions = [action]
                this._update_targets()
                return
            } else {
                return
            }
        }

        // Landing overwrites everything
        if (action.type() === "Landing") {
            this.actions = [action]
            this._update_targets()
            return
        }

        for (let x = 0; x < this.actions.length; x++) {
            // replace same action
            if (this.actions[x].type() === action.type()) {
                this.actions[x] = action
                this._update_targets()
                return
            }
            // Directional actions override one another
            const directionalActions = ["HoldingPattern", "Heading", "Waypoint"]
            if (directionalActions.includes(action.type()) && directionalActions.includes(this.actions[x].type())) {
                this.actions[x] = action
                this._update_targets()
                return
            }
        }
        this.actions.push(action)
        this._update_targets()
    }

    setSpeed = (map, speed) => {
        const newSpeed = new Speed(map, this, speed);
        const {isValid, warnings, errors, targetValue} = newSpeed.validate();
        if (isValid) {
            this.addAction(newSpeed)
        }
        return {isValid, warnings, errors, targetValue}
    }

    setHeading = (map, heading) => {
        const newHeading = new Heading(map, this, heading.heading, heading.direction);
        const {isValid, warnings, errors, targetValue} = newHeading.validate();
        if (isValid) {
            this.addAction(newHeading)
            this.state = this.state === HOLDING_PATTERN ? FLYING : this.state
        }
        return {isValid, warnings, errors, targetValue}
    }

    setAltitude = (map, altitude) => {
        const newAltitude = new Altitude(map, this, altitude);
        const {isValid, warnings, errors, targetValue} = newAltitude.validate();
        if (isValid) {
            this.addAction(newAltitude)
        }
        return {isValid, warnings, errors, targetValue}
    }

    setWaypoint = (map, waypoint) => {
        const newWaypoint = new Waypoint(map, this, waypoint);
        const {isValid, warnings, errors, targetValue} = newWaypoint.validate();

        if (isValid) {
            this.addAction(newWaypoint)
            this.state = this.state === HOLDING_PATTERN ? FLYING : this.state
        }
        return {isValid, warnings, errors, targetValue}
    }

    clearForLanding = (map, runway) => {
        const newLanding = new Landing(map, this, runway);
        const {isValid, warnings, errors, targetValue} = newLanding.validate();
        if (isValid) {
            this.addAction(newLanding)
            this.aimingForRunway = runway
            this.state = LANDING
        }
        return {isValid, warnings, errors, targetValue}
    }

    setHold = (map, direction) => {
        const newHoldingPattern = new HoldingPattern(map, this, direction);
        const {isValid, warnings, errors, targetValue} = newHoldingPattern.validate();
        if (isValid) {
            this.addAction(newHoldingPattern)
            this.state = HOLDING_PATTERN
        }
        return {isValid, warnings, errors, targetValue}
    }

    setTaxiAndHold = (map, runway) => {
        const newTaxiAndHold = new TaxiToRunway(map, this, runway);
        const {isValid, warnings, errors, targetValue} = newTaxiAndHold.validate();
        if (isValid) {
            this.addAction(newTaxiAndHold)
            this.state = TAXIING
        }
        return {isValid, warnings, errors, targetValue}
    }

    clearForTakeoff = (map) => {
        const takeoff = new Takeoff(map, this);
        const {isValid, warnings, errors, targetValue} = takeoff.validate();
        if (isValid) {
            this.addAction(takeoff)
            this.hasTakeoffClearance = true
            // Takeoff state is set when applying the action as it is future actionable
        }
        return {isValid, warnings, errors, targetValue}
    }

    goAround = (map) => {
        const goAround = new GoAround(map, this, this.aimingForRunway);
        const {isValid, warnings, errors, targetValue} = goAround.validate();
        if (isValid) {
            this.addAction(goAround)
            this.state = GOING_AROUND
        }
        return {isValid, warnings, errors, targetValue}
    }

    is = (states) => {
        return states.includes(this.state)
    }

    isNot = (states) => {
        return !this.is(states)
    }

    applyActions = () => {
        this.actions.forEach(action => {
            if (action.isActionable()) {
                action.apply()
            }
        })

        if ([READY_TO_TAXI, TAXIING, HOLDING_SHORT].includes(this.state)) {
            this._clean_actions()
            return
        }

        const headingRadians = toRadians(this.heading)
        const distancePerTick = 1 + (Math.max(30, this.speed - 100) / 20 * 0.5)
        this.x = round(this.x + distancePerTick * Math.sin(headingRadians), 2);
        this.y = round(this.y - distancePerTick * Math.cos(headingRadians), 2);

        this.updateLastPositions(this.x, this.y)

        this._clean_actions()
    }

    simulatePath = (map, restrictedZones) => {
        if (this.isLanding()) {
            this.nextPositions = []
        } else {
            const simulatedAeroplane = new Aeroplane(null, null, this.x, this.y, this.speed, this.heading, this.altitude, this.weight, this.type, this.state, this.finalTarget, this.fuelLevel)
            this.actions.forEach(action => {
                const copiedAction = action.copy(simulatedAeroplane);
                if (copiedAction) {
                    simulatedAeroplane.actions.push(copiedAction)
                }
            })

            if (this.positionDescription) {
                simulatedAeroplane.positionDescription = this.positionDescription
            }

            const projectedLocations = []
            let altitudeMarker = false
            let speedMarker = false
            for (let x = 0; x < NUM_PROJECTED_TICKS; x++) {
                simulatedAeroplane.applyActions()

                let baseLocation = {
                    x: simulatedAeroplane.x,
                    y: simulatedAeroplane.y,
                    headingAtPoint: simulatedAeroplane.heading,
                    markers: []
                }

                // Altitude achieved
                if (!altitudeMarker && this.isChangingAltitude() && simulatedAeroplane.altitude === this.targetAltitude) {
                    baseLocation.markers.push({type: 'altitude'})
                    altitudeMarker = true
                }

                // Speed achieved
                if (!speedMarker && simulatedAeroplane.is([HOLDING_PATTERN, FLYING]) && this.isChangingSpeed() && simulatedAeroplane.speed === this.targetSpeed) {
                    baseLocation.markers.push({type: 'speed'})
                    speedMarker = true
                }

                // Breaching ground clearance
                if (simulatedAeroplane.is([HOLDING_PATTERN, FLYING]) && simulatedAeroplane.altitude < MIN_GROUND_CLEARANCE) {
                    baseLocation.markers.push({type: 'breaching'})
                }

                // Breaching restricted zone
                restrictedZones.forEach(zone => {
                    if (simulatedAeroplane.is([HOLDING_PATTERN, FLYING]) && simulatedAeroplane.breachingRestrictedZone(map, zone)) {
                        baseLocation.markers.push({type: 'breaching'})
                    }
                })

                projectedLocations.push(baseLocation)
            }
            this.nextPositions = projectedLocations
        }
    }

    updateLastPositions = (x, y) => {
        if (this.lastPositions.length === SPEED_TAIL_LENGTH + 1) {
            this.lastPositions = this.lastPositions.slice(1)
        }

        this.lastPositions.push({x: x, y: y})
    }

    withinPosition = (x, y) => {
        const minX = x - 30
        const maxX = x + 30
        const minY = y - 30
        const maxY = y + 30
        const withinX = (minX < this.x && this.x < maxX)
        const withinY = (minY < this.y && this.y < maxY)
        return withinX && withinY
    }

    isArrivalOutsideBoundaries = (mapBoundaries, outsideCallback) => {
        if (this.isArrival()) {
            const outside = this._isOutsideBoundaries(mapBoundaries)
            if (outside && outsideCallback) {
                outsideCallback()
            }
            return outside
        }
        return false
    }

    isDepartureOutsideBoundaries = (mapBoundaries, correctlyDepartedCallback, incorrectlyDepartedCallback) => {
        if (this.isDeparture()) {
            const outside = this._isOutsideBoundaries(mapBoundaries)
            if (outside && this.hasFinalTarget() && incorrectlyDepartedCallback) {
                incorrectlyDepartedCallback()
                return true
            }
            if (outside && !this.hasFinalTarget() && correctlyDepartedCallback) {
                correctlyDepartedCallback()
                return true
            }
            return false
        }
        return false
    }

    hasDeparted = (map, correctlyDepartedCallback) => {
        if (this.isDeparture()) {
            const correctAltitude = this.altitude >= DEPARTURE_ALTITUDE
            const waypoint = map.getWaypointInfo(this.finalTarget)
            const correctLocation = waypoint && distance(this.x, this.y, waypoint.x, waypoint.y) <= 5
            if (correctlyDepartedCallback && correctAltitude && correctLocation) {
                correctlyDepartedCallback()
                return true
            }
        }
        return false
    }

    isLanding = () => {
        return this.state === LANDING
    }

    isInHoldingPattern = () => {
        return this.state === HOLDING_PATTERN
    }

    isChangingAltitude = () => {
        return this.actions.length > 0 && this.actions.map(action => action.type()).includes("Altitude")
    }

    isChangingSpeed = () => {
        return this.actions.length > 0 && this.actions.map(action => action.type()).includes("Speed")
    }

    hasLanded = (map, correctRunwayCallback, incorrectRunwayCallback) => {
        if (this.isArrival()) {
            const landed = this.altitude < LANDED_ALTITUDE;
            const correctRunway = this.finalTarget ? this.landedCorrectRunway(map) : true
            if (landed) {
                if (correctRunway && correctRunwayCallback) {
                    correctRunwayCallback()
                }
                if (!correctRunway && incorrectRunwayCallback) {
                    incorrectRunwayCallback()
                }
            }
            return landed
        }
        return false
    }

    landedCorrectRunway = (map) => {
        const runway = map.getRunwayInfo(this.finalTarget)
        return distance(this.x, this.y, runway.landingZone.x, runway.landingZone.y) <= 5
    }

    proximalTo = (otherAeroplane) => {
        if (this.is([TAKING_OFF,FLYING, HOLDING_PATTERN, GOING_AROUND]) && otherAeroplane.is([TAKING_OFF, FLYING, HOLDING_PATTERN, GOING_AROUND])) {
            const horizontalDistance = distance(this.x, this.y, otherAeroplane.x, otherAeroplane.y);
            const verticalDistance = Math.abs(this.altitude - otherAeroplane.altitude)
            return horizontalDistance < HORIZONTAL_SEPARATION_MINIMUM
                && verticalDistance < VERTICAL_SEPARATION_MINIMUM
        }
    }

    breachingRestrictedZone = (map, zone) => {
        const planeInverseY = map.maxY - this.y
        return isInsidePolygon(zone.boundaries, this.x, planeInverseY) && this.breachingZoneAltitudeRestriction(zone)
    }

    breachingZoneAltitudeRestriction = (zone) => {
        if (zone.minAltitude === null && zone.maxAltitude === null) {
            return true
        }
        if (zone.minAltitude !== null && zone.maxAltitude === null) {
            return this.altitude < zone.minAltitude
        }
        return this.altitude < zone.minAltitude || this.altitude > zone.maxAltitude
    }

    breachingGroundClearance = () => {
        return !this.isLanding() && this.is([HOLDING_PATTERN, FLYING]) && this.altitude < MIN_GROUND_CLEARANCE
    }

    markBreachingProximityLimits = () => {
        this.breachingProximity = true
    }

    markAdheringProximityLimits = () => {
        this.breachingProximity = false
    }

    outOfFuel = (outOfFuelCallback) => {
        const outOfFuel = this.fuelLevel <= 0;
        if (outOfFuel) {
            outOfFuelCallback()
        }
        return outOfFuel
    }

    consumeFuel = () => {
        if (this.fuelLevel - BASE_FUEL_CONSUMPTION_RATE <= 0) {
            this.fuelLevel = 0
        } else {
            let rate = BASE_FUEL_CONSUMPTION_RATE

            rate += this._stateFuelConsumptionRate()

            if (this.targetAltitude && this.targetAltitude > this.altitude) {
                rate += 0.04
            } else {
                rate -= 0.005
            }
            if (this.speed >= 240) {
                rate += 0.04
            }
            if (this.speed <= 200) {
                rate -= 0.005
            }
            if (this.altitude < 5000) {
                rate -= 0.005
            }
            this.fuelLevel -= rate
        }
    }

    _clean_actions = () => {
        this.actions = this.actions.filter(action => action.isFutureActionable() || action.isActionable())
        this._clear_targets()
    }

    _isOutsideBoundaries = (mapBoundaries) => {
        const outsideX = (this.x < mapBoundaries.minX || this.x > mapBoundaries.maxX)
        const outsideY = (this.y < mapBoundaries.minY || this.y > mapBoundaries.maxY)
        return outsideX || outsideY
    }

    _determineStartingFuel = () => {
        if (this.isArrival()) {
            return getRandomNumberBetween(20, 30)
        } else {
            return getRandomNumberBetween(95, 100)
        }
    }

    _stateFuelConsumptionRate = () => {
        const consumptionRateMap = {
            READY_TO_TAXI: 0.1,
            TAXIING: 0.1,
            HOLDING_SHORT: 0.1,
            TAKING_OFF: 0.5,
            FLYING: 0,
            LANDING: 0,
            HOLDING_PATTERN: 0,
            GOING_AROUND: 0,
        }
        return this.state ? consumptionRateMap[this.state] : 0
    }

    _clear_targets = () => {
        const activeActions = this.actions.map(action => action.type())
        if (activeActions.every(action => !["Waypoint", "Heading", "Landing"].includes(action))) {
            this.targetLocation = undefined
        }
        this.targetAltitude = activeActions.includes('Altitude') ? this.targetAltitude : undefined
        this.targetSpeed = activeActions.includes('Speed') ? this.targetSpeed : undefined
    }

    _update_targets = () => {
        // Add targets from current actions
        this.actions.forEach(action => {
            if (action.type() === "Waypoint") {
                this.targetLocation = action.targetWaypoint
            }
            if (["Heading", "Landing"].includes(action.type())) {
                this.targetLocation = action.targetValue
            }
            if (action.type() === "Altitude") {
                this.targetAltitude = action.targetValue
            }
            if (action.type() === "Speed") {
                this.targetSpeed = action.targetValue
            }
        })
    }
}
