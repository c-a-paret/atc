import {DefaultStaticWind} from "./States/DefaultStaticWind";

export class Weather {
    constructor() {
        this.wind = undefined
        this.transitionWindTo(new DefaultStaticWind())
    }

    transitionWindTo = (windState) => {
        this.wind = windState
        this.wind.setMachine(this)
    }

    tick = () => {
        this.wind.tick()
    }

    reset = () => {
        this.transitionWindTo(new DefaultStaticWind())
    }
}