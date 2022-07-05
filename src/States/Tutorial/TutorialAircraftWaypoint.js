import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialAircraftSpeed} from "./TutorialAircraftSpeed";

export class TutorialAircraftWaypoint {
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
            "Waypoints",
            "You can send an aircraft directly to a waypoint.\n\n" +
            "The aircraft will turn the shortest distance and fly towards the specified waypoint.\n\n" +
            "Select the aircraft and type the command below into the command field after the call sign, and press Enter.",
            ">EPM",
            "This will direct the aircraft to turn and fly towards waypoint EPM (Epsom) towards the bottom of the map.\n\n" +
            "Notice that the heading indicator in the sidebar has turned Blue and references EPM, while the aeroplane label on the map still shows the current heading.\n\n" +
            "When the aeroplane reaches the waypoint, it will continue on its current heading.\n\n" +
            "Try some other waypoints and notice how the most recent command overrides a previous one.",
            "Next",
            this.next
        )
        this.initialised = true
    }

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.transitionTo(new TutorialAircraftSpeed(this.map))
    }

    _baseAircraft = () => {
        const plane = new Aeroplane(
            'GN231',
            'TUT',
            0.7 * this.map.mapBoundaries.maxX,
            0.2 * this.map.mapBoundaries.maxY,
            240,
            250,
            5000,
            1)
        this.machine.machine.aeroplanes.push(plane)
    }
}