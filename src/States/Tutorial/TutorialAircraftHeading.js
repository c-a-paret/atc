import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialAircraftWaypoint} from "./TutorialAircraftWaypoint";

export class TutorialAircraftHeading {
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
        this._aircraftHeading()
        this.machine.interfaceController.showHint(
            "Turning aircraft",
            "Currently, LH534 is heading 90 degrees.\n\n" +
            "You can see this on the aircraft label its sidebar strip (the first of the three numbers).\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            "T180",
            "This will tell the aeroplane to turn to heading 180 degrees (directly south).\n\n" +
            "Watch the first number on the aircraft label change as the aircraft turns.\n\n" +
            "Notice also that the first number on the sidebar has changed to Blue and shows the target heading value.\n\n" +
            "Once the aircraft has reached the target heading, the sidebar value will display the current heading again, in White.\n\n" +
            "You can choose any value between 000 and 360 degrees, always as three digits.",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialAircraftWaypoint(this.map))
    }

    _aircraftHeading = () => {
        const plane = new Aeroplane(
            'LH534',
            'TUT',
            0.5 * this.map.mapBoundaries.maxX,
            0.3 * this.map.mapBoundaries.maxY,
            180,
            90,
            5000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}