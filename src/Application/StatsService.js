export class StatsService {
    constructor() {
        this.landedCount = 0
        this.exitedBoundaryCount = 0
        this.proximityTimer = 0
    }

    reset = () => {
        this.landedCount = 0
        this.exitedBoundaryCount = 0
        this.proximityTimer = 0
    }

    incrementLanded = () => {
        this.landedCount += 1
    }

    incrementExited = () => {
        this.exitedBoundaryCount += 1
    }

    incrementBreachedTimer = () => {
        this.proximityTimer += 1
    }
}