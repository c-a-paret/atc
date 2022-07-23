import {round} from "../utils/maths";

export class StatsService {
    constructor() {
        this.correctlyLandedCount = 0
        this.incorrectlyLandedCount = 0
        this.correctlyDepartedCount = 0
        this.incorrectlyDepartedCount = 0
        this.lostCount = 0
        this.proximityTimer = 0
    }

    reset = () => {
        this.correctlyLandedCount = 0
        this.incorrectlyLandedCount = 0
        this.correctlyDepartedCount = 0
        this.incorrectlyDepartedCount = 0
        this.lostCount = 0
        this.proximityTimer = 0
    }

    incrementCorrectlyLanded = () => {
        this.correctlyLandedCount += 1
    }

    incrementIncorrectlyLanded = () => {
        this.incorrectlyLandedCount += 1
    }

    incrementCorrectlyDeparted = () => {
        this.correctlyDepartedCount += 1
    }

    incrementIncorrectlyDeparted = () => {
        this.incorrectlyDepartedCount += 1
    }

    incrementLost = () => {
        this.lostCount += 1
    }

    incrementBreachedTimer = () => {
        this.proximityTimer += 1
    }

    correctlyLandedPercentage = () => {
        if (this.totalLanded() === 0) {
            return 0
        }
        return round((this.correctlyLandedCount / this.totalLanded()) * 100, 0)
    }

    correctlyDepartedPercentage = () => {
        if (this.totalDeparted() === 0) {
            return 0
        }
        return round((this.correctlyDepartedCount / this.totalDeparted()) * 100, 0)
    }

    totalLanded = () => {
        return this.correctlyLandedCount + this.incorrectlyLandedCount;
    }

    totalDeparted = () => {
        return this.correctlyDepartedCount + this.incorrectlyDepartedCount;
    }
}