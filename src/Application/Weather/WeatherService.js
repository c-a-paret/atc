import {DefaultStaticWind} from "./States/DefaultStaticWind";
import {SmallThunderstorm} from "./States/SmallThunderstorm";
import {LargeThunderstorm} from "./States/LargeThunderstorm";

export class Weather {
    constructor() {
        this.wind = undefined
        // this.thunderstorms = [
        //     new SmallThunderstorm(),
        //     new LargeThunderstorm()
        // ]
        this.transitionWindTo(new DefaultStaticWind())
    }

    transitionWindTo = (windState) => {
        this.wind = windState
        this.wind.setMachine(this)
    }

    tick = () => {
        this.wind.tick()
        // this.thunderstorms.forEach(thunderstorm => thunderstorm.tick())
    }

    reset = () => {
        this.transitionWindTo(new DefaultStaticWind())
    }
}