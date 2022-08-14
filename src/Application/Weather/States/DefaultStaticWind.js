import {getRandomNumberBetween, roundToNearest} from "../../../utils/maths";

export class DefaultStaticWind {
    constructor() {
        this.machine = undefined

        this.direction = roundToNearest(getRandomNumberBetween(0, 359), 1)
        this.speed = getRandomNumberBetween(1, 22)
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