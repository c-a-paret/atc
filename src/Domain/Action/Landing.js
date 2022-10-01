import {FLYING, HOLDING_PATTERN, LANDING, READY_TO_TAXI} from "../Aeroplane/aeroplaneStates";
import {ILS_MAX_X, ILS_MIN_X, LANDED_ALTITUDE, LANDING_SPEED, MIN_APPROACH_SPEED} from "../../config/constants";
import {Speed} from "./Speed";
import {Waypoint} from "./Waypoint";
import {distance} from "../../utils/geometry";
import {Action} from "./Action";

export class Landing extends Action {
    constructor(map, aeroplane, targetRunway) {
        super(map, aeroplane, targetRunway);
        this.map = map
        this.targetRunway = targetRunway
        this.speedSet = false
        this.waypointSet = false
        this.executed = false
    }

    isActionable = () => {
        return !this.executed && this.aeroplane.is([LANDING])
    }

    isFutureActionable = () => {
        return false
    }

    validate = () => {
        let warnings = []
        let errors = []
        let isValid = false

        if (this.aeroplane.isNot([FLYING, HOLDING_PATTERN])) {
            errors.push('Cannot clear for landing right now')
        }

        if (this.map.runwayExists(this.targetRunway)) {
            const runway = this.map.getRunwayInfo(this.targetRunway)

            const withinMaximumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) <= ILS_MAX_X;
            const withinMinimumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) >= ILS_MIN_X;
            const withinY = Math.abs(this.aeroplane.y - runway.ILS.innerMarker.y) <= 20;
            const withinMaximumAltitude = Math.abs(this.aeroplane.altitude - runway.altitude) <= 3000;
            const withinMaximumSpeed = this.aeroplane.speed <= MIN_APPROACH_SPEED;
            const withinRunwayHeading = Math.abs(runway.heading - this.aeroplane.heading) <= 10;

            isValid = this._onCorrectSideOfRunway(this.aeroplane, runway)
                && withinMaximumX
                && withinMinimumX
                && withinY
                && withinMaximumAltitude
                && withinMaximumSpeed
                && withinRunwayHeading
        } else {
            errors.push(`Runway ${this.targetRunway} does not exist`)
        }

        if (!isValid) {
            errors.push('Not correctly configured for landing')
        }

        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
    }

    apply = () => {
        if (!this.speedSet && !this.waypointSet) {
            this.aeroplane.actions.push(new Speed(this.map, this.aeroplane, LANDING_SPEED))
            this.aeroplane.actions.push(new Waypoint(this.map, this.aeroplane, this.targetRunway))
            this.speedSet = true
            this.waypointSet = true
        }
        const runway = this.map.getRunwayInfo(this.targetRunway)
        const distanceToRunway = distance(this.aeroplane.x, this.aeroplane.y, runway.landingZone.x, runway.landingZone.y)

        if (distanceToRunway < 5 && this.aeroplane.altitude < LANDED_ALTITUDE) {
            this.executed = true
        }

        const rateOfDescent = (this.aeroplane.altitude - runway.altitude) / distanceToRunway * 2
        this.aeroplane.altitude -= rateOfDescent
    };

    copy = (aeroplane) => {

    }

    _onCorrectSideOfRunway = (aeroplane, runway) => {
        if (runway.heading <= 180 && runway.heading >= 0) {
            return aeroplane.x < runway.landingZone.x
        } else {
            return aeroplane.x > runway.landingZone.x
        }
    }
}