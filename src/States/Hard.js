import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {ARRIVAL, DEPARTURE} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";
import {randomChoice} from "../utils/selectors";


export class Hard extends GameState {
    constructor(clearAircraftOnStart = false) {
        super();
        this.clearAircraftOnStart = clearAircraftOnStart
        this.machine = undefined
        this.initialised = false

        this.arrivalSpawnInterval = 120
        this.departureSpawnInterval = 100
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]
        this.targetRunways = randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]])
        this.targetWaypoints = randomChoice([
            ["CPT", "CHT", "BPK", "DET", "EPM", "OCK"],
            ["LAM", "BPK", "MAY", "DET"],
            ["CPT", "CHT"],
            ["OCK", "EPM", "MAY"],
            ["CHT", "LAM", "BPK"],
            ["OCK"],
            ["DET"],
        ])
        this.targetRunwayPrefix = ''
    }

    setMachine = (machine) => {
        this.machine = machine
        this.init()
    }

    init = () => {
        this.machine.weather.dynamic()
        if (!this.initialised && this.clearAircraftOnStart) {
            this.machine.clear()
            this.initialised = true
        } else {
            this.initialised = true
        }
    }

    tick = () => {

        this.determineRunways()
        this.updateTargets()

        if (this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }
        if (this.ticks !== 0 && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.targetWaypoints))
        }

        this.ticks += 1
    }

    determineRunways = () => {
        if (this.machine.weather.wind.easterly()) {
            this.targetRunways = randomChoice([["9L", "9R"], ["9L"], ["9R"]])
            this.targetRunwayPrefix = '9'
        } else {
            this.targetRunways = randomChoice([["27L", "27R"], ["27L"], ["27R"]])
            this.targetRunwayPrefix = '27'
        }
    }

    updateTargets = () => {
        this.machine.aeroplanes.forEach(aeroplane => {
            if (aeroplane.isArrival() && !aeroplane.finalTarget.startsWith(this.targetRunwayPrefix)) {
                aeroplane.finalTarget = randomChoice(this.targetRunways)
            }
        })
    }

    arrivalSpawnLocations = () => [
        {x: 0.2 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.7 * this.map.mapBoundaries.maxX, y: 1, heading: 225},

        {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},
        {x: 0.7 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},

        {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
        {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

        {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
        {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
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
    }

}