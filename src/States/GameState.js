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

    applyActions = (map, weather) => {
        this.machine.aeroplanes.forEach(plane => {
            plane.applyActions()
            plane.simulatePath(this.map, this.map.features.restrictedZones)
        })
    }
}