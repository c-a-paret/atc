import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";


const ui = new UIController()
const aeroplaneService = new AeroplaneService()

const setupCommandInterface = () => {
    document.getElementById("send-command").addEventListener(
        "click",
        () => aeroplaneService.sendCommand(document.getElementById("command-entry-field").value)
    )
}

setupCommandInterface()

for (let x = 0; x < 10; x++) {
    aeroplaneService.initArrival()
}
aeroplaneService.aeroplanes.forEach(plane => ui.drawAeroplane(plane))


setInterval(() => {
    ui.clearAeroplaneLayer()
    aeroplaneService.aeroplanes.forEach(plane => {
        ui.drawAeroplane(plane)
        console.log(plane.actions)
    })
}, 5000)
