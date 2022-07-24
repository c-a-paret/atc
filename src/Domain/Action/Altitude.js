import {FLYING, GOING_AROUND, HOLDING_SHORT, READY_TO_TAXI, TAKING_OFF, TAXIING} from "../Aeroplane/aeroplaneStates";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../config/constants";
import {Action} from "./Action";

export class Altitude extends Action {
    constructor(map, aeroplane, targetAltitude) {
        super(null, aeroplane, targetAltitude);
    }

    isActionable = () => {
        return this.aeroplane.altitude !== this.targetValue && this.aeroplane.is([FLYING, GOING_AROUND])
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.altitude
            && this.targetValue >= MIN_ALTITUDE
            && this.targetValue <= MAX_ALTITUDE
            && this.targetValue % 20 === 0
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