import {
    FLYING,
    GOING_AROUND,
    HOLDING_PATTERN,
    HOLDING_SHORT, LANDING,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "../Aeroplane/aeroplaneStates";
import {MAX_ALTITUDE, MIN_ALTITUDE, MIN_SPEED} from "../../config/constants";
import {Action} from "./Action";

export class Altitude extends Action {
    constructor(map, aeroplane, targetAltitude) {
        super(null, aeroplane, targetAltitude);
    }

    isActionable = () => {
        return this.aeroplane.altitude !== this.targetValue && this.aeroplane.is([FLYING, HOLDING_PATTERN, GOING_AROUND])
    }

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
            warnings.push('Cannot set altitude when landing')
        }
        if (this.targetValue === this.aeroplane.altitude) {
            warnings.push('Altitude already set')
        }
        if (this.targetValue < MIN_ALTITUDE) {
            errors.push(`Cannot set altitude lower than ${MIN_ALTITUDE}`)
        }
        if (this.targetValue > MAX_ALTITUDE) {
            errors.push(`Cannot set altitude higher than ${MAX_ALTITUDE}`)
        }
        if (this.targetValue % 20 !== 0) {
            errors.push(`Altitude must be in increments of 20`)
        }
        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
    }

    apply = () => {
        if (this.aeroplane.altitude < this.targetValue) {
            const newValue = this.aeroplane.altitude + this._altitude_change_rate()
            this.aeroplane.altitude = Math.min(newValue, this.targetValue)
        }
        if (this.aeroplane.altitude > this.targetValue) {
            const newValue = this.aeroplane.altitude - this._altitude_change_rate()
            this.aeroplane.altitude = Math.max(newValue, this.targetValue)
        }
    }

    copy = (aeroplane) => {
        return new Altitude(this.map, aeroplane, this.targetValue)
    }

    _altitude_change_rate = () => {
        if (this.aeroplane.altitude > 10000) {
            return 80
        } else if (this.aeroplane.altitude > 5000) {
            return 50
        }
        return 20
    }
}