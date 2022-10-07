import {AircraftState} from "./AircraftState";

export class ReadyToTaxi extends AircraftState {
    constructor() {
        super();
        this.name = 'READY_TO_TAXI'
    }
}
