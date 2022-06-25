import {Altitude, Heading, Landing, Speed, Waypoint} from "../Action/Action";
import {round, toRadians} from "../../utils/maths";
import {distance, isInsidePolygon} from "../../utils/geometry";
import {
    HORIZONTAL_SEPARATION_MINIMUM,
    LANDED_ALTITUDE, LANDING_SPEED,
    SPEED_TAIL_LENGTH,
    VERTICAL_SEPARATION_MINIMUM
} from "../../config/constants";

export class Aeroplane {
    constructor(callSign, x, y, speed, hdg, altitude, weight) {
        this.callSign = callSign;
        this.weight = weight;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
        this.altitude = altitude;
        this.actions = []
        this.breachingProximity = false
        this.lastPositions = []

        this.targetLocation = undefined
        this.targetAltitude = undefined
        this.targetSpeed = undefined
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
                console.log('setting target altitude')
                this.targetAltitude = action.targetValue
            }
            if (action.type() === "Speed") {
                this.targetSpeed = action.targetValue
            }
        })
    }

    addAction = (action) => {
        if (action.type() === "Landing") { // landing overwrites everything
            this.actions = [action]
            this._update_targets()
            return
        }
        for (let x = 0; x < this.actions.length; x++) {
            if (this.actions[x].type() === "Waypoint" && action.type() === "Heading") { // heading overwrites waypoint
                this.actions[x] = action
                this._update_targets()
                return
            }
            if (this.actions[x].type() === "Heading" && action.type() === "Waypoint") { // waypoint overwrites heading
                this.actions[x] = action
                this._update_targets()
                return
            }
            if (this.actions[x].type() === "Waypoint" && action.type() === "Waypoint") { // waypoint overwrites waypoint
                this.actions[x] = action
                this._update_targets()
                return
            }
            if (this.actions[x].type() === action.type()) { // replace action
                console.log('Replacing action...')
                this.actions[x] = action
                this._update_targets()
                return
            }
        }
        console.log('Pushing new action...')
        this.actions.push(action)
        this._update_targets()
    }

    setSpeed = (map, speed) => {
        const newSpeed = new Speed(map, this, speed);
        if (newSpeed.isValid()) {
            this.addAction(newSpeed)
            return speed
        }
    }

    setHeading = (map, heading) => {
        const newHeading = new Heading(map, this, heading);
        if (newHeading.isValid()) {
            this.addAction(newHeading)
            return heading
        }
    }

    setAltitude = (map, altitude) => {
        const newAltitude = new Altitude(map, this, altitude);
        if (newAltitude.isValid()) {
            this.addAction(newAltitude)
            return altitude
        }
    }

    setWaypoint = (map, waypoint) => {
        const newWaypoint = new Waypoint(map, this, waypoint);
        if (newWaypoint.isValid()) {
            this.addAction(newWaypoint)
            return waypoint
        }
    }

    setLanding = (map, runway) => {
        const newLanding = new Landing(map, this, runway);
        if (newLanding.isValid()) {
            this.addAction(newLanding)
            return runway
        }
    }

    _clean_actions = () => {
        this.actions = this.actions.filter(action => action.isActionable())
        this._clear_targets()
    }

    applyActions = () => {
        this.actions.forEach(action => {
            action.apply()
        })

        const headingRadians = toRadians(this.heading)
        const distancePerTick = 1 + ((this.speed - 100) / 20 * 0.5)
        this.x = round(this.x + distancePerTick * Math.sin(headingRadians), 2);
        this.y = round(this.y - distancePerTick * Math.cos(headingRadians), 2);

        this.updateLastPositions(this.x, this.y)

        this._clean_actions()
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

    isOutsideBoundaries = (mapBoundaries, outsideCallback) => {
        const outsideX = (this.x < mapBoundaries.minX || this.x > mapBoundaries.maxX)
        const outsideY = (this.y < mapBoundaries.minY || this.y > mapBoundaries.maxY)
        const outside = outsideX || outsideY;
        if (outside && outsideCallback) {
            outsideCallback()
        }
        return outside
    }

    isLanding = () => {
        return this.actions.length > 0 && this.actions[0].type() === "Landing"
    }

    hasLanded = (landedCallback) => {
        const landed = this.altitude < LANDED_ALTITUDE;
        if (landed && landedCallback) {
            landedCallback()
        }
        return landed
    }

    proximalTo = (otherAeroplane) => {
        const horizontalDistance = distance(this.x, this.y, otherAeroplane.x, otherAeroplane.y);
        const verticalDistance = Math.abs(this.altitude - otherAeroplane.altitude)
        return horizontalDistance < HORIZONTAL_SEPARATION_MINIMUM
            && verticalDistance <= VERTICAL_SEPARATION_MINIMUM
    }

    breachingRestrictedZone = (map, zone) => {
        const planeInverseY = map.maxY - this.y
        return isInsidePolygon(zone.boundaries, this.x, planeInverseY) && this.breachingAltitudeRestriction(zone)
    }

    breachingAltitudeRestriction = (zone) => {
        if (zone.minAltitude === null && zone.maxAltitude === null) {
            return true
        }
        return this.altitude < zone.minAltitude || this.altitude > zone.maxAltitude
    }

    markBreachingProximityLimits = () => {
        this.breachingProximity = true
    }

    markAdheringProximityLimits = () => {
        this.breachingProximity = false
    }
}
