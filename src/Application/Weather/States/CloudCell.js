import {getRandomFloatBetween, getRandomNumberBetween, round} from "../../../utils/maths";

export class CloudCell {
    constructor(startX, startY, numEdgePoints, startRadiusMin, startRadiusMax, wind, stable = false) {
        this.MIN_SIZE = 25
        this.wind = wind
        this.stable = stable

        this.x = startX
        this.y = startY

        this.angleInterval = Math.floor(360 / numEdgePoints)

        this.points = []
        for (let a = 0; a < 360; a += this.angleInterval) {
            this.points.push({angle: a, radius: getRandomNumberBetween(startRadiusMin, startRadiusMax)})
        }
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
        const windTravelDirection = this.wind.direction + 180

        const windRadians = (Math.PI / 180) * windTravelDirection
        const normalisedSpeed = Math.max(1, this.wind.speed / 18)

        this.x = round(this.x + normalisedSpeed * Math.sin(windRadians), 2);
        this.y = round(this.y - normalisedSpeed * Math.cos(windRadians), 2);

        this.updatePoints()
    }

    updatePoints = () => {
        if (!this.stable) {
            const rate = getRandomFloatBetween(0.1, 0.4);
            this._update_edges(-rate)
        }
    }

    evaporated = (map) => {
        if (this.stable) {
            const averageRadius = this.points.map(point => point.radius).reduce((a, b) => a + b, 0) / this.points.length
            const outsideX = (this.x < map.mapBoundaries.minX - averageRadius || this.x > map.mapBoundaries.maxX + averageRadius)
            const outsideY = (this.y < map.mapBoundaries.minY - averageRadius || this.y > map.mapBoundaries.maxY + averageRadius)
            return outsideX || outsideY
        } else {
            return this.points.every(point => point.radius < this.MIN_SIZE)
        }

    }
}