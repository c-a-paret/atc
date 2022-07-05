import {GameState} from "./GameState";
import {TutorialMapOverview} from "./Tutorial/TutorialMapOverview";


export class Tutorial extends GameState {
    constructor(map, interfaceController) {
        super();
        this.setMap(map)
        this.interfaceController = interfaceController
        this.state = undefined
        this.transitionTo(new TutorialMapOverview(this.map))
    }

    transitionTo = (state) => {
        this.state = state
        this.state.setMachine(this)
    }

    tick = () => {
        if (!this.state.initialised) {
            this.state.init()
        }
        this.ticks += 1
    }

}