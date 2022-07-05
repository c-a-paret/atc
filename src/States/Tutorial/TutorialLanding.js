import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {ILS_MAX_X} from "../../config/constants";

export class TutorialLanding {
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

    getHint = (index) => {
        const hints = [
            {
                hintTitle: "Landing aircraft",
                hintBodyBefore: "So far we have seen how to control aircraft direction, speed and altitude.\n\n" +
                    "Next we will look at how to issue a landing clearance.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Landing - Location",
                hintBodyBefore: "To issue a landing clearance, the aircraft must be within certain tolerances:\n\n"
                    + "- At or below 3000ft\n"
                    + "- At or below 200 knots\n"
                    + "- Facing the runway on which to land\n"
                    + "- Within 10 degrees of the runway heading\n"
                    + "- Within the width of the landing feather\n"
                    + "- Horizontally within the inner line of the runway feather\n\n"
                    + "The runway 'feather' is the faded grey dotted arrow-shaped line extending from the end of each runway.\n\n"
                    + "Let's see some INCORRECT landing configurations in which an aircraft will NOT accept landing clearance.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next
            },
            {
                hintTitle: "Landing - Incorrect Location",
                hintBodyBefore: "Let's say we're aiming to land on runway 9L.\n\n"
                    + "This aeroplane is correctly facing the runway heading but it is too far to the left of the runway (when facing the runway).\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.notNearRunway
            },
            {
                hintTitle: "Landing - Too far away",
                hintBodyBefore: "Aiming for runway 9L, the aircraft is facing the correct direction.\n\n"
                    + "However the aircraft is too far away from the landing feather for now.\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.tooFarAway
            },
            {
                hintTitle: "Landing - Too close",
                hintBodyBefore: "Aiming for runway 9L, the aircraft is facing the correct direction.\n\n"
                    + "However the aircraft is too close to the runway and has travelled beyond the horizontal line inside the runway feather.\n\n"
                    + "This means the aircraft will not have enough time to execute its landing procedure.\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.tooClose
            },
            {
                hintTitle: "Landing - Incorrect Heading",
                hintBodyBefore: "Again we're aiming for 9L.\n\n"
                    + "This aeroplane is in line with the runway but not heading within 10 degrees of the runway heading.\n\n"
                    + "The aeroplane is heading 070 degrees while the runway has a heading of 090 degrees.\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.notCorrectHeading
            },
            {
                hintTitle: "Landing - Incorrect Speed",
                hintBodyBefore: "We are correctly lined up for runway 9L.\n\n"
                    + "However this aeroplane is too fast, travelling at 240 knots.\n\n"
                    + "It should be at or below 200 knots to accept landing clearance.\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.tooFast
            },
            {
                hintTitle: "Landing - Incorrect Altitude",
                hintBodyBefore: "We are correctly lined up for runway 9L and travelling at a good speed.\n\n"
                    + "However this aeroplane is too high, currently at 4000ft.\n\n"
                    + "It should be at or below 3000 feet to accept landing clearance.\n\n"
                    + "Therefore landing clearance will not be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.tooHigh
            },
            {
                hintTitle: "Landing - Correct Configuration",
                hintBodyBefore: "Now let's look at a correct landing configuration that will allow landing clearance to be accepted.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
            },
            {
                hintTitle: "Landing - Correct Configuration",
                hintBodyBefore: "This aeroplane is facing the runway and within 10 degrees of the runway heading.\n\n"
                    + "It's speed is below 200 and it is below 3000 feet.\n\n"
                    + "Therefore landing clearance WILL be accepted.\n\n"
                    + "Let's issue the landing clearance next.",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.correctConfiguration
            },
            {
                hintTitle: "Issuing Landing Clearance",
                hintBodyBefore: "Select the aircraft and type the following command to issue landing clearance for runway 9L:",
                hintCode: ".9L.",
                hintBodyAfter: "Notice that the sidebar strip shows a Blue 'Landing' indicator and watch the aircraft label values change as the aircraft follows its landing procedure on your behalf.\n\n" +
                    "Once the aircraft lands on the runway, the aircraft and its associated sidebar strip will disappear and the 'Landed' count in the top right corner of the screen will go up by one.\n\n",
                confirmButtonText: "Next",
                confirmButtonCallback: this.next,
                spawnFunction: this.correctConfiguration
            },
            {
                hintTitle: "Congratulations!",
                hintBodyBefore: "You have landed your first plane and finished the tutorial.\n\n" +
                    "Click 'Game' at the top of the screen to start playing!",
                hintCode: "",
                hintBodyAfter: "",
                confirmButtonText: "",
                confirmButtonCallback: undefined,
            },
        ]

        return hints[index]
    }

    notNearRunway = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.3 * this.map.mapBoundaries.maxX,
            0.4 * this.map.mapBoundaries.maxY,
            200,
            90,
            6000,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    tooFarAway = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.25 * this.map.mapBoundaries.maxX,
            0.5 * this.map.mapBoundaries.maxY,
            200,
            90,
            4000,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    tooClose = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.4 * this.map.mapBoundaries.maxX,
            0.5 * this.map.mapBoundaries.maxY,
            200,
            90,
            2500,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    notCorrectHeading = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.32 * this.map.mapBoundaries.maxX,
            0.52 * this.map.mapBoundaries.maxY,
            200,
            70,
            2500,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    tooFast = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.33 * this.map.mapBoundaries.maxX,
            0.5 * this.map.mapBoundaries.maxY,
            240,
            90,
            2500,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    tooHigh = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.33 * this.map.mapBoundaries.maxX,
            0.5 * this.map.mapBoundaries.maxY,
            180,
            90,
            4000,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

    correctConfiguration = () => {
        const plane = new Aeroplane(
            'AB123',
            'TUT',
            0.48 * this.map.mapBoundaries.maxX - ILS_MAX_X,
            0.5 * this.map.mapBoundaries.maxY,
            180,
            90,
            2800,
            2)
        this.machine.machine.aeroplanes.push(plane)
    }

}