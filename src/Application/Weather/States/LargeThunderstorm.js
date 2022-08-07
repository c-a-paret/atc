export class LargeThunderstorm {
    constructor() {
        this.type = "LARGE"

        this.startX = 650
        this.startY = -100

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