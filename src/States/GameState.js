export class GameState {
    constructor() {
        this.machine = undefined
        this.map = undefined
        this.ticks = 0
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    setMap = (map) => {
        this.map = map
    }

    tick = () => {

    }

}