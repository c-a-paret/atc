import {getRandomNumberBetween, toDegrees} from "../../utils/maths";
import {
    ILS_MAX_X,
    ILS_MIN_X,
    LANDED_ALTITUDE,
    LANDING_SPEED,
    MAX_ALTITUDE,
    MIN_ALTITUDE,
    MIN_APPROACH_SPEED,
    MIN_GROUND_CLEARANCE,
    MIN_SPEED,
    TAKEOFF_SPEED
} from "../../config/constants";
import {distance, shortestAngle} from "../../utils/geometry";
import {FLYING, HOLDING_SHORT, READY_TO_TAXI, TAKING_OFF, TAXIING} from "../Aeroplane/aeroplaneStates";

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

    isFutureActionable = () => {

    }

    isValid = () => {

    };

    copy = (aeroplane) => {

    }
}

const turning_change_rate = (aeroplane) => {
    if (aeroplane.weight === 1) {
        return -0.006666 * aeroplane.speed + 5
    } else if (aeroplane.weight === 2) {
        return -0.006666 * aeroplane.speed + 4
    } else {
        return -0.006666 * aeroplane.speed + 3
    }
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
        return this.aeroplane.speed !== this.targetValue && this.aeroplane.is([FLYING])
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.speed
            && this.targetValue >= MIN_SPEED
    }

    copy = (aeroplane) => {
        return new Speed(this.map, aeroplane, this.targetValue)
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
            this.aeroplane.heading = (this.aeroplane.heading + turning_change_rate(this.aeroplane)) % 360;
        } else {
            // turn left
            let newHeading = this.aeroplane.heading - turning_change_rate(this.aeroplane);
            this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
        }
    };

    _wouldEndUpBeyondTarget(targetHeading, currentHeading) {
        return Math.abs(targetHeading - currentHeading) < turning_change_rate(this.aeroplane);
    }

    isActionable = () => {
        return this.aeroplane.heading !== this.targetValue && this.aeroplane.is([FLYING])
    };

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.heading
            && this.targetValue >= 0
            && this.targetValue <= 360
    };

    copy = (aeroplane) => {
        return new Heading(this.map, aeroplane, this.targetValue)
    }
}

export class Altitude extends Action {
    constructor(map, aeroplane, targetAltitude) {
        super(null, aeroplane, targetAltitude);
    }

    _change_rate = () => {
        if (this.aeroplane.altitude > 10000) {
            return 80
        } else if (this.aeroplane.altitude > 5000) {
            return 50
        }
        return 20
    }

    apply = () => {
        if (this.aeroplane.altitude < this.targetValue) {
            const newValue = this.aeroplane.altitude + this._change_rate()
            this.aeroplane.altitude = Math.min(newValue, this.targetValue)
        }
        if (this.aeroplane.altitude > this.targetValue) {
            const newValue = this.aeroplane.altitude - this._change_rate()
            this.aeroplane.altitude = Math.max(newValue, this.targetValue)
        }
    }

    isActionable = () => {
        return this.aeroplane.altitude !== this.targetValue && this.aeroplane.is([FLYING])
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
    }

    isValid = () => {
        return this.targetValue
            && this.targetValue !== this.aeroplane.altitude
            && this.targetValue >= MIN_ALTITUDE
            && this.targetValue <= MAX_ALTITUDE
            && this.targetValue % 20 === 0
    }

    copy = (aeroplane) => {
        return new Altitude(this.map, aeroplane, this.targetValue)
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
        if (this.aeroplane.isNot([FLYING])) {
            return false
        }
        const distanceToWaypoint = distance(this.aeroplane.x, this.aeroplane.y, this.targetX, this.targetY)
        const arrived = distanceToWaypoint <= 8
        return !arrived
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT, TAKING_OFF])
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
            this.aeroplane.heading = (this.aeroplane.heading + turning_change_rate(this.aeroplane)) % 360;
        } else {
            // turn left
            let newHeading = this.aeroplane.heading - turning_change_rate(this.aeroplane);
            this.aeroplane.heading = newHeading < 0 ? newHeading + 360 : newHeading;
        }
    };

    _wouldEndUpBeyondTarget(targetHeading, currentHeading) {
        return Math.abs(targetHeading - currentHeading) < turning_change_rate(this.aeroplane);
    }

    isValid = () => {
        for (let x = 0; x < this.map.features.waypoints.length; x++) {
            if (this.map.features.waypoints[x].id === this.targetWaypoint) {
                return true
            }
        }
        return false;
    }

    copy = (aeroplane) => {
        return new Waypoint(this.map, aeroplane, this.targetWaypoint)
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
        return !this.executed && this.aeroplane.is([FLYING])
    }

    isFutureActionable = () => {
        return false
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

        if (distanceToRunway < 5 && this.aeroplane.altitude < LANDED_ALTITUDE) {
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

    copy = (aeroplane) => {

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
        return this.aeroplane.is([FLYING]) && true
    }

    isFutureActionable = () => {
        return false
    }

    isValid = () => {
        // TODO: Implement properly
        return true
    }

    apply = () => {
        let newHeading = this.aeroplane.heading + (this.direction * turning_change_rate(this.aeroplane))
        if (newHeading < 360) {
            newHeading = 360 + newHeading
        }
        if (newHeading > 360) {
            newHeading = newHeading - 360
        }
        this.aeroplane.heading = newHeading
    };

    copy = (aeroplane) => {
        return new HoldingPattern(this.map, aeroplane, this.direction)
    }
}

export class TaxiToRunway extends Action {
    constructor(map, aeroplane, targetRunway) {
        super(map, aeroplane, targetRunway);
        this.map = map
        this.targetRunway = targetRunway
        this.runway = undefined
        this.targetX = undefined
        this.targetY = undefined
        this.taxiTime = getRandomNumberBetween(5, 20)

        if (this.map.runwayExists(this.targetRunway)) {
            this.runway = this.map.getRunwayInfo(this.targetRunway)
            this.targetX = this.runway.landingZone.x
            this.targetY = this.runway.landingZone.y
        }
    }

    isActionable = () => {
        if (this.taxiTime > 0) {
            return true
        }
        if (this.taxiTime <= 0) {
            this.aeroplane.x = this.targetX
            this.aeroplane.y = this.targetY
            this.aeroplane.state = HOLDING_SHORT
            this.aeroplane.heading = this.runway.heading
            this.aeroplane.positionDescription = this.targetRunway
            return false
        }
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING])
    }

    isValid = () => {
        return this.map.runwayExists(this.targetRunway) && this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT])
    }

    apply = () => {
        this.taxiTime -= 1
    };

    copy = (aeroplane) => {
        return new TaxiToRunway(this.map, aeroplane, this.targetRunway)
    }
}


export class Takeoff extends Action {
    constructor(map, aeroplane, runway = null) {
        super(map, aeroplane, null);
        this.map = map
        this.targetX = undefined
        this.targetY = undefined
        this.runway = undefined
        this.speedSet = false
        this.executed = false

        if (!runway && this.map.runwayExists(this.aeroplane.positionDescription)) {
            this.runway = this.map.getRunwayInfo(this.aeroplane.positionDescription)
            this.targetX = this.runway.takeoffPoint.x
            this.targetY = this.runway.takeoffPoint.y
        } else {
            this.runway = runway
        }
    }

    isActionable = () => {
        return !this.executed
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING, HOLDING_SHORT])
    }

    isValid = () => {
        return this.map.runwayExists(this.runway.label) && this.aeroplane.is([HOLDING_SHORT])
    }

    apply = () => {
        this.aeroplane.heading = this.runway.heading

        // Speed
        if (this.aeroplane.speed < TAKEOFF_SPEED) {
            this.aeroplane.speed += 20
        }

        // Altitude
        if (this.aeroplane.speed < TAKEOFF_SPEED) {
            this.aeroplane.altitude = 0
        }

        if (this.aeroplane.speed >= TAKEOFF_SPEED && this.aeroplane.altitude < MIN_GROUND_CLEARANCE) {
            this.aeroplane.altitude += 60
        }

        // End takeoff sequence
        if (this.aeroplane.speed >= TAKEOFF_SPEED && this.aeroplane.altitude >= MIN_GROUND_CLEARANCE) {
            this.aeroplane.state = FLYING
            this.executed = true
        }
    };

    copy = (aeroplane) => {
        return new Takeoff(this.map, aeroplane, this.runway)
    }
}
