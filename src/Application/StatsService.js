export class StatsService {
    constructor() {
        this.landedCount = 0
        this.departedCount = 0
        this.lostCount = 0
        this.proximityTimer = 0
    }

    reset = () => {
        this.landedCount = 0
        this.lostCount = 0
        this.proximityTimer = 0
    }

    incrementLanded = () => {
        this.landedCount += 1
    }

    incrementDeparted = () => {
        this.departedCount += 1
    }

    incrementLost = () => {
        this.lostCount += 1
    }

    incrementBreachedTimer = () => {
        this.proximityTimer += 1
    }
}