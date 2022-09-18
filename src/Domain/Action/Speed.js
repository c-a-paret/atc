import {
    FLYING,
    GOING_AROUND,
    HOLDING_PATTERN,
    HOLDING_SHORT, LANDING,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "../Aeroplane/aeroplaneStates";
import {MIN_SPEED} from "../../config/constants";
import {Action} from "./Action";

export class Speed extends Action {
    weightMultiplierMap = {
        3: 1,
        2: 2,
        1: 3
    };

    constructor(map, aeroplane, targetSpeed) {
        super(null, aeroplane, targetSpeed);
    }

    isActionable = () => {
        return this.aeroplane.speed !== this.targetValue && this.aeroplane.is([FLYING,HOLDING_PATTERN, LANDING, GOING_AROUND])
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.speed
            && this.targetValue >= MIN_SPEED
    }

    apply = () => {
        if (this.aeroplane.speed < this.targetValue) {
            const newValue = this.aeroplane.speed + this.weightMultiplierMap[this.aeroplane.weight]
            this.aeroplane.speed = Math.min(newValue, this.targetValue)
        }
        if (this.aeroplane.speed > this.targetValue) {
            const newValue = this.aeroplane.speed - this.weightMultiplierMap[this.aeroplane.weight]
            this.aeroplane.speed = Math.max(newValue, this.targetValue)
        }
    }

    copy = (aeroplane) => {
        return new Speed(this.map, aeroplane, this.targetValue)
    }
}