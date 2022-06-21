export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
    }

    init() {
        this.aeroplaneService.initArrival()
        // this.aeroplaneService.initTestAeroplanes()
        this.aeroplaneService.aeroplanes.forEach(plane => this.uiController.drawAeroplane(plane))
    }

    start() {
        setInterval(() => {
            if (!this.interfaceController.gamePaused && this.aeroplaneService.aeroplanes.length < 10) {
                this.aeroplaneService.initArrival()
            }
        }, 105000)

        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                this.uiController.clearAeroplaneLayer()
                this.aeroplaneService.deactivateAeroplanes()
                this.aeroplaneService.markAeroplanesBreakingProximity()
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