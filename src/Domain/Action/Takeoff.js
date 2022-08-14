import {FLYING, HOLDING_SHORT, READY_TO_TAXI, TAXIING} from "../Aeroplane/aeroplaneStates";
import {MIN_GROUND_CLEARANCE, TAKEOFF_SPEED} from "../../config/constants";
import {Action} from "./Action";

export class Takeoff extends Action {
    constructor(map, aeroplane, runway = null) {
        super(map, aeroplane, null);
        this.map = map
        this.targetX = undefined
        this.targetY = undefined
        this.runway = null
        this.speedSet = false
        this.executed = false

        if (!runway && this.map.runwayExists(this.aeroplane.positionDescription)) {
            this.runway = this.map.getRunwayInfo(this.aeroplane.positionDescription)
            this.targetX = this.runway.takeoffPoint.x
            this.targetY = this.runway.takeoffPoint.y
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