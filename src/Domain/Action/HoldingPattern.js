import {FLYING, HOLDING_PATTERN} from "../Aeroplane/aeroplaneStates";
import {Action, turning_change_rate} from "./Action";

export class HoldingPattern extends Action {
    constructor(map, aeroplane, direction) {
        const directionName = direction === 1 ? 'right' : 'left'
        super(map, aeroplane, directionName);
        this.map = map
        this.direction = direction
    }

    isActionable = () => {
        return this.aeroplane.is([FLYING, HOLDING_PATTERN])
    }

    isFutureActionable = () => {
        return false
    }

    isValid = () => {
        return this.aeroplane.is([FLYING, HOLDING_PATTERN])
    }

    apply = () => {
        let newHeading = this.aeroplane.heading + (this.direction * turning_change_rate(this.aeroplane))
        if (newHeading < 360) {
            newHeading = 360 + newHeading
        }
        if (newHeading > 360) {
            newHeading = newHeading - 360
        }
        this.aeroplane.heading = newHeading
    };

    copy = (aeroplane) => {
        return new HoldingPattern(this.map, aeroplane, this.direction)
    }
}