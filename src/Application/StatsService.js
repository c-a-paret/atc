export class StatsService {
    constructor(uiController) {
        this.uiController = uiController
        this.landedCount = 0
        this.exitedBoundaryCount = 0
        this.proximityTimer = 0
        this.proximityTimerId = null
    }

    incrementLanded = () => {
        this.landedCount += 1
        this.uiController.setStats(this.landedCount, this.exitedBoundaryCount)
    }

    incrementExited = () => {
        this.exitedBoundaryCount += 1
        this.uiController.setStats(this.landedCount, this.exitedBoundaryCount)
    }

    startProximityTimer = () => {
        if (!this.proximityTimerId) {
            this.proximityTimerId = setInterval(() => {
                this.proximityTimer += 1
            }, 1000)
        }
    }

    stopProximityTimer = () => {
        clearInterval(this.proximityTimerId)
        this.proximityTimerId = null
    }

}