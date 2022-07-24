import {FLYING, GOING_AROUND, HOLDING_SHORT, READY_TO_TAXI, TAKING_OFF, TAXIING} from "../Aeroplane/aeroplaneStates";
import {shortestAngle} from "../../utils/geometry";
import {Action, turning_change_rate, wouldEndUpTurningBeyondTarget} from "./Action";

export class Heading extends Action {
    constructor(map, aeroplane, targetHeading) {
        super(null, aeroplane, targetHeading);
    }

    isActionable = () => {
        return this.aeroplane.heading !== this.targetValue && this.aeroplane.is([FLYING, GOING_AROUND])
    };

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.heading
            && this.targetValue >= 0
            && this.targetValue <= 360
    };

    apply = () => {
        const currentHeading = this.aeroplane.heading
        const targetHeading = this.targetValue

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
        return new Heading(this.map, aeroplane, this.targetValue)
    }
}