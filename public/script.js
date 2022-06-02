const canvas = document.getElementById("canvas");

class Aeroplane {
    constructor(ctx, x, y, hdg) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.speed = 100;
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
        this.drawLabel()
    }

    position = () => {
        this.ctx.fillStyle = 'rgb(133,132,132)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.ctx.stroke();
    }

    drawAeroplaneSpeedTail = () => {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y)

        const oppositeHeading = this.heading + 180

        const headingRadians = (Math.PI / 180) * oppositeHeading

        let tailEndX = this.x + this.speed * Math.sin(headingRadians);
        let tailEndY = this.y - this.speed * Math.cos(headingRadians);

        this.ctx.moveTo(tailEndX, tailEndY)
        this.ctx.lineTo(this.x, this.y)
        this.ctx.stroke();
    }

    drawLabel = () => {
        this.ctx.font = "20px";
        this.ctx.beginPath();
        this.ctx.fillText(`${this.heading} at ${this.speed}`, this.x - 20, this.y - 20);
    }
}

const ctx = canvas.getContext('2d');

const plane1 = new Aeroplane(ctx, 400, 400, 135)
const plane2 = new Aeroplane(ctx, 230, 320, 97)
const plane3 = new Aeroplane(ctx, 600, 500, 270)
const plane4 = new Aeroplane(ctx, 300, 700, 350)

plane1.draw()
plane2.draw()
plane3.draw()
plane4.draw()

