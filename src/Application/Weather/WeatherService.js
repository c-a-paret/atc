import {DefaultStaticWind} from "./States/DefaultStaticWind";
import {CloudCell} from "./States/CloudCell";

export class Weather {
    constructor() {
        this.wind = undefined
        this.thunderstorms = [
            new CloudCell(9, 90, 120),
            new CloudCell(18, 40, 80),
            new CloudCell(18, 40, 80),
        ]
        this.transitionWindTo(new DefaultStaticWind())
    }

    transitionWindTo = (windState) => {
        this.wind = windState
        this.wind.setMachine(this)
    }

    tick = () => {
        this.wind.tick()
        this.thunderstorms = this.thunderstorms.filter(thunderstorm => !thunderstorm.evaporated())
        this.thunderstorms.forEach(thunderstorm => thunderstorm.tick())
    }

    reset = () => {
        this.transitionWindTo(new DefaultStaticWind())
    }
}