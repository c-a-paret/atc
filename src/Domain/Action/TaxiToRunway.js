import {getRandomNumberBetween} from "../../utils/maths";
import {HOLDING_SHORT, READY_TO_TAXI, TAXIING} from "../Aeroplane/aeroplaneStates";
import {Action} from "./Action";

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
        return this.taxiTime > 0
    }

    isFutureActionable = () => {
        return this.aeroplane.is([READY_TO_TAXI, TAXIING])
    }

    validate = () => {
        let warnings = []
        let errors = []

        if (!this.map.runwayExists(this.targetRunway)) {
            errors.push(`Runway ${this.targetRunway} does not exist`)
        }
        if (this.aeroplane.isNot([READY_TO_TAXI, TAXIING, HOLDING_SHORT])) {
            errors.push('Cannot accept taxi command right now')
        }

        return {
            isValid: errors.length === 0 && warnings.length === 0,
            warnings: warnings,
            errors: errors,
            targetValue: this.targetValue
        }
    }

    apply = () => {
        this.taxiTime -= 1
        if (this.taxiTime <= 0) {
            this.aeroplane.x = this.targetX
            this.aeroplane.y = this.targetY
            this.aeroplane.state = HOLDING_SHORT
            this.aeroplane.heading = this.runway.heading
            this.aeroplane.positionDescription = this.targetRunway
        }
    };

    copy = (aeroplane) => {
        return new TaxiToRunway(this.map, aeroplane, this.targetRunway)
    }
}