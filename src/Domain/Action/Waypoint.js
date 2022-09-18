import {
    FLYING,
    GOING_AROUND,
    HOLDING_SHORT,
    LANDING,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "../Aeroplane/aeroplaneStates";
import {distance, shortestAngle} from "../../utils/geometry";
import {toDegrees} from "../../utils/maths";
import {Action, turning_change_rate, wouldEndUpTurningBeyondTarget} from "./Action";

export class Waypoint extends Action {
    constructor(map, aeroplane, targetWaypoint) {
        super(map, aeroplane, targetWaypoint);
        this.map.features.waypoints.forEach(vor => {
            if (vor.id === targetWaypoint) {
                this.targetX = vor.x
                this.targetY = vor.y
            }
        })

        this.targetWaypoint = targetWaypoint
        this.targetValue = this._determine_heading()
    }

    isActionable = () => {
        if (this.aeroplane.isNot([FLYING, LANDING, GOING_AROUND])) {
            return false
        }
        const distanceToWaypoint = distance(this.aeroplane.x, this.aeroplane.y, this.targetX, this.targetY)
        const arrived = distanceToWaypoint <= 8
        return !arrived
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        for (let x = 0; x < this.map.features.waypoints.length; x++) {
            if (this.map.features.waypoints[x].id === this.targetWaypoint) {
                return true
            }
        }
        return false;
    }

    apply = () => {
        const currentHeading = this.aeroplane.heading
        const targetHeading = this._determine_heading()

        if (wouldEndUpTurningBeyondTarget(this.aeroplane, targetHeading, currentHeading)) {
            this.aeroplane.heading = targetHeading
            return
        }

        if (shortestAngle(currentHeading, targetHeading) > 0) {
            // turn right
            this.aeroplane.heading = (this.aeroplane.heading + turning_change_rate(this.aeroplane)) % 360;
        } else {
            // turn left
            let newHeading = this.aeroplane.heading - turning_change_rate(this.aeroplane);
            this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
        }
    };

    copy = (aeroplane) => {
        return new Waypoint(this.map, aeroplane, this.targetWaypoint)
    }

    _determine_heading = () => {
        const opposite = Math.abs(this.targetY - this.aeroplane.y)
        const adjacent = Math.abs(this.targetX - this.aeroplane.x)
        const theta = Math.round(toDegrees(Math.atan((opposite / adjacent))))

        let heading;
        if (this.targetX > this.aeroplane.x) {
            if (this.targetY < this.aeroplane.y) {
                heading = 90 - theta
            } else {
                heading = 90 + theta
            }
        } else {
            if (this.targetY < this.aeroplane.y) {
                heading = 270 + theta
            } else {
                heading = 270 - theta
            }
        }
        return heading
    }
}