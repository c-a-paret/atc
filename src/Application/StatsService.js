export class StatsService {
    constructor(interfaceController) {
        this.interfaceController = interfaceController
        this.landedCount = 0
        this.exitedBoundaryCount = 0
        this.proximityTimer = 0
        this.proximityTimerId = null
    }

    incrementLanded = () => {
        this.landedCount += 1
    }

    incrementExited = () => {
        this.exitedBoundaryCount += 1
    }

    startProximityTimer = () => {
        if (!this.proximityTimerId) {
            this.proximityTimerId = setInterval(() => {
                if (!this.interfaceController.gamePaused) {
                    this.proximityTimer += 1
                }
            }, 1000)
        }
    }

    stopProximityTimer = () => {
        clearInterval(this.proximityTimerId)
        this.proximityTimerId = null
    }

}