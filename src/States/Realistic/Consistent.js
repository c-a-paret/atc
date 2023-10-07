import {randomChoice} from "../../utils/selectors";
import {RealisticBase} from "./RealisticBase";
import {Quiet} from "./Quiet";


export class Consistent extends RealisticBase {
    constructor(initStandalone = false) {
        super(initStandalone)

        this.arrivalSpawnInterval = 120
        this.departureSpawnInterval = 85
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]

        this.targetArrivals = 20
        this.targetDepartures = 20
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

    arrivalSpawnLocations = () => [
        {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},

        {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
    ]


}
