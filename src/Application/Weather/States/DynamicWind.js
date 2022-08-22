import {getRandomNumberBetween, roundToNearest} from "../../../utils/maths";
import {Wind} from "./Wind";
import {MAX_WIND_SPEED, MIN_WIND_SPEED} from "../../../config/constants";

export class DynamicWind extends Wind {
    constructor() {
        super()
        this.machine = undefined

        this.tickNum = 0
        this.directionDifference = undefined
        this.targetDirection = this.direction
        this.targetSpeed = this.speed
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (this.tickNum % 20 === 0) {
            this.directionDifference = roundToNearest(getRandomNumberBetween(-20, 20), 1);
            this.targetDirection = (this.direction + this.directionDifference) % 360
            this.targetSpeed = Math.min(Math.max(this.speed + roundToNearest(getRandomNumberBetween(-5, 5), 1), MIN_WIND_SPEED), MAX_WIND_SPEED)
        }

        if (Math.abs(this.targetDirection - this.direction) > 0) {
            if (this.directionDifference > 0) {
                this.direction = (this.direction + 1) % 360
            } else if (this.directionDifference < 0) {
                this.direction = (this.direction - 1) % 360
            }
        }

        if (this.speed < this.targetSpeed) {
            this.speed += 1
        } else if (this.speed > this.targetSpeed) {
            this.speed -= 1
        }

        this.tickNum += 1
    }
}