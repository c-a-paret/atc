export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
    }

    init() {
        this.interfaceController.init()
        // this.aeroplaneService.initArrival()
        this.aeroplaneService.initTestAeroplanes()
        this.aeroplaneService.aeroplanes.forEach(plane => this.uiController.drawAeroplane(plane))
    }

    start() {
        // setInterval(() => {
        //     this.aeroplaneService.initArrival()
        // }, 60000)

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