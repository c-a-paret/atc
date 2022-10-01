import {FLYING, GOING_AROUND, HOLDING_SHORT, READY_TO_TAXI, TAKING_OFF, TAXIING} from "../Aeroplane/aeroplaneStates";
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
        } else {
            this.runway = runway
        }
    }

    isActionable = () => {
        return !this.executed && this.aeroplane.is([HOLDING_SHORT, TAKING_OFF, FLYING])
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING])
    }

    validate = () => {
        let warnings = []
        let errors = []

        if (this.aeroplane.is([FLYING, TAKING_OFF, GOING_AROUND])) {
            errors.push('Cannot accept takeoff command right now')
        }

        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
    }

    apply = () => {
        if (this.map.runwayExists(this.aeroplane.positionDescription)) {
            this.runway = this.map.getRunwayInfo(this.aeroplane.positionDescription)
            this.targetX = this.runway.takeoffPoint.x
            this.targetY = this.runway.takeoffPoint.y
        }

        this.aeroplane.hasTakeoffClearance = false
        this.aeroplane.state = TAKING_OFF

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