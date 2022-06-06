import {MAX_ALTITUDE, MIN_ALTITUDE, MIN_SPEED} from "../../utils/common";

class Action {
    constructor(aeroplane, targetValue) {
        this.aeroplane = aeroplane
        this.targetValue = targetValue
    }

    type = () => {
        return this.constructor.name
    }

    apply = () => {

    };

    isActionable = () => {

    };

    isValid = () => {

    };
}

export class Speed extends Action {
    weightMultiplierMap = {
        3: 1,
        2: 2,
        1: 3
    };

    constructor(aeroplane, targetSpeed) {
        super(aeroplane, targetSpeed);
    }

    apply = () => {
        if (this.aeroplane.speed < this.targetValue) {
            const newValue = this.aeroplane.speed + this.weightMultiplierMap[this.aeroplane.weight]
            this.aeroplane.speed = Math.min(newValue, this.targetValue)
        }
        if (this.aeroplane.speed > this.targetValue) {
            const newValue = this.aeroplane.speed - this.weightMultiplierMap[this.aeroplane.weight]
            this.aeroplane.speed = Math.max(newValue, this.targetValue)
        }
    }

    isActionable = () => {
        return this.aeroplane.speed !== this.targetValue
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.speed
            && this.targetValue % 10 === 0
            && this.targetValue >= MIN_SPEED
    }
}

export class Heading extends Action {
    constructor(aeroplane, targetHeading) {
        super(aeroplane, targetHeading);
    }

    apply = () => {
        const currentHeading = this.aeroplane.heading
        const targetHeading = this.targetValue

        if (this._wouldEndUpBeyondTarget(targetHeading, currentHeading)) {
            this.aeroplane.heading = targetHeading
            return
        }

        if (this._isFacingRightSemiCircle(currentHeading)) {
            if (this._targetIsToTheRight(targetHeading, currentHeading)) {
                // turn right
                this.aeroplane.heading = (this.aeroplane.heading + this._change_rate()) % 360;
            } else {
                // turn left
                let newHeading = this.aeroplane.heading - this._change_rate();
                this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
            }
        } else {
            if (this._targetIsToTheLeft(targetHeading, currentHeading)) {
                // turn left
                this.aeroplane.heading = (this.aeroplane.heading - this._change_rate()) % 360;
            } else {
                // turn right
                let newHeading = this.aeroplane.heading + this._change_rate();
                this.aeroplane.heading = newHeading > 0 ? newHeading % 360 : newHeading;
            }
        }
    };

    _wouldEndUpBeyondTarget(targetHeading, currentHeading) {
        return Math.abs(targetHeading - currentHeading) < this._change_rate();
    }

    _targetIsToTheLeft(targetHeading, currentHeading) {
        return targetHeading < currentHeading && (targetHeading > Math.abs((currentHeading + 180) % 360));
    }

    _isFacingRightSemiCircle(currentHeading) {
        return currentHeading >= 0 && currentHeading <= 180;
    }

    _targetIsToTheRight(targetHeading, currentHeading) {
        return targetHeading > currentHeading && (targetHeading <= Math.abs(currentHeading + 180) % 360);
    }

    _change_rate = () => {
        if (this.aeroplane.speed < 200) {
            return 5
        } else if (this.aeroplane.speed < 300) {
            return 3
        } else {
            return 2
        }
    }

    isActionable = () => {
        return this.aeroplane.heading !== this.targetValue
    };

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.heading
            && this.targetValue >= 0
            && this.targetValue <= 360
    };
}

export class Altitude extends Action {
    constructor(aeroplane, targetAltitude) {
        super(aeroplane, targetAltitude);
    }

    apply = () => {
        if (this.aeroplane.altitude < this.targetValue) {
            const newValue = this.aeroplane.altitude + 20
            this.aeroplane.altitude = Math.min(newValue, this.targetValue)
        }
        if (this.aeroplane.altitude > this.targetValue) {
            const newValue = this.aeroplane.altitude - 20
            this.aeroplane.altitude = Math.max(newValue, this.targetValue)
        }
    }

    isActionable = () => {
        return this.aeroplane.altitude !== this.targetValue
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.altitude
            && this.targetValue >= MIN_ALTITUDE
            && this.targetValue <= MAX_ALTITUDE
            && this.targetValue % 100 === 0
    }
}