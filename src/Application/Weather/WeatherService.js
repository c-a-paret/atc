import {DefaultStaticWind} from "./States/DefaultStaticWind";
import {ScatteredCloud} from "./States/ScatteredCloud";
import {DynamicWind} from "./States/DynamicWind";

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

    static = () => {
        this.transitionWindTo(new DefaultStaticWind())
        this.transitionCloudsTo(new ScatteredCloud())
    }

    dynamic = () => {
        this.transitionWindTo(new DynamicWind())
        this.transitionCloudsTo(new ScatteredCloud())
    }
}