
import {MAX_ALTITUDE, MIN_ALTITUDE, range} from "../../utils/common";

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
        if (targetSpeed < 0) {
            throw `Invalid target speed [${targetSpeed}]`
        }
        const tickValues = range(targetSpeed, currentSpeed, 1)
        super("speed", true, targetSpeed, tickValues);
    }
}

export class Heading extends Action {
    constructor(currentHeading, targetHeading) {
        if (targetHeading < 0 || targetHeading > 360) {
            throw `Invalid target heading [${targetHeading}]`
        }
        const tickValues = range(targetHeading, currentHeading, 1)
        super("heading", true, targetHeading, tickValues);
    }
}

export class Altitude extends Action {
    constructor(currentAltitude, targetAltitude) {
        if (targetAltitude < MIN_ALTITUDE || targetAltitude > MAX_ALTITUDE) {
            throw `Invalid target altitude [${targetAltitude}]`
        }
        const tickValues = range(targetAltitude, currentAltitude, 20)
        super("altitude", true, targetAltitude, tickValues);
    }
}