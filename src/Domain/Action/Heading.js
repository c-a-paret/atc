import {
    FLYING,
    GOING_AROUND,
    HOLDING_PATTERN,
    HOLDING_SHORT, LANDING,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "../Aeroplane/aeroplaneStates";
import {shortestAngle} from "../../utils/geometry";
import {Action, turning_change_rate, wouldEndUpTurningBeyondTarget} from "./Action";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../config/constants";

export class Heading extends Action {
    constructor(map, aeroplane, targetHeading) {
        super(null, aeroplane, targetHeading);
    }

    isActionable = () => {
        return this.aeroplane.heading !== this.targetValue && this.aeroplane.is([FLYING, HOLDING_PATTERN, GOING_AROUND])
    };

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    validate = () => {
        let warnings = []
        let errors = []
        if (!this.targetValue) {
            errors.push('Value must be provided')
        }
        if (this.aeroplane.is([LANDING])) {
            warnings.push('Cannot set heading when landing')
        }
        if (this.targetValue === this.aeroplane.heading) {
            warnings.push('Heading already set')
        }
        if (this.targetValue < 0) {
            errors.push('Heading must be between 000 and 360')
        }
        if (this.targetValue > 360) {
            errors.push('Heading must be between 000 and 360')
        }
        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
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