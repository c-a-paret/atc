const initBackground = () => {
    const background = document.getElementById("background");
    const ctx = background.getContext('2d');
    ctx.fillStyle = 'rgb(6,17,30)';
    ctx.fillRect(0, 0, 800, 800)

}


COLOURS = {
    YELLOW: 'rgb(252,210,100)',
    MINT: 'rgb(0,213,170)'
}

class Aeroplane {
    constructor(ctx, x, y, speed, hdg) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
    }

    setSpeed = (speed) => {
        this.speed = speed
    }

    setHeading = (heading) => {
        this.heading = heading
    }

    draw = () => {
        this.position()
        this.drawAeroplaneSpeedTail()
        this.drawSpeedLabel()
        this.drawHeadingLabel()
    }

    position = () => {
        this.ctx.strokeStyle = COLOURS.YELLOW;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.ctx.stroke();
    }

    drawAeroplaneSpeedTail = () => {
        this.ctx.strokeStyle = COLOURS.YELLOW;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y)

        const oppositeHeading = this.heading + 180

        const headingRadians = (Math.PI / 180) * oppositeHeading
        const normalisedSpeed = this.speed / 4

        let tailEndX = this.x + normalisedSpeed * Math.sin(headingRadians);
        let tailEndY = this.y - normalisedSpeed * Math.cos(headingRadians);

        this.ctx.moveTo(tailEndX, tailEndY)
        this.ctx.lineTo(this.x, this.y)
        this.ctx.stroke();
    }

    drawSpeedLabel = () => {
        this.ctx.fillStyle = COLOURS.MINT;
        this.ctx.font = "bold 12px Courier New";
        this.ctx.beginPath();
        this.ctx.fillText(`${this.heading}`, this.x - 20, this.y - 20);
    }

    drawHeadingLabel = () => {
        this.ctx.fillStyle = COLOURS.YELLOW;
        this.ctx.font = "bold 12px Courier New";
        this.ctx.beginPath();
        const headingLabelWidth = this.ctx.measureText(`${this.heading}`).width;
        this.ctx.fillText(`${this.speed}`, this.x - 20 + headingLabelWidth + 5, this.y - 20);
    }
}


const aeroplanesLayer = document.getElementById("aeroplanes");
const planeCtx = aeroplanesLayer.getContext('2d');


const plane1 = new Aeroplane(planeCtx, 400, 400, 100, 135)
const plane2 = new Aeroplane(planeCtx, 230, 320, 120, 97)
const plane3 = new Aeroplane(planeCtx, 600, 500, 240, 270)
const plane4 = new Aeroplane(planeCtx, 300, 700, 220, 350)


initBackground()
plane1.draw()
plane2.draw()
plane3.draw()
plane4.draw()

