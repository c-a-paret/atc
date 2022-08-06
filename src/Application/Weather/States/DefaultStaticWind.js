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

}