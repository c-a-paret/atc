import {randomChoice} from "../../utils/selectors";
import {RealisticStart} from "./RealisticStart";
import {RealisticBase} from "./RealisticBase";


export class Flurry extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)

        this.arrivalSpawnInterval = 30
        this.departureSpawnInterval = 40
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 2
        this.targetDepartures = 2
    }

    tick = () => {
        this.determineRunways()
        this.updateTargets()

        if (this.ticks !== 0 && this.machine.statsService.instanceSpawnedArrivals < this.targetArrivals && this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }
        if (this.ticks !== 0 && this.machine.statsService.instanceSpawnedDepartures < this.targetDepartures && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.targetWaypoints))
        }

        if (this.machine.statsService.instanceComplete() >= (this.targetArrivals + this.targetDepartures)) {
            this.machine.transitionTo(new RealisticStart(true))
        }

        this.ticks += 1
    }

}