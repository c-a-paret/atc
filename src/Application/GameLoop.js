export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
    }

    init() {
        this.aeroplaneService.initArrival()
        // this.aeroplaneService.initTestAeroplanes()
        this.aeroplaneService.aeroplanes.forEach(plane => {
            this.uiController.drawAeroplane(plane)
        })
        this.interfaceController.drawStrips()
    }

    start() {
        // Arrival spawner
        setInterval(() => {
            if (!this.interfaceController.gamePaused && this.aeroplaneService.aeroplanes.length < 10) {
                this.aeroplaneService.initArrival()
            }
        }, 105000)

        // Stats display updater
        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                const landed = this.aeroplaneService.statsService.landedCount
                const lost = this.aeroplaneService.statsService.exitedBoundaryCount
                const restrictionsBreached = this.aeroplaneService.statsService.proximityTimer
                this.interfaceController.setStats(landed, lost, restrictionsBreached)
            }
        }, 1000)

        // Aeroplanes and strips display updater
        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                this.uiController.clearAeroplaneLayer()
                this.aeroplaneService.deactivateAeroplanes()
                this.aeroplaneService.markAeroplanesBreakingProximity()
                this.aeroplaneService.aeroplanes.forEach(plane => {
                    plane.applyActions()
                    this.uiController.drawAeroplane(plane)
                })
                this.interfaceController.clearInactiveStrips()
                this.interfaceController.drawStrips()
                this.interfaceController.updateStrips()
            }
        }, 900)
    }
}