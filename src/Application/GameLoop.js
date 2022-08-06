import {DEFAULT_TICK_INTERVAL} from "../config/constants";

export class GameLoop {
    constructor(uiController, interfaceController, aeroplaneService, statsService) {
        this.uiController = uiController
        this.interfaceController = interfaceController
        this.aeroplaneService = aeroplaneService
        this.statsService = statsService
        this.interfaceController.setUnPauseCallback(this.start)
    }

    init = () => {
        this.aeroplaneService.tick()
        this.uiController.drawAeroplanes()
        this.interfaceController.drawStrips()
    }

    weatherTick = () => {
        if (!this.interfaceController.gamePaused) {
            this.aeroplaneService.weather.tick()
            setTimeout(this.weatherTick, DEFAULT_TICK_INTERVAL / this.interfaceController.gameSpeed)
        }
    }

    stateTick = () => {
        if (!this.interfaceController.gamePaused && this.aeroplaneService.aeroplanes.length < 10) {
            this.aeroplaneService.tick()
            setTimeout(this.stateTick, DEFAULT_TICK_INTERVAL / this.interfaceController.gameSpeed)
        }
    }

    renderTick = () => {
        if (!this.interfaceController.gamePaused) {
            this.uiController.clearAeroplaneLayer()

            this.aeroplaneService.deactivateAeroplanes()
            this.aeroplaneService.markAeroplanesBreakingProximity()
            this.aeroplaneService.applyActions()
            this.aeroplaneService.consumeFuel()

            this.uiController.drawAeroplanes()

            this.interfaceController.clearInactiveStrips()
            this.interfaceController.drawStrips()
            this.interfaceController.updateStrips()

            this.interfaceController.updateWindIndicator()

            setTimeout(this.renderTick, DEFAULT_TICK_INTERVAL / this.interfaceController.gameSpeed)
        }
    }

    statsUpdaterTick = () => {
        if (!this.interfaceController.gamePaused) {
            if (this.aeroplaneService.aeroplanes.some(plane => plane.breachingProximity)) {
                this.statsService.incrementBreachedTimer()
            }
            this.interfaceController.setStats(
                this.statsService.totalLanded(),
                this.statsService.correctlyLandedPercentage(),
                this.statsService.totalDeparted(),
                this.statsService.correctlyDepartedPercentage(),
                this.statsService.lostCount,
                this.statsService.proximityTimer,
                this.statsService.outOfFuelCount
            )
            setTimeout(this.statsUpdaterTick, DEFAULT_TICK_INTERVAL / this.interfaceController.gameSpeed)
        }
    }

    start = () => {
        this.weatherTick()
        this.stateTick()
        this.statsUpdaterTick()
        this.renderTick()
    }
}