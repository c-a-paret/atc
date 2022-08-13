import {getRandomFloatBetween, getRandomNumberBetween} from "../../../utils/maths";

export class CloudCell {
    constructor(numEdgePoints, startRadiusMin, startRadiusMax) {
        this.MIN_SIZE = 2

        this.startX = getRandomNumberBetween(100, 1100)
        this.startY = getRandomNumberBetween(100, 700)

        this.x = this.startX
        this.y = this.startY

        this.angleInterval = Math.floor(360 / numEdgePoints)

        this.points = []
        for (let a = 0; a < 360; a += this.angleInterval) {
            this.points.push({angle: a, radius: getRandomNumberBetween(startRadiusMin, startRadiusMax)})
        }

        const endpoint = getRandomNumberBetween(100, 1100)

        this.endX = endpoint
        this.endY = endpoint
    }

    _update_edges = (rate) => {
        this.points.forEach(point => {
            point.radius += getRandomNumberBetween(rate * 0.5, rate * 2)
            if (point.radius < 2) {
                point.radius = 0
            }
        })
    }

    tick = () => {
        if (this.x < this.endX) {
            this.x += 0.5
        } else {
            this.x -= 0.5
        }
        if (this.y < this.endY) {
            this.y += 0.5
        } else {
            this.y -= 0.5
        }
        this.updatePoints()
    }

    updatePoints = () => {
        const rate = getRandomFloatBetween(0.1, 0.4);
        this._update_edges(-rate)
    }

    evaporated = () => {
        return this.points.every(point => point.radius < this.MIN_SIZE)
    }
}