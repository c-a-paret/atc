import {parseCommand} from "./CommandParser/CommandParser";
import {
    clearAeroplaneLayer,
    initAeroplaneLayer,
    initBackgroundLayer,
    initFeaturesLayer
} from "./Interface/UIController";


const COLOURS = {
    YELLOW: 'rgb(252,210,100)',
    MINT: 'rgb(0,213,170)',
    RED: 'rgb(208,19,55)',
    BACKGROUND: 'rgb(18,19,49)'
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
    document.getElementById("send-command").addEventListener("click", sendCommand)
}


const drawExclusionZone = (ctx) => {
    ctx.strokeStyle = COLOURS.RED;
    ctx.beginPath();
    ctx.moveTo(500, 600)
    ctx.lineTo(550, 500)
    ctx.lineTo(600, 500)
    ctx.lineTo(600, 600)
    ctx.closePath()
    ctx.stroke();
}

setupInterface()
initBackgroundLayer()
const featuresContext = initFeaturesLayer()
drawExclusionZone(featuresContext)
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
