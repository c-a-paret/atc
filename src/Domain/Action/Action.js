import {distance, MAX_ALTITUDE, MIN_ALTITUDE, MIN_APPROACH_SPEED, MIN_SPEED, toDegrees} from "../../utils/common";
import {EGLL} from "../../config/maps/EGLL";

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

        if (shortestAngle(currentHeading, targetHeading) > 0) {
            // turn right
            this.aeroplane.heading = (this.aeroplane.heading + this._change_rate()) % 360;
        } else {
            // turn left
            let newHeading = this.aeroplane.heading - this._change_rate();
            this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
        }
    };

    _wouldEndUpBeyondTarget(targetHeading, currentHeading) {
        return Math.abs(targetHeading - currentHeading) < this._change_rate();
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

export class Waypoint extends Action {
    constructor(aeroplane, targetWaypoint) {
        super(aeroplane, null);
        EGLL.features.vors.forEach(vor => {
            if (vor.id === targetWaypoint) {
                this.targetX = vor.x
                this.targetY = vor.y
            }
        })

        this.targetWaypoint = targetWaypoint
        this.targetValue = this._determine_heading()
    }

    _determine_heading = () => {
        const opposite = Math.abs(this.targetY - this.aeroplane.y)
        const adjacent = Math.abs(this.targetX - this.aeroplane.x)
        const theta = Math.round(toDegrees(Math.atan((opposite / adjacent))))

        let heading;
        if (this.targetX > this.aeroplane.x) {
            if (this.targetY < this.aeroplane.y) {
                heading = 90 - theta
            } else {
                heading = 90 + theta
            }
        } else {
            if (this.targetY < this.aeroplane.y) {
                heading = 270 + theta
            } else {
                heading = 270 - theta
            }
        }
        return heading
    }

    isActionable = () => {
        const distanceToWaypoint = distance(this.aeroplane.x, this.aeroplane.y, this.targetX, this.targetY)
        const arrived = distanceToWaypoint <= 8
        return !arrived
    }

    apply = () => {
        const currentHeading = this.aeroplane.heading
        const targetHeading = this._determine_heading()

        if (this._wouldEndUpBeyondTarget(targetHeading, currentHeading)) {
            this.aeroplane.heading = targetHeading
            return
        }

        if (shortestAngle(currentHeading, targetHeading) > 0) {
            // turn right
            this.aeroplane.heading = (this.aeroplane.heading + this._change_rate()) % 360;
        } else {
            // turn left
            let newHeading = this.aeroplane.heading - this._change_rate();
            this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
        }
    };

    _wouldEndUpBeyondTarget(targetHeading, currentHeading) {
        return Math.abs(targetHeading - currentHeading) < this._change_rate();
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

    isValid = () => {
        EGLL.features.vors.forEach(vor => {
            if (vor.id === this.targetWaypoint) {
                return true
            }
        })
        return false;
    }
}

export class Landing extends Action {
    constructor(aeroplane, targetRunway) {
        super(aeroplane, null);
        this.targetRunway = targetRunway
        this.executed = false
    }

    isActionable = () => {
        return !this.executed
    }

    apply = () => {
        this.aeroplane.setSpeed(120)
        this.aeroplane.actions.push(new Waypoint(this.aeroplane, this.targetRunway))
        this.aeroplane.actions.push(new Altitude(this.aeroplane, 0))
        this.executed = true
    };

    isValid = () => {
        if (EGLL.runwayExists(this.targetRunway)) {
            const runway = EGLL.getRunwayInfo(this.targetRunway)

            const withinMaximumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) <= 220;
            const withinMinimumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) >= 100;
            const withinY = Math.abs(this.aeroplane.y - runway.ILS.innerMarker.y) <= 20;
            const withinMaximumAltitude = Math.abs(this.aeroplane.altitude - runway.altitude) <= 3000;
            const withinMaximumSpeed = this.aeroplane.speed <= MIN_APPROACH_SPEED;
            const withinRunwayHeading = Math.abs(runway.heading - this.aeroplane.heading) <= 10;

            return this._onCorrectSideOfRunway(this.aeroplane, runway)
                && withinMaximumX
                && withinMinimumX
                && withinY
                && withinMaximumAltitude
                && withinMaximumSpeed
                && withinRunwayHeading
        }
        return false
    }

    _onCorrectSideOfRunway = (aeroplane, runway) => {
        if (runway.heading <= 180 && runway.heading >= 0) {
            return aeroplane.x < runway.ILS.innerMarker.x
        } else {
            return aeroplane.x > runway.ILS.innerMarker.x
        }
    }
}

export const shortestAngle = (currentHeading, targetHeading) => {
    if (currentHeading === 180 && targetHeading === 0) {
        return 180
    }
    if (currentHeading === 0 && (targetHeading < 360 && targetHeading > 180)) {
        return targetHeading - 360
    }
    if (currentHeading - targetHeading < -180) {
        return -(currentHeading + 360 - targetHeading)
    }
    if (currentHeading - targetHeading > 180) {
        return targetHeading + 360 - currentHeading
    }
    if (targetHeading - currentHeading === -180) {
        return 180
    }
    return targetHeading - currentHeading
}