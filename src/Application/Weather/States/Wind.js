import {getRandomNumberBetween, roundToNearest} from "../../../utils/maths";
import {MAX_WIND_SPEED, MIN_WIND_SPEED} from "../../../config/constants";

export class Wind {
    constructor() {
        this.direction = roundToNearest(getRandomNumberBetween(1, 360), 1)
        this.speed = getRandomNumberBetween(MIN_WIND_SPEED, MAX_WIND_SPEED)
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {

    }

    easterly = () => {
        return this.direction >= 0 && this.direction <= 180
    }

    directionIndex = () => {
        if (this.direction > 45 && this.direction <= 135) {
            return 1 // East
        } else if (this.direction > 135 && this.direction <= 225) {
            return 2 // South
        } else if (this.direction >= 225 && this.direction <= 315) {
            return 3 // West
        }
        return 0 // North
    }
}