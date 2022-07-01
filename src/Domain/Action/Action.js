import {toDegrees} from "../../utils/maths";
import {
    ILS_MAX_X,
    ILS_MIN_X,
    LANDING_SPEED,
    MAX_ALTITUDE,
    MIN_ALTITUDE,
    MIN_APPROACH_SPEED,
    MIN_SPEED
} from "../../config/constants";
import {distance, shortestAngle} from "../../utils/geometry";

class Action {
    constructor(map, aeroplane, targetValue) {
        this.map = map
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

    constructor(map, aeroplane, targetSpeed) {
        super(null, aeroplane, targetSpeed);
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
            && this.targetValue >= MIN_SPEED
    }
}

export class Heading extends Action {
    constructor(map, aeroplane, targetHeading) {
        super(null, aeroplane, targetHeading);
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
            return {
                1: 5,
                2: 3,
                3: 2,
            }[this.aeroplane.weight]
        } else if (this.aeroplane.speed < 300) {
            return {
                1: 3,
                2: 2,
                3: 2,
            }[this.aeroplane.weight]
        } else {
            return {
                1: 3,
                2: 2,
                3: 2,
            }[this.aeroplane.weight]
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
    constructor(map, aeroplane, targetAltitude) {
        super(null, aeroplane, targetAltitude);
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
            && this.targetValue % 20 === 0
    }
}

export class Waypoint extends Action {
    constructor(map, aeroplane, targetWaypoint) {
        super(map, aeroplane, targetWaypoint);
        this.map.features.waypoints.forEach(vor => {
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
        for (let x = 0; x < this.map.features.waypoints.length; x++) {
            if (this.map.features.waypoints[x].id === this.targetWaypoint) {
                return true
            }
        }
        return false;
    }
}

export class Landing extends Action {
    constructor(map, aeroplane, targetRunway) {
        super(map, aeroplane, targetRunway);
        this.map = map
        this.targetRunway = targetRunway
        this.speedSet = false
        this.waypointSet = false
        this.executed = false
    }

    isActionable = () => {
        return !this.executed
    }

    apply = () => {
        if (!this.speedSet && !this.waypointSet) {
            this.aeroplane.actions.push(new Speed(this.map, this.aeroplane, LANDING_SPEED))
            this.aeroplane.actions.push(new Waypoint(this.map, this.aeroplane, this.targetRunway))
            this.speedSet = true
            this.waypointSet = true
        }
        const runway = this.map.getRunwayInfo(this.targetRunway)
        const distanceToRunway = distance(this.aeroplane.x, this.aeroplane.y, runway.landingZone.x, runway.landingZone.y)

        if (distanceToRunway < 5 && this.aeroplane.altitude < 50) {
            this.executed = true
        }

        const rateOfDescent = (this.aeroplane.altitude - runway.altitude) / distanceToRunway * 2
        this.aeroplane.altitude -= rateOfDescent
    };

    isValid = () => {
        if (this.map.runwayExists(this.targetRunway)) {
            const runway = this.map.getRunwayInfo(this.targetRunway)

            const withinMaximumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) <= ILS_MAX_X;
            const withinMinimumX = Math.abs(this.aeroplane.x - runway.ILS.innerMarker.x) >= ILS_MIN_X;
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
            return aeroplane.x < runway.landingZone.x
        } else {
            return aeroplane.x > runway.landingZone.x
        }
    }
}

export class HoldingPattern extends Action {
    constructor(map, aeroplane, direction) {
        const directionName = direction === 1 ? 'right' : 'left'
        super(map, aeroplane, directionName);
        this.map = map
        this.direction = direction
    }

    isActionable = () => {
        return true
    }

    isValid = () => {
        return true
    }

    apply = () => {
        const rateOfTurn = this._change_rate()
        let newHeading = this.aeroplane.heading + (this.direction * rateOfTurn)
        if (newHeading < 360) {
            newHeading = 360 + newHeading
        }
        if (newHeading > 360) {
            newHeading = newHeading - 360
        }
        this.aeroplane.heading = newHeading
    };

    _change_rate = () => {
        if (this.aeroplane.speed < 200) {
            return {
                1: 5,
                2: 3,
                3: 2,
            }[this.aeroplane.weight]
        } else if (this.aeroplane.speed < 300) {
            return {
                1: 3,
                2: 2,
                3: 2,
            }[this.aeroplane.weight]
        } else {
            return {
                1: 3,
                2: 2,
                3: 2,
            }[this.aeroplane.weight]
        }
    }
}
