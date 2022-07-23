import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {ARRIVAL, DEPARTURE} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";
import {randomChoice} from "../utils/selectors";
import {CoreGamePlay} from "./CoreGamePlay";


export class TargetsGamePlay extends GameState {
    constructor() {
        super();
        this.machine = undefined

        this.landingRunways = ["9L", "9R"]
        this.departureWaypoints = ["LAM", "MAY", "DET", "BPK", "GWC"]
    }


    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (this.ticks !== 0 && this.ticks % 160 === 0) {
            this.initArrival()
        }
        if (this.ticks % 150 === 0) {
            // this.initTestAeroplanes()
            this.initDeparture()
        }
        if (this.ticks === 300) {
            this.landingRunways = ["27L", "27R"]
            this.departureWaypoints = ["CHT", "CPT", "GWC", "MAY", "DET", "LAM"]
        }
        if (this.ticks === 300) {
            this.machine.transitionTo(new CoreGamePlay())
        }
        this.ticks += 1
    }

    arrivalSpawnLocations = () => [
        {x: 0.2 * this.map.mapBoundaries.maxX, y: 1, heading: 135},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: 1, heading: 135},
        {x: 0.8 * this.map.mapBoundaries.maxX, y: 1, heading: 225},
        {x: 1, y: 0.33 * this.map.mapBoundaries.maxY, heading: 110},
        {x: 1, y: 0.66 * this.map.mapBoundaries.maxY, heading: 80},
        {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 20},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},
        {x: 0.8 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 340},
    ]

    initArrival = () => {
        const aeroplaneConfig = randomChoice(AIRCRAFT)
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const spawnLocations = this.arrivalSpawnLocations()
        const location = randomChoice(spawnLocations)
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(180, 260), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(5000, 15000), 500)
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight, ARRIVAL, FLYING, randomChoice(this.landingRunways))
        plane.setWaypoint(this.map, this.map.defaultWaypoint)
        this.machine.aeroplanes.push(plane)
    }

    initDeparture = () => {
        const aeroplaneConfig = randomChoice(AIRCRAFT)
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const startX = 1
        const startY = 1
        const startHeading = 0
        const startSpeed = 0
        const startAltitude = this.map.features.runways[0].start.altitude
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight, DEPARTURE, READY_TO_TAXI, randomChoice(this.departureWaypoints))
        this.machine.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {
        const aeroplane1 = new Aeroplane("BA123", "A321", 580, 450, 800, 360, 2000, 1, DEPARTURE, FLYING, "LAM")
        const aeroplane2 = new Aeroplane("BA456", "A321", 1000, 325, 300, 30, 2000, 1, DEPARTURE, FLYING, "LAM")
        const aeroplane3 = new Aeroplane("BA789", "A321", 1000, 325, 300, 30, 3000, 1, DEPARTURE, FLYING, "BPK")
        const aeroplane4 = new Aeroplane("BA101", "A321", 1000, 325, 400, 30, 7000, 1, DEPARTURE, FLYING, "BPK")
        this.machine.aeroplanes = [
            aeroplane1,
            aeroplane2,
            aeroplane3,
            aeroplane4
            // new Aeroplane("BA789", "A321", 500, 400, 200, 135, 6000, 1),
            // new Aeroplane("BA101", "A321", 500, 500, 200, 180, 6000, 1),
            // new Aeroplane("BA112", "A321", 500, 250, 200, 305, 6000, 1),
            // new Aeroplane("BA131", "A321", 500, 350, 200, 270, 6000, 1),
            // new Aeroplane("BA415", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA161", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA171", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA181", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA191", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA202", "A321", 500, 450, 200, 225, 6000, 1),
            // new Aeroplane("BA212", "A321", 500, 450, 200, 225, 6000, 1),
        ]

        // aeroplane1.setLanding(this.map, "9R")
        aeroplane2.setWaypoint(this.map, "LAM")
        aeroplane3.setWaypoint(this.map, "BPK")
        aeroplane4.setWaypoint(this.map, "BPK")
        // aeroplane2.setTaxiAndHold(this.map, "9R")

        // this.machine.aeroplanes.forEach(plane => {
        //     plane.setAltitude(this.map, 4000)
        // })
    }

}