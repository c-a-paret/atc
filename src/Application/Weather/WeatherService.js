import {DefaultStaticWind} from "./States/DefaultStaticWind";
import {ScatteredCloud} from "./States/ScatteredCloud";

export class Weather {
    constructor(map) {
        this.map = map
        this.wind = undefined
        this.clouds = undefined
        this.transitionWindTo(new DefaultStaticWind())
        this.transitionCloudsTo(new ScatteredCloud())
    }

    transitionWindTo = (windState) => {
        this.wind = windState
        this.wind.setMachine(this)
    }

    transitionCloudsTo = (cloudState) => {
        this.clouds = cloudState
        this.clouds.setMachine(this)
    }

    tick = () => {
        this.wind.tick()
        this.clouds.clouds = this.clouds.clouds.filter(cloud => !cloud.evaporated(this.map))
        this.clouds.tick(this.map)
        this.clouds.clouds.forEach(cloud => cloud.tick())
    }

    reset = () => {
        this.transitionWindTo(new DefaultStaticWind())
        this.transitionCloudsTo(new ScatteredCloud())
    }
}