import {AircraftState} from "./AircraftState";
import {LANDING} from "../aeroplaneStates";

export class FinalApproach extends AircraftState {

    constructor() {
        super();
        this.name = LANDING
    }
}
