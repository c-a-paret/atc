import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialAircraftHeading} from "./TutorialAircraftHeading";

export class TutorialSelectingAircraftSidebar {
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
        this._selectingAircraftSidebar()
        this.machine.interfaceController.showHint(
            "Selecting aircraft [Sidebar]",
            "You can also select an aircraft by clicking its associated strip in the right hand sidebar.\n\nLike before, the call sign will appear in the command entry field at the bottom of the map.",
            "",
            "",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialAircraftHeading(this.map))
    }

    _selectingAircraftSidebar = () => {
        const plane1 = new Aeroplane(
            'NM232',
            'TUT',
            0.75 * this.map.mapBoundaries.maxX,
            0.8 * this.map.mapBoundaries.maxY,
            200,
            295,
            5000,
            2)
        const plane2 = new Aeroplane(
            'LH562',
            'TUT',
            0.4 * this.map.mapBoundaries.maxX,
            0.4 * this.map.mapBoundaries.maxY,
            200,
            75,
            5000,
            2)
        this.machine.machine.aeroplanes.push(plane1)
        this.machine.machine.aeroplanes.push(plane2)
    }
}