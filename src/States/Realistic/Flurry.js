import {randomChoice} from "../../utils/selectors";
import {RealisticStart} from "./RealisticStart";
import {RealisticBase} from "./RealisticBase";


export class Flurry extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)
        console.log('Flurry mode')

        this.arrivalSpawnInterval = 30
        this.departureSpawnInterval = 40
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 5
        this.targetDepartures = 5
    }

    tick = () => {
        this.determineRunways()

        if (this.ticks !== 0 && this.machine.statsService.spawnedArrivals < this.targetArrivals && this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }
        if (this.ticks !== 0 && this.machine.statsService.spawnedArrivals < this.targetDepartures && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.targetWaypoints))
        }

        if (this.machine.statsService.totalLanded() === this.targetArrivals - 1 && this.machine.statsService.totalDeparted() >= this.targetDepartures - 1) {
            this.machine.transitionTo(new RealisticStart())
        }

        this.ticks += 1
    }

}