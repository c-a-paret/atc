export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
    }

    init() {
        this.interfaceController.init()
        // for (let x = 0; x < 5; x++) {
        //     aeroplaneService.initArrival()
        // }
        this.aeroplaneService.initTestAeroplanes()
        this.aeroplaneService.aeroplanes.forEach(plane => this.uiController.drawAeroplane(plane))
    }

    start() {
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