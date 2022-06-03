import {parseCommand} from "./CommandParser";


console.log("Script called...")
const initBackgroundLayer = () => {
    const background = document.getElementById("background");
    const ctx = background.getContext('2d');
    ctx.fillStyle = 'rgb(6,17,30)';

    background.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    background.height = document.body.clientHeight;

    ctx.fillRect(0, 0, background.width, background.height)
}

const initAeroplaneLayer = () => {
    const aeroplanesLayer = document.getElementById("aeroplanes");
    const planeContext = aeroplanesLayer.getContext('2d');

    aeroplanesLayer.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    aeroplanesLayer.height = document.body.clientHeight;

    return planeContext
}

const clearAeroplaneLayer = () => {
    const aeroplanesLayer = document.getElementById("aeroplanes");
    const planeContext = aeroplanesLayer.getContext('2d');

    planeContext.clearRect(0, 0, document.body.clientWidth - (document.body.clientWidth * 0.2), document.body.clientHeight);
}


const COLOURS = {
    YELLOW: 'rgb(252,210,100)',
    MINT: 'rgb(0,213,170)'
}

class Aeroplane {
    constructor(ctx, callSign, x, y, speed, hdg) {
        this.ctx = ctx;
        this.callSign = callSign;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
    }

    setSpeed = (speed) => {
        console.log(`${this.callSign} setting speed to ${speed}`)
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

const sendCommand = () => {
    const rawCommand = document.getElementById("command-entry-field").value
    const command = parseCommand(rawCommand)
    planes.forEach(plane => {
        if (plane.callSign === command.callSign) {
            plane.setSpeed(command.speed)
        }
    })
}


const setupInterface = () => {
    console.log("Adding event listener to submit button")
    document.getElementById("send-command").addEventListener("click", sendCommand)
}

initBackgroundLayer()
setupInterface()
const planeCtx = initAeroplaneLayer()


let planes = [
    new Aeroplane(planeCtx, "AA792", 230, 320, 120, 97),
    new Aeroplane(planeCtx, "PK324", 400, 400, 100, 135),
    new Aeroplane(planeCtx, "BA767", 600, 500, 240, 270),
    new Aeroplane(planeCtx, "LH132", 300, 700, 220, 350)
]


setInterval(() => {
    clearAeroplaneLayer()
    planes.forEach(plane => plane.draw())
}, 1000)
