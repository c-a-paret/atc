export class StatsService {
    constructor(uiController) {
        this.uiController = uiController
        this.landedCount = 0
        this.exitedBoundaryCount = 0
    }

    incrementLanded = () => {
        this.landedCount += 1
        this.uiController.setStats(this.landedCount, this.exitedBoundaryCount)
    }

    incrementExited = () => {
        this.exitedBoundaryCount += 1
        this.uiController.setStats(this.landedCount, this.exitedBoundaryCount)
    }

}