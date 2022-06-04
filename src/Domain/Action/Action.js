import {range} from "lodash";

class Action {
    constructor(type, concurrent, targetValue, tickValues) {
        this.type = type
        this.concurrent = concurrent
        this.targetValue = targetValue
        this.tickValues = tickValues
    }
}

export class Speed extends Action {
    constructor(currentSpeed, targetSpeed) {
        if (targetSpeed < 0) { throw `Invalid target speed [${targetSpeed}]` }
        const startTickSpeed = targetSpeed > currentSpeed ? currentSpeed + 1 : currentSpeed - 1
        const finalTickSpeed = targetSpeed > currentSpeed ? targetSpeed + 1 : targetSpeed - 1
        const tickValues = range(startTickSpeed, finalTickSpeed)
        super("speed", true, targetSpeed, tickValues);
    }
}