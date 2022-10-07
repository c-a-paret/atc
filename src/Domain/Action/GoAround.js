import {Waypoint} from "./Waypoint";
import {Speed} from "./Speed";
import {Altitude} from "./Altitude";
import {MIN_GROUND_CLEARANCE} from "../../config/constants";
import {Action} from "./Action";
import {Flying} from "../Aeroplane/states/Flying";

export class GoAround extends Action {
    constructor(map, aeroplane, aimingForRunway) {
        super(map, aeroplane, null);
        this.map = map
        this.aimingForRunway = aimingForRunway
        this.runway = undefined
        this.targetWaypoint = undefined
        this.targetSpeed = undefined
        this.targetAltitude = undefined
        this.targetsAdded = false
        this.executed = false

    }

    isActionable = () => {
        return !this.targetsAdded || !this.executed
    }

    isFutureActionable = () => {
        return false
    }

    validate = () => {
        let warnings = []
        let errors = []

        if (!this.aeroplane.isLanding()) {
            errors.push('Cannot go around, aircraft not landing')
        } else {
            if (this.map.runwayExists(this.aimingForRunway)) {
                this.runway = this.map.getRunwayInfo(this.aimingForRunway)
                this.targetWaypoint = this.runway.goAround.targetWaypoint
                this.targetSpeed = this.runway.goAround.targetSpeed
                this.targetAltitude = this.runway.goAround.targetAltitude
            } else {
                errors.push('Cannot go around')
            }
        }

        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }


    }

    apply = () => {
        if (this.aeroplane.altitude >= MIN_GROUND_CLEARANCE) {
            this.aeroplane.transitionTo(new Flying())
            this.executed = true
        }
        if (!this.targetsAdded) {
            this.aeroplane.addAction(new Waypoint(this.map, this.aeroplane, this.targetWaypoint))
            this.aeroplane.addAction(new Speed(this.map, this.aeroplane, this.targetSpeed))
            this.aeroplane.addAction(new Altitude(this.map, this.aeroplane, this.targetAltitude))
            this.targetsAdded = true
        }
    }

    copy = (aeroplane) => {

    }
}
