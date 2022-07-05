import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialSelectingAircraftSidebar} from "./TutorialSelectingAircraftSidebar";

export class TutorialSelectingAircraftClicking {
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
        this._selectingAircraftClick()
        this.machine.interfaceController.showHint(
            "Selecting aircraft [Click]",
            "We always start by selecting an aircraft. There are several ways to do this.\n\n" +
            "Select one of the aircraft on the map by clicking on it.\n\n" +
            "The call sign will appear in the command entry field at the bottom of the map.\n\n" +
            "The strip in the right hand sidebar associated with that aeroplane will also be highlighted.\n\n" +
            "Try clicking one aircraft, then the other and see how the command entry and sidebar highlights change",
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
        this.machine.transitionTo(new TutorialSelectingAircraftSidebar(this.map))
    }

    _selectingAircraftClick = () => {
        const plane1 = new Aeroplane(
            'AB123',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.35 * this.map.mapBoundaries.maxY,
            200,
            90,
            5000,
            2)
        const plane2 = new Aeroplane(
            'CD789',
            'TUT',
            0.7 * this.map.mapBoundaries.maxX,
            0.1 * this.map.mapBoundaries.maxY,
            200,
            225,
            5000,
            2)
        this.machine.machine.aeroplanes.push(plane1)
        this.machine.machine.aeroplanes.push(plane2)
    }
}