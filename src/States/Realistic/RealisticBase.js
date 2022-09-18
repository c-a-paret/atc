import {GameState} from "../GameState";
import {randomChoice} from "../../utils/selectors";
import {AIRCRAFT} from "../../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../../utils/maths";
import {Aeroplane} from "../../Domain/Aeroplane/Aeroplane";
import {ARRIVAL, DEPARTURE} from "../../config/constants";
import {FLYING, READY_TO_TAXI} from "../../Domain/Aeroplane/aeroplaneStates";


export class RealisticBase extends GameState {
    constructor(initStandalone = false) {
        super()
        this.initStandalone = initStandalone

        this.machine = undefined
        this.initialised = false

        this.targetRunways = randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]])
        this.targetWaypoints = randomChoice([
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
        if (this.initStandalone) {
            this.machine.weather.dynamic()
            this.machine.clear()
        }
        this.machine.statsService.resetInstanceStats()
    }

    tick = () => {
        throw Error('Not implemented')
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
            if (aeroplane.isArrival() && !aeroplane.isLanding() && aeroplane.altitude > 3500 && !aeroplane.finalTarget.startsWith(this.targetRunwayPrefix)) {
                aeroplane.finalTarget = randomChoice(this.targetRunways)
            }
        })
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
        this.machine.statsService.incrementSpawnedArrivalCount()
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
        this.machine.statsService.incrementSpawnedDepartureCount()
    }

}