import {getRandomNumberBetween} from "../utils/common";

export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
    }

    init() {
        this.interfaceController.init()
        this.aeroplaneService.initArrival()
        // this.aeroplaneService.initTestAeroplanes()
        this.aeroplaneService.aeroplanes.forEach(plane => this.uiController.drawAeroplane(plane))
    }

    start() {
        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                if ([0, 1][Math.floor(Math.random() * [0, 1].length)]) {
                    this.aeroplaneService.initArrival()
                    this.aeroplaneService.initArrival()
                } else {
                    this.aeroplaneService.initArrival()
                }
            }
        }, 90000)

        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                this.uiController.clearAeroplaneLayer()
                this.aeroplaneService.deactivateAeroplanes()
                this.aeroplaneService.aeroplanes.forEach(plane => {
                    if (plane.active) {
                        plane.applyActions()
                        this.uiController.drawAeroplane(plane)
                    }
                })
            }
        }, 900)
    }
}