import {Flying} from "./Flying";

export class FuelLeak extends Flying {

  constructor() {
    super();
    this.isEmergency = true
    this.fuelConsumptionRate = 0.5
  }
}
