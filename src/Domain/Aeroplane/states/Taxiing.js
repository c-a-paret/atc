import {AircraftState} from "./AircraftState";

export class Taxiing extends AircraftState {
    constructor() {
        super();
        this.name = 'TAXIING'
    }
}
