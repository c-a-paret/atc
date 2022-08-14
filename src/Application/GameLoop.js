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

    _determineGameSpeed = () => {
        return {
            1: 900,
            2: 300,
            3: 100
        }[this.interfaceController.gameSpeed]
    }

    weatherTick = () => {
        if (!this.interfaceController.gamePaused) {
            this.aeroplaneService.weather.tick()
            setTimeout(this.weatherTick, this._determineGameSpeed())
        }
    }

    stateTick = () => {
        if (!this.interfaceController.gamePaused && this.aeroplaneService.aeroplanes.length < 10) {
            this.aeroplaneService.tick()
            setTimeout(this.stateTick, this._determineGameSpeed())
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
            this.uiController.drawWeather()

            setTimeout(this.renderTick, this._determineGameSpeed())
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
            setTimeout(this.statsUpdaterTick, this._determineGameSpeed())
        }
    }

    start = () => {
        this.weatherTick()
        this.stateTick()
        this.statsUpdaterTick()
        this.renderTick()
    }
}