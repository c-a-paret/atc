import {randomChoice} from "../../utils/selectors";
import {Quiet} from "./Quiet";
import {RealisticBase} from "./RealisticBase";


export class RealisticStart extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)

        this.arrivalSpawnInterval = 120
        this.departureSpawnInterval = 100
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 2
        this.targetDepartures = 5
    }

    tick = () => {
        this.determineRunways()
        this.updateTargets()

        if (this.initStandalone && !this.initialised) {
            for (let x = 0; x < 3; x++) {
                this.initDeparture(randomChoice(this.targetWaypoints))
            }
            this.initialised = true
        }

        if (this.ticks !== 0 && this.machine.statsService.instanceSpawnedArrivals < this.targetArrivals && this.ticks % this.arrivalSpawnInterval === 0) {
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