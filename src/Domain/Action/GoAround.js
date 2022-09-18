import {Waypoint} from "./Waypoint";
import {Speed} from "./Speed";
import {Altitude} from "./Altitude";
import {MIN_GROUND_CLEARANCE} from "../../config/constants";
import {FLYING} from "../Aeroplane/aeroplaneStates";
import {Action} from "./Action";

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

    isValid = () => {
        if (this.map.runwayExists(this.aimingForRunway) && this.aeroplane.isLanding()) {
            this.runway = this.map.getRunwayInfo(this.aimingForRunway)
            this.targetWaypoint = this.runway.goAround.targetWaypoint
            this.targetSpeed = this.runway.goAround.targetSpeed
            this.targetAltitude = this.runway.goAround.targetAltitude
            return true
        }
        return false
    }

    apply = () => {
        if (this.aeroplane.altitude >= MIN_GROUND_CLEARANCE) {
            this.aeroplane.state = FLYING
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