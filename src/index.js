import {parseCommand} from "./CommandParser/CommandParser";
import {UIController} from "./Interface/UIController";


class Aeroplane {
    constructor(callSign, x, y, speed, hdg) {
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

const ui = new UIController()

ui.initBackgroundLayer()
ui.initAeroplaneLayer()

setupInterface()

ui.drawExclusionZone()

let planes = [
    new Aeroplane("AA792", 230, 320, 120, 97),
    new Aeroplane("PK324", 400, 400, 100, 135),
    new Aeroplane("BA767", 600, 500, 240, 270),
    new Aeroplane("LH132", 300, 700, 220, 350)
]

planes.forEach(plane => ui.drawAeroplane(plane))

// setInterval(() => {
//     ui.clearAeroplaneLayer()
// }, 5000)
