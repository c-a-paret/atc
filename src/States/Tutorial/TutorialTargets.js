import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {ARRIVAL, DEPARTURE, ILS_MAX_X} from "../../config/constants";
import {FLYING, HOLDING_SHORT, READY_TO_TAXI} from "../../Domain/Aeroplane/aeroplaneStates";

export class TutorialTargets {
    constructor(map) {
        this.map = map
        this.machine = undefined
        this.initialised = false
        this.hint = 0
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    init = () => {
        this.machine.machine.clear()
        this.next()
        this.initialised = true
    }

    next = (clearAeroplanes = true) => {
        if (clearAeroplanes) {
            this.machine.machine.clear()
        }
        this.machine.interfaceController.clearCommandEntry()
        this.machine.interfaceController.hideHint()
        this.machine.interfaceController.blurAttention()
        const hint = this.getHint(this.hint)
        hint.spawnFunction && hint.spawnFunction()
        hint.focusConfig && this.machine.interfaceController.focusAttention(hint.focusConfig)
        this.machine.interfaceController.showHint(
            hint.hintTitle,
            hint.hintBodyBefore,
            hint.hintCode,
            hint.hintBodyAfter,
            hint.confirmButtonText,
            hint.confirmButtonCallback
        )
        this.hint += 1
    }

    getHint = (index) => {
        const hints = [
            {
                hintTitle: "Aircraft targets",
                hintBodyBefore: "Now let's look at aircraft targets.\n\n" +
                    "There are two types of target:\n\n" +
                    "1. Target runways (landing aircraft)\n" +
                    "2. Target waypoints (departing aircraft)",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Target runways (Arrivals)",
                hintBodyBefore: "Sometimes an incoming aircraft will have a runway on which it must land.\n\n"
                    + "This runway will be specified in two ways:\n\n"
                    + "1. On the sidebar strip\n"
                    + "2. On the aircraft label\n\n" +
                    "Have a look at the aeroplane on the map. The target runway is shown in Pink.\n\n" +
                    "In this case it is runway 27R",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
                spawnFunction: this.arrivalWithTargetRunway
            },
            {
                hintTitle: "Target runways",
                hintBodyBefore: "You do not HAVE TO land the aircraft on its target runway.\n\n" +
                    "However, if you don't, it will not count as a successful landing and it will count against your 'Correct landings' percentage",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
            },
            {
                hintTitle: "Target runways - Stats",
                hintBodyBefore: "The aeroplane is now landing on runway 27R.\n\n"
                    + "Watch how the landing counter increases to 1 and how the correct landings percentage shows 100% when the aeroplane lands.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.landingWithTargetRunway
            },
            {
                hintTitle: "Target waypoints (Departures)",
                hintBodyBefore: "When an aircraft is departing, it may have a waypoint that it must depart towards.\n\n" +
                    "Like before this is shown in two ways:\n\n" +
                    "1. On the sidebar strip\n" +
                    "2. On the aircraft label\n\n" +
                    "Both are in Pink\n\n" +
                    "Note: Since this is a departure and the aircraft is ready to taxi, it is not yet on the map.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.departureWithTargetWaypoint
            },
            {
                hintTitle: "Target waypoints",
                hintBodyBefore: "The aeroplane is now taxiing to the runway.\n\n" +
                    "In the meantime, to count as a successful departure towards a waypoint the aircraft must:\n\n"
                    + "1. be faster than 200kts\n"
                    + "2. be at or above 2,000ft\n"
                    + "3. pass over the waypoint",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
                spawnFunction: this.departureWithTargetWaypointReadyToTakeoff,
            },
            {
                hintTitle: "Target waypoints",
                hintBodyBefore: "The aeroplane is now holding short and waiting for takeoff clearance at runway 9R.\n\n" +
                    "Clear the aircraft for takeoff",
                hintCode: "CTO",
                hintBodyAfter: "The aeroplane will depart towards the Mayfield (MAY) waypoint.\n\n" +
                    "When it reaches the waypoint, if it satisfies the speed and altitude requirements, it will be removed from the map.\n\n" +
                    "The stats will show a successful departure.\n\n" +
                    "If the aircraft does not pass the intended waypoint and ends up leaving the map, it will count as an unsuccessful departure.",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
            },
            {
                hintTitle: "Congratulations!",
                hintBodyBefore: "You have finished the tutorial.\n\n" +
                    "Click 'Game' at the top of the screen to start playing!",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "",
                confirmButtonCallback: undefined,
            },
        ]

        return hints[index]
    }

    arrivalWithTargetRunway = () => {
        const plane = new Aeroplane(
            'NS112',
            'TUT',
            140,
            225,
            220,
            100,
            5000,
            2,
            ARRIVAL,
            FLYING,
            '27R')
        this.machine.machine.aeroplanes.push(plane)
    }

    landingWithTargetRunway = () => {
        const plane = new Aeroplane(
            'NS112',
            'TUT',
            0.48 * this.map.mapBoundaries.maxX + ILS_MAX_X,
            0.5 * this.map.mapBoundaries.maxY,
            180,
            270,
            2800,
            2,
            ARRIVAL,
            FLYING,
            '27R')
        plane.setLanding(this.map, '27R')
        this.machine.machine.aeroplanes.push(plane)
    }

    departureWithTargetWaypoint = () => {
        const plane = new Aeroplane(
            'NS112',
            'TUT',
            1,
            1,
            0,
            0,
            0,
            2,
            DEPARTURE,
            READY_TO_TAXI,
            'MAY')
        this.machine.machine.aeroplanes.push(plane)
    }

    departureWithTargetWaypointReadyToTakeoff = () => {
        const plane = new Aeroplane(
            'NS112',
            'TUT',
            1,
            1,
            0,
            0,
            0,
            2,
            DEPARTURE,
            HOLDING_SHORT,
            'MAY')
        plane.setSpeed(this.map, 300)
        plane.setAltitude(this.map, 25000)
        plane.setWaypoint(this.map, 'MAY')
        plane.setTaxiAndHold(this.map, '9R')
        this.machine.machine.aeroplanes.push(plane)
    }
}