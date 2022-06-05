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
    constructor(currentSpeed, targetSpeed, weight) {
        if (targetSpeed < 0) {
            throw `Invalid target speed [${targetSpeed}]`
        }
        const weightMultiplierMap = {
            3: 1,
            2: 2,
            1: 3
        };

        const tickValues = range(targetSpeed, currentSpeed, weightMultiplierMap[weight])
        super("speed", true, targetSpeed, tickValues);
    }
}

export class Heading extends Action {
    constructor(currentHeading, targetHeading, speed) {
        if (targetHeading < 0 || targetHeading > 360) {
            throw `Invalid target heading [${targetHeading}]`
        }
        let speedMultiplier;
        if (speed < 200) {
            speedMultiplier = 5
        } else if (speed < 300) {
            speedMultiplier = 3
        } else {
            speedMultiplier = 2
        }

        let tickValues;
        if (Math.abs(targetHeading - currentHeading) === 180 && currentHeading === 360) {
            tickValues = range(targetHeading, 0, speedMultiplier)
        } else if (targetHeading - currentHeading > 180) {
            const tickToNorth = range(1, currentHeading, speedMultiplier)
            const tickToTarget = range(targetHeading, 361, speedMultiplier)
            tickValues = tickToTarget.concat(tickToNorth)
        } else if (currentHeading - targetHeading > 180) {
            const tickToNorth = range(360, currentHeading, speedMultiplier)
            const tickToTarget = range(targetHeading, 0, speedMultiplier)
            tickValues = tickToTarget.concat(tickToNorth)
        } else {
            tickValues = range(targetHeading, currentHeading, speedMultiplier)
        }
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