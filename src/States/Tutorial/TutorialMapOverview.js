import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {TutorialSelectingAircraftClicking} from "./TutorialSelectingAircraftClicking";

export class TutorialMapOverview {
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

    next = () => {
        this.machine.machine.clear()
        this.machine.interfaceController.clearCommandEntry()
        this.machine.interfaceController.hideHint()
        const hint = this.getHint(this.hint)
        hint.spawnFunction && hint.spawnFunction()
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
        this.machine.transitionTo(new TutorialSelectingAircraftClicking(this.map))
    }

    getHint = (index) => {
        const hints = [
            {
                hintTitle: "Welcome!",
                hintBodyBefore: "Your goal in this game is to issue commands to aircraft to guide them to land on a runway.\n\n" +
                    "While doing this, avoid guiding planes into restricted areas or getting the planes too close to one another.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Overview",
                hintBodyBefore: "This tutorial will take you through the interface and the core gameplay.\n\n"
                    + "You are looking at an air traffic control radioscope.\n\n"
                    + "This is a map of the surrounding area of an airport. In this case London Heathrow.\n\n"
                    + "The view is from above.\n\n"
                    + "The airport is exactly in the middle of the map.\n\n"
                    + "Click 'Next' to continue (you may need to scroll down inside this panel).",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Runways",
                hintBodyBefore: "In the middle of the map are two horizontal green lines.\n\n"
                    + "These are the runways.\n\n"
                    + "The labels on the end of the runways show how to reference the runway.\n\n"
                    + "The structure is the runway heading (in tens of degrees) and its position in relation to other runways.\n\n"
                    + "For example, 27L means the runway has a heading of 270 degrees and is to the left of other runways.\n\n"
                    + "Equally, 9R means the runway has a heading of 090 degrees and is to the right of other runways.\n\n"
                    + "There are two runways but four directions from which aircraft can land, namely: 9L, 9R, 27L and 27R.\n\n",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Waypoints",
                hintBodyBefore: "Waypoints are shown as dotted circles with a dot in the centre and a three character label above.\n\n" +
                    "Just above the runways there is the LON waypoint.\n\n" +
                    "A short distance above that, is the CHT waypoint.\n\n" +
                    "Waypoints are used to make navigation easier which we will see later.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Aeroplanes",
                hintBodyBefore: "An aeroplane has been placed on the map.\n\n" +
                    "Just above the aeroplane, is a label that shows current information about the aeroplane.\n\n" +
                    "At the top is its Call Sign (AB123). This is how you refer to the plane.\n\n" +
                    "The three numbers underneath show:\n\n" +
                    "- Heading (90 degrees, directly East)\n" +
                    "- Speed (200 knots)\n" +
                    "- Altitude (6000ft)\n\n" +
                    "Note: altitude is specified in 100s of feet",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.basicAeroplane
            },
            {
                hintTitle: "Aeroplane speed tail",
                hintBodyBefore: "An aeroplane also has a tail of slashes.\n\n" +
                    "This tail denotes the speed of the aeroplane and its direction.\n\n" +
                    "Compare the two aeroplanes currently on the map.\n\n" +
                    "One is at 200 knots and its tail is shorter.\n\n" +
                    "The other is at 300 knots and its tail is longer.\n\n",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.speedComparisonAeroplanes
            },
            {
                hintTitle: "Restricted Zones",
                hintBodyBefore: "Some areas of the map are restricted.\n\n" +
                    "This is because they are above populated or protected areas.\n\n" +
                    "Three types of restricted zones exist:\n\n" +
                    "- Critical (red)\n" +
                    "- Moderate (orange)\n" +
                    "- Informational (blue)\n\n" +
                    "These zones have a label, for example: EG(R)-157 and indicators for the minimum and/or maximum altitude.\n\n" +
                    "- An orange number shows the minimum altitude\n" +
                    "- A white number shows the maximum altitude.\n\n" +
                    "The altitudes are given in 100s of feet. For example, 30 means 3000ft and 250 means 25,000ft.\n\n" +
                    "If there are no numbers, then the zone is always out of bounds.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Breaching Restricted Zones",
                hintBodyBefore: "An aircraft is heading towards a restricted zone.\n\n" +
                    "The orange zone ahead, EG(R)-157, has a minimum altitude of 3000ft and a maximum altitude of 5000ft.\n\n" +
                    "The aircraft is currently at 2500ft.\n\n" +
                    "When the aircraft enters the restricted zone, it will breach the restrictions and you will be penalised.\n\n" +
                    "The aeroplane will be highlighted in red and the timer in the top right corner will start counting up.\n\n" +
                    "When the aeroplane leaves the area or its altitude falls within restrictions, the timer will stop and the plane will revert to its original colours.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.towardsRestrictionBreach
            },
            {
                hintTitle: "Controlling Aircraft",
                hintBodyBefore: "At the bottom of the screen, in the middle, is the command entry field.\n\n" +
                    "This is where you will type commands to aeroplanes.\n\n" +
                    "Let's see how that works",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.nextTutorialMode,
            }
        ]

        return hints[index]
    }

    basicAeroplane = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.25 * this.map.mapBoundaries.maxY,
            200,
            90,
            6000,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    speedComparisonAeroplanes = () => {
        const plane1 = new Aeroplane(
            'AB123',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.25 * this.map.mapBoundaries.maxY,
            200,
            90,
            2500,
            2)
        const plane2 = new Aeroplane(
            'CD456',
            'TUT',
            0.1 * this.map.mapBoundaries.maxX,
            0.4 * this.map.mapBoundaries.maxY,
            300,
            90,
            2500,
            2)
        this.machine.machine.aeroplanes.push(plane1)
        this.machine.machine.aeroplanes.push(plane2)
    }

    towardsRestrictionBreach = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.55 * this.map.mapBoundaries.maxX,
            0.45 * this.map.mapBoundaries.maxY,
            220,
            90,
            2500,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

}