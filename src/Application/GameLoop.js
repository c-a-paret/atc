export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService, statsService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
        this.statsService = statsService

    }

    init() {
        this.aeroplaneService.tick()
        // this.aeroplaneService.initTestAeroplanes()
        this.uiController.drawAeroplanes()
        this.interfaceController.drawStrips()
    }

    start() {
        // State ticker
        setInterval(() => {
            if (!this.interfaceController.gamePaused && this.aeroplaneService.aeroplanes.length < 10) {
                this.aeroplaneService.tick()
            }
        }, 1000)

        // Stats updater
        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                if (this.aeroplaneService.aeroplanes.some(plane => plane.breachingProximity)) {
                    this.statsService.incrementBreachedTimer()
                }
                this.interfaceController.setStats(
                    this.statsService.landedCount,
                    this.statsService.exitedBoundaryCount,
                    this.statsService.proximityTimer
                )
            }
        }, 1000)

        // Aeroplanes and strips display updater
        setInterval(() => {
            if (!this.interfaceController.gamePaused) {
                this.uiController.clearAeroplaneLayer()

                this.aeroplaneService.deactivateAeroplanes()
                this.aeroplaneService.markAeroplanesBreakingProximity()
                this.aeroplaneService.applyActions()

                this.uiController.drawAeroplanes()

                this.interfaceController.clearInactiveStrips()
                this.interfaceController.drawStrips()
                this.interfaceController.updateStrips()
            }
        }, 900)
    }
}