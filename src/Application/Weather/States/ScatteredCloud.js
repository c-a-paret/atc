import {CloudCell} from "./CloudCell";
import {getRandomNumberBetween} from "../../../utils/maths";
import {randomChoice} from "../../../utils/selectors";

export class ScatteredCloud {
    constructor() {
        this.machine = undefined
        this.clouds = []
        this.minClouds = 5
    }

    setMachine = (machine) => {
        this.machine = machine
        this.initialise()
    }

    initialise = () => {
        this.clouds = [
            new CloudCell(getRandomNumberBetween(100, 1100), getRandomNumberBetween(100, 700), 9, 90, 120, this.machine.wind),
            new CloudCell(getRandomNumberBetween(100, 1100), getRandomNumberBetween(100, 700), 18, 20, 40, this.machine.wind),
            new CloudCell(getRandomNumberBetween(100, 1100), getRandomNumberBetween(100, 700), 18, 10, 20, this.machine.wind),
            new CloudCell(getRandomNumberBetween(100, 1100), getRandomNumberBetween(100, 700), 18, 10, 20, this.machine.wind),
        ]
    }

    tick = (map) => {
        if (this.clouds.length < this.minClouds) {
            const maxX = map.maxX
            const maxY = map.maxY
            const startRadiusMin = getRandomNumberBetween(80, 120)
            const startRadiusMax = getRandomNumberBetween(120, 160)

            const newCloudSpawnLocations = {
                0: {
                    x: getRandomNumberBetween(100, maxX - 100),
                    y: 0 - 50
                },
                1: {
                    x: maxX + 50,
                    y: getRandomNumberBetween(100, maxY - 100)
                },
                2: {
                    x: getRandomNumberBetween(100, maxX - 100),
                    y: maxY + 50
                },
                3: {
                    x: 0 - 50,
                    y: getRandomNumberBetween(100, maxY - 100)
                },
            }
            const windDirection = this.machine.wind.directionIndex();
            const newX = newCloudSpawnLocations[windDirection].x
            const newY = newCloudSpawnLocations[windDirection].y
            const stable = randomChoice([true, false, false, false, false]);
            this.clouds.push(
                new CloudCell(
                    newX,
                    newY,
                    18,
                    startRadiusMin,
                    startRadiusMax,
                    this.machine.wind,
                    stable
                )
            )
        }
    }
}