import {randomChoice} from "../../utils/selectors";
import {Flurry} from "./Flurry";
import {RealisticBase} from "./RealisticBase";


export class Quiet extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)
        console.log('Quiet mode')

        this.arrivalSpawnInterval = 120
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 2
    }

    tick = () => {
        this.determineRunways()

        if (this.machine.statsService.spawnedArrivals < this.targetArrivals && this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }

        if (this.machine.statsService.totalLanded() === this.targetArrivals - 1) {
            this.machine.transitionTo(new Flurry())
        }

        this.ticks += 1
    }
}