import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialAircraftAltitude} from "./TutorialAircraftAltitude";
import {MAX_SPEED, MIN_SPEED} from "../../config/constants";
import {TutorialAircraftMultipleCommands} from "./TutorialAircraftMultipleCommands";

export class TutorialAircraftHolding {
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
            "Holding pattern",
            "When things get overwhelming or you need more time, you can direct an aircraft to enter a holding pattern.\n\n" +
            "This causes the aircraft to turn in a circle until you direct it otherwise.\n\n" +
            "The holding pattern can be to the right (R) or to the left (L).\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            "HR",
            "This will direct the aircraft to enter a holding pattern to the right.\n\n" +
            "Notice in the sidebar that the heading indicator now shows a Blue 'Hold'. This will remain until you issue a different directional command.",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialAircraftMultipleCommands(this.map))
    }

    _baseAircraft = () => {
        const plane = new Aeroplane(
            'GN231',
            'TUT',
            0.4 * this.map.mapBoundaries.maxX,
            0.2 * this.map.mapBoundaries.maxY,
            210,
            90,
            5000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}