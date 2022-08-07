export class SmallThunderstorm {
    constructor() {
        this.type = "SMALL"

        this.startX = 400
        this.startY = 400

        this.x = this.startX
        this.y = this.startY

        this.endX = 800
        this.endY = 600
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
    }
}