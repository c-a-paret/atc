export class Action {
    constructor(map, aeroplane, targetValue) {
        this.map = map
        this.aeroplane = aeroplane
        this.targetValue = targetValue
    }

    type = () => {
        return this.constructor.name
    }

    isActionable = () => {

    };

    isFutureActionable = () => {

    }

    validate = () => {

    };

    apply = () => {

    };

    copy = (aeroplane) => {

    }
}

export const turning_change_rate = (aeroplane) => {
    if (aeroplane.weight === 1) {
        return -0.006666 * aeroplane.speed + 5
    } else if (aeroplane.weight === 2) {
        return -0.006666 * aeroplane.speed + 4
    } else {
        return -0.006666 * aeroplane.speed + 3
    }
}

export const wouldEndUpTurningBeyondTarget = (aeroplane, targetHeading, currentHeading) => {
    return Math.abs(targetHeading - currentHeading) < turning_change_rate(aeroplane);
}
