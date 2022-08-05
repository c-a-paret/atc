import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {ARRIVAL, DEPARTURE, Difficulty} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";
import {TargetsGamePlay} from "./TargetsGamePlay";
import {randomChoice} from "../utils/selectors";


export class StartGameState extends GameState {
    constructor(clearAircraftOnStart = false, difficulty) {
        super();
        this.clearAircraftOnStart = clearAircraftOnStart
        this.machine = undefined
        this.initialised = false

        this.arrivalsSent = 0
        this.departuresSent = 0
        this.spawnInterval = difficulty === Difficulty.EASY ? 200 : 100
        this.targetRunways = difficulty === Difficulty.EASY ? [null] : ["9L", "9R"]
        this.targetWaypoints = difficulty === Difficulty.EASY ? [null] : ["LAM", "BPK", "MAY", "DET"]
        this.speedRange = difficulty === Difficulty.EASY ? [180, 220] : [220, 300]
        this.altitudeRange = difficulty === Difficulty.EASY ? [5000, 7000] : [6000, 15000]
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (!this.initialised && this.clearAircraftOnStart) {
            this.machine.clear()
            this.initialised = true
        } else {
            this.initialised = true
        }
        if (this.ticks % this.spawnInterval === 0) {
            if (this.arrivalsSent < 3) {
                this.initArrival(randomChoice(this.targetRunways))
            } else if (this.departuresSent < 3) {
                this.initDeparture(randomChoice(this.targetWaypoints))
            }
        }

        if (this.arrivalsSent === 3 && this.departuresSent === 3) {
            this.machine.transitionTo(new TargetsGamePlay())
        }

        this.ticks += 1
    }

    arrivalSpawnLocations = () => [
        {x: 0.2 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.7 * this.map.mapBoundaries.maxX, y: 1, heading: 225},
    ]

    initArrival = (targetWaypoint = null) => {
        const aeroplaneConfig = AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const spawnLocations = this.arrivalSpawnLocations()
        const location = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(...this.speedRange), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(...this.altitudeRange), 500)
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(
            callSign,
            shortClass,
            startX,
            startY,
            startSpeed,
            startHeading,
            startAltitude,
            weight,
            ARRIVAL,
            FLYING,
            targetWaypoint
        )
        this.machine.aeroplanes.push(plane)
        this.arrivalsSent += 1
    }

    initDeparture = (targetRunway = null) => {
        const aeroplaneConfig = AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const startX = 1
        const startY = 1
        const startHeading = 0
        const startSpeed = 0
        const startAltitude = this.map.features.runways[0].start.altitude
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(
            callSign,
            shortClass,
            startX,
            startY,
            startSpeed,
            startHeading,
            startAltitude,
            weight,
            DEPARTURE,
            READY_TO_TAXI,
            targetRunway
        )
        this.machine.aeroplanes.push(plane)
        this.departuresSent += 1
    }

}