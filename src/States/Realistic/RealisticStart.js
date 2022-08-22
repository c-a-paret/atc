import {GameState} from "../GameState";
import {randomChoice} from "../../utils/selectors";
import {AIRCRAFT} from "../../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../../utils/maths";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {ARRIVAL, DEPARTURE} from "../../config/constants";
import {FLYING, READY_TO_TAXI} from "../../Domain/Aeroplane/aeroplaneStates";
import {CoreGamePlay} from "../CoreGamePlay";


export class RealisticStart extends GameState {
    constructor(clearAircraftOnStart = false) {
        super()
        this.clearAircraftOnStart = clearAircraftOnStart
        this.machine = undefined
        this.initialised = false

        this.arrivalSpawnInterval = 120
        this.departureSpawnInterval = 100
        this.speedRange = [220, 280]
        this.altitudeRange = [9000, 15000]
        this.targetRunways = randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]])
        this.targetWaypoints = randomChoice([
            ["LAM", "BPK", "MAY", "DET"],
            ["CPT", "CHT"],
            ["OCK", "EPM", "MAY"],
            ["CHT", "LAM", "BPK"],
            ["OCK"],
            ["DET"],
        ])

        this.numArrivals = 2
        this.numDepartures = 2

        this.spawnedArrivals = 0
        this.spawnedDepartures = 0
    }

    setMachine = (machine) => {
        this.machine = machine
        this.init()
    }

    init = () => {
        this.machine.weather.dynamic()
        if (this.clearAircraftOnStart) {
            this.machine.clear()
        }
    }

    tick = () => {
        if (this.machine.weather.wind.easterly()) {
            this.targetRunways = randomChoice([["9L", "9R"], ["9L"], ["9R"]])
        } else {
            this.targetRunways = randomChoice([["27L", "27R"], ["27L"], ["27R"]])
        }

        if (this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.targetRunways))
        }
        if (this.ticks !== 0 && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.targetWaypoints))
        }

        if (this.spawnedArrivals >= this.numArrivals && this.spawnedDepartures >= this.numDepartures) {
            this.machine.transitionTo(new CoreGamePlay())
        }

        this.ticks += 1

    }

    arrivalSpawnLocations = () => [
        {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
        {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

        {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
        {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
    ]

    initArrival = (targetRunway = null) => {
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
            targetRunway
        )
        this.machine.aeroplanes.push(plane)
        this.spawnedArrivals += 1
    }

    initDeparture = (targetWaypoint = null) => {
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
            targetWaypoint
        )
        this.machine.aeroplanes.push(plane)
        this.spawnedDepartures += 1
    }

}