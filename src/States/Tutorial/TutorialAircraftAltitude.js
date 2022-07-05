import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../config/constants";

export class TutorialAircraftAltitude {
    constructor(map) {
        this.map = map
        this.machine = undefined
        this.initialised = false
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    init = () => {
        this.machine.machine.clear()
        this._aircraftSpeed()
        this.machine.interfaceController.showHint(
            "Controlling altitude",
            "Currently, BA354 is flying at 8000 feet.\n\n" +
            "You can see this on the aircraft label and its sidebar strip (the last of the three numbers).\n\n" +
            "Notice that on the aircraft label the altitude is specified in 100s of feet (80) but in the sidebar it is shown in its full form.\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            "A40",
            "This will tell the aeroplane to change altitude to 4000 feet.\n\n" +
            "Notice that the altitude command is also specified in 100s of feet.\n\n" +
            "Watch the last number on the aircraft label change as the aircraft slows down.\n\n" +
            "Like before, the relevant number on the label and sidebar change.\n\n" +
            `You can choose any value between ${MIN_ALTITUDE}ft and ${MAX_ALTITUDE}ft.`,
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()

    }

    _aircraftSpeed = () => {
        const plane = new Aeroplane(
            'BA354',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.25 * this.map.mapBoundaries.maxY,
            260,
            90,
            8000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}