import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialAircraftAltitude} from "./TutorialAircraftAltitude";
import {MAX_SPEED, MIN_SPEED} from "../../config/constants";

export class TutorialAircraftSpeed {
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
            "Controlling speed",
            "Currently, EZ887 is flying at 260 knots.\n\n" +
            "You can see this on the aircraft label and its sidebar strip (the middle of the three numbers).\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            "S200",
            "This will tell the aeroplane to slow down to 200 knots.\n\n" +
            "Watch the second number on the aircraft label change as the aircraft slows down.\n\n" +
            "Like before, the second number on the sidebar has changed to Blue and shows the target speed value and will change back to white once the aircraft has reached the target speed.\n\n" +
            `You can choose any value between ${MIN_SPEED} and ${MAX_SPEED} knots.\n\n` +
            "Notice how the length of the tail of the aircraft becomes shorter as the speed reduces.",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialAircraftAltitude(this.map))
    }

    _aircraftSpeed = () => {
        const plane = new Aeroplane(
            'EZ887',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.1 * this.map.mapBoundaries.maxY,
            260,
            110,
            8000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}