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