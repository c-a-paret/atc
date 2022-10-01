import {FLYING, HOLDING_PATTERN} from "../Aeroplane/aeroplaneStates";
import {Action, turning_change_rate} from "./Action";

export class HoldingPattern extends Action {
    constructor(map, aeroplane, direction, turningChangeRate, tick= 0) {
        const directionName = direction === 1 ? 'right' : 'left'
        super(map, aeroplane, directionName);
        this.map = map
        this.direction = direction
        this.turningChangeRate = turningChangeRate ? turningChangeRate : turning_change_rate(this.aeroplane)
        this.tick = tick
    }

    isActionable = () => {
        return this.aeroplane.is([FLYING, HOLDING_PATTERN])
    }

    isFutureActionable = () => {
        return false
    }

    validate = () => {
        let warnings = []
        let errors = []

        if (this.aeroplane.isNot([FLYING, HOLDING_PATTERN])) {
            errors.push('Cannot enter holding pattern right now')
        }

        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
    }

    apply = () => {
        if (this.tick !== 0) {  // start holding pattern off current heading
            const turningCircle = 180 / this.turningChangeRate;
            const zone = Math.floor(this.tick / turningCircle) % 4
            let newHeading = this.aeroplane.heading

            if ([0, 2].includes(zone)) {
                let newHeading = this.aeroplane.heading + (this.direction * this.turningChangeRate)
                if (newHeading < 360) {
                    newHeading += 360
                }
                if (newHeading > 360) {
                    newHeading -= 360
                }
                this.aeroplane.heading = newHeading
            } else {
                this.aeroplane.heading = newHeading
                this.tick += 2
            }
        }
        this.tick += 1
    };

    copy = (aeroplane) => {
        return new HoldingPattern(this.map, aeroplane, this.direction, this.turningChangeRate, this.tick)
    }
}