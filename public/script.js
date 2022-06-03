const parseCommand = (command) => {
    return {
        "callSign": command.substring(0, 5),
        "speed": parseSpeed(command)
    }
}

const parseSpeed = (command) => {
    const match = command.match(/S(\d{2,3})/g);
    if (match && match.length === 1) {
        return parseInt(match[0].substring(1))
    }
    return null
}

const initBackgroundLayer = () => {
    const background = document.getElementById("background");
    const ctx = background.getContext('2d');
    ctx.fillStyle = 'rgb(6,17,30)';

    background.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    background.height = document.body.clientHeight;

    console.log(background.width, background.height)
    ctx.fillRect(0, 0, background.width, background.height)
}

const initAeroplaneLayer = () => {
    const aeroplanesLayer = document.getElementById("aeroplanes");
    const planeContext = aeroplanesLayer.getContext('2d');

    aeroplanesLayer.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    aeroplanesLayer.height = document.body.clientHeight;

    return planeContext
}


const COLOURS = {
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


initBackgroundLayer()
const planeCtx = initAeroplaneLayer()

const plane1 = new Aeroplane(planeCtx, 400, 400, 100, 135)
const plane2 = new Aeroplane(planeCtx, 230, 320, 120, 97)
const plane3 = new Aeroplane(planeCtx, 600, 500, 240, 270)
const plane4 = new Aeroplane(planeCtx, 300, 700, 220, 350)

plane1.draw()
plane2.draw()
plane3.draw()
plane4.draw()

const sendCommand = () => {
    const rawCommand = document.getElementById("command-entry-field").value
    const command = parseCommand(rawCommand)
    console.log(command)

}