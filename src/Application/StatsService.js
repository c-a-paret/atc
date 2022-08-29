import {round} from "../utils/maths";

export class StatsService {
    constructor() {
        this.spawnedArrivals = 0
        this.spawnedDepartures = 0

        this.instanceSpawnedArrivals = 0
        this.instanceSpawnedDepartures = 0
        this.instanceCorrectlyLandedCount = 0
        this.instanceCorrectlyDepartedCount = 0
        this.instanceIncorrectlyLandedCount = 0
        this.instanceIncorrectlyDepartedCount = 0
        this.instanceLostCount = 0
        this.instanceOutOfFuelCount = 0

        this.correctlyLandedCount = 0
        this.incorrectlyLandedCount = 0
        this.correctlyDepartedCount = 0
        this.incorrectlyDepartedCount = 0
        this.lostCount = 0
        this.outOfFuelCount = 0
        this.proximityTimer = 0
    }

    reset = () => {
        this.spawnedArrivals = 0
        this.spawnedDepartures = 0
        this.instanceSpawnedArrivals = 0
        this.instanceSpawnedDepartures = 0
        this.instanceCorrectlyLandedCount = 0
        this.instanceCorrectlyDepartedCount = 0
        this.instanceIncorrectlyLandedCount = 0
        this.instanceIncorrectlyDepartedCount = 0
        this.instanceLostCount = 0
        this.instanceOutOfFuelCount = 0

        this.correctlyLandedCount = 0
        this.incorrectlyLandedCount = 0
        this.correctlyDepartedCount = 0
        this.incorrectlyDepartedCount = 0
        this.lostCount = 0
        this.outOfFuelCount = 0
        this.proximityTimer = 0
    }

    resetInstanceStats = () => {
        this.instanceSpawnedArrivals = 0
        this.instanceSpawnedDepartures = 0
        this.instanceCorrectlyLandedCount = 0
        this.instanceCorrectlyDepartedCount = 0
        this.instanceIncorrectlyLandedCount = 0
        this.instanceIncorrectlyDepartedCount = 0
        this.instanceLostCount = 0
        this.instanceOutOfFuelCount = 0
    }

    seeInstance = () => {
        console.table({
            'spawnedArrivals': this.spawnedArrivals,
            'spawnedDepartures': this.spawnedDepartures,
            'instanceSpawnedArrivals': this.instanceSpawnedArrivals,
            'instanceSpawnedDepartures': this.instanceSpawnedDepartures,
            'instanceCorrectlyLandedCount': this.instanceCorrectlyLandedCount,
            'instanceCorrectlyDepartedCount': this.instanceCorrectlyDepartedCount,
            'instanceIncorrectlyLandedCount': this.instanceIncorrectlyLandedCount,
            'instanceIncorrectlyDepartedCount': this.instanceIncorrectlyDepartedCount,
            'instanceLostCount': this.instanceLostCount,
            'instanceOutOfFuelCount': this.instanceOutOfFuelCount,
        })
    }

    incrementSpawnedArrivalCount = () => {
        this.spawnedArrivals += 1
        this.instanceSpawnedArrivals += 1
    }

    incrementSpawnedDepartureCount = () => {
        this.spawnedDepartures += 1
        this.instanceSpawnedDepartures += 1
    }

    incrementCorrectlyLanded = () => {
        this.correctlyLandedCount += 1
        this.instanceCorrectlyLandedCount += 1
    }

    incrementIncorrectlyLanded = () => {
        this.incorrectlyLandedCount += 1
        this.instanceIncorrectlyLandedCount += 1
    }

    incrementCorrectlyDeparted = () => {
        this.correctlyDepartedCount += 1
        this.instanceCorrectlyDepartedCount += 1
    }

    incrementIncorrectlyDeparted = () => {
        this.incorrectlyDepartedCount += 1
        this.instanceIncorrectlyDepartedCount += 1
    }

    incrementLost = () => {
        this.lostCount += 1
        this.instanceLostCount += 1
    }

    incrementOutOfFuelCount = () => {
        this.outOfFuelCount += 1
        this.instanceOutOfFuelCount += 1
    }

    instanceComplete = () => {
        return this.instanceIncorrectlyLandedCount
            + this.instanceIncorrectlyDepartedCount
            + this.instanceCorrectlyLandedCount
            + this.instanceCorrectlyDepartedCount
            + this.instanceLostCount
            + this.instanceOutOfFuelCount
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

    instanceLanded = () => {
        return this.instanceCorrectlyLandedCount + this.instanceIncorrectlyLandedCount;
    }

    instanceDeparted = () => {
        return this.instanceCorrectlyDepartedCount + this.instanceIncorrectlyDepartedCount;
    }
}