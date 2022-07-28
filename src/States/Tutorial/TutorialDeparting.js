import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {DEPARTURE} from "../../config/constants";
import {READY_TO_TAXI} from "../../Domain/Aeroplane/aeroplaneStates";
import {TutorialTargets} from "./TutorialTargets";

export class TutorialDeparting {
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

    nextTutorialMode = () => {
        this.machine.transitionTo(new TutorialTargets(this.map))
    }

    getHint = (index) => {
        const hints = [
            {
                hintTitle: "Departing aircraft",
                hintBodyBefore: "So far we have seen how to control aircraft and how to get them to land.\n\n" +
                    "Next we will look at how to direct an aircraft to taxi, takeoff and depart in the direction we want.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Identifying a departure",
                hintBodyBefore: "Aircraft that are looking to depart will not appear on the map as they are still waiting at the airport gate.\n\n"
                    + "A departing aircraft has been spawned and is ready to be issued commands.\n\n"
                    + "Notice the new, pale blue sidebar strip. Notice also, that its current heading, speed and altitude values are all 0 and the aircraft state in the top right of the strip says 'Ready'.\n\n"
                    + "This shows you that the aircraft is ready to taxi and can be issued commands.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
                spawnFunction: this.newDeparture
            },
            {
                hintTitle: "Future Commands (optional)",
                hintBodyBefore: "At any point before takeoff, you may issue commands to the aircraft that will be actioned once the aircraft is flying. You can change these as often as you like.\n\n" +
                    "Try issuing a waypoint, speed and altitude command, e.g.:",
                hintCode: ">MAYS300A280",
                hintBodyAfter: "Notice that the target values have been updated on the sidebar strip, but that there is no aircraft on the map yet.\n\n" +
                    "Later we will see what happens after takeoff if you decide not to issue commands in advance.",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
            },
            {
                hintTitle: "Taxiing",
                hintBodyBefore: "Now let's issue taxi clearance and have the aircraft hold short of our desired runway.\n\n"
                    + "Let's say we want the aircraft to taxi to runway 9R so that it can take off towards the East (90 degrees).\n\n"
                    + "Use the following command:",
                hintCode: "TH9R",
                hintBodyAfter: "This stands for T(axi) and H(old) short of runway 9R.\n\n" +
                    "Now, the aircraft will begin its taxi (note the 'Taxi' state in the top right of the sidebar strip), which could take some time and eventually you will see it appear at the end of the runway.\n\n" +
                    "The strip will then update the aircraft state with the current runway at which it is waiting.\n\n" +
                    "The aircraft is now heading 90 degrees on runway 9R and ready to take off.\n\n",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
            },
            {
                hintTitle: "Clearing for takeoff",
                hintBodyBefore: "When an aircraft is holding short of a runway it can accept takeoff clearance.\n\n" +
                    "Issue the C(leared) for T(ake) O(ff) command:",
                hintCode: "CTO",
                hintBodyAfter: "The aircraft will accelerate down the runway to reach 200kts, takeoff, fly the runway heading and then climb and maintain 2,000ft.\n\n" +
                    "If you did NOT issue future commands, the aircraft will continue on this course.\n\n" +
                    "If you did issue future commands, these will begin to be actioned once 200kts and 2,000ft are achieved.\n\n" +
                    "Hopefully you entered the command in the previous step and should now see the aircraft taking off, climbing, accelerating and turning towards the MAY waypoint.\n\n" +
                    "Turn on Projected Paths above if you haven't done so already to help visualise the route the aircraft will take!",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
            },
            {
                hintTitle: "Departing aircraft - your turn",
                hintBodyBefore: "Now it is your turn.\n\n"
                    + "Guide the waiting aircraft to depart towards Brookman's Park (BPK).\n\n"
                    + "Consider which runway makes most sense and T(axi) and H(old) before issuing the C(leared) for T(ake) O(ff) command.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: () => this.next(false),
                spawnFunction: this.theirTurnDeparture
            },
            {
                hintTitle: "Successful departing aircraft",
                hintBodyBefore: "A departure counts as successful when the aircraft leaves the map.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
            },
            {
                hintTitle: "Congratulations!",
                hintBodyBefore: "You have learned how to control departing aircraft.\n\n" +
                    "Next, we will step things up a introduce targets and statistics",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.nextTutorialMode,
            },
        ]

        return hints[index]
    }

    newDeparture = () => {
        const plane = new Aeroplane(
            'YK423',
            'TUT',
            1,
            1,
            0,
            0,
            0,
            2,
            DEPARTURE,
            READY_TO_TAXI)
        this.machine.machine.aeroplanes.push(plane)
    }

    theirTurnDeparture = () => {
        const plane = new Aeroplane(
            'UN903',
            'TUT',
            1,
            1,
            0,
            0,
            0,
            2,
            DEPARTURE,
            READY_TO_TAXI)
        this.machine.machine.aeroplanes.push(plane)
    }


}