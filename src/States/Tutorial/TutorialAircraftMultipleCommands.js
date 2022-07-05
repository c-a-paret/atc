import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialLanding} from "./TutorialLanding";

export class TutorialAircraftMultipleCommands {
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
        this._baseAircraft()
        this.machine.interfaceController.showHint(
            "Multiple Commands",
            "You can issue multiple commands at the same time.\n\n" +
            "Try issuing heading, speed and altitude commands at the same time.\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            "T135S200A38",
            "This will direct the aircraft to turn to heading 135, reduce speed to 200 and descend to 3800ft.\n\n" +
            "Watch all the relevant indicators change and all values in the sidebar turn Blue until they are attained.\n\n" +
            "Note that an aircraft can be in a holding pattern and accept speed and altitude commands so that the aircraft reduces speed and descends whilst holding.",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialLanding(this.map))
    }

    _baseAircraft = () => {
        const plane = new Aeroplane(
            'GN231',
            'TUT',
            0.2 * this.map.mapBoundaries.maxX,
            0.2 * this.map.mapBoundaries.maxY,
            280,
            90,
            5000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}