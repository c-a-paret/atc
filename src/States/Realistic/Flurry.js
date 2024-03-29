import {randomChoice} from "../../utils/selectors";
import {RealisticBase} from "./RealisticBase";
import {Quiet} from "./Quiet";


export class Flurry extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)

        this.arrivalSpawnInterval = 30
        this.departureSpawnInterval = 40
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 4
        this.targetDepartures = 4
    }

    tick = () => {
        this.determineRunways()
        this.updateTargets()

        if (this.machine.statsService.instanceSpawnedArrivals < this.targetArrivals && this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }
        if (this.ticks !== 0 && this.machine.statsService.instanceSpawnedDepartures < this.targetDepartures && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.targetWaypoints))
        }

        if (this.machine.statsService.instanceComplete() >= (this.targetArrivals + this.targetDepartures)) {
            this.machine.transitionTo(new Quiet())
        }

        this.ticks += 1
    }

}