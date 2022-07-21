import {AIRCRAFT, SPECIAL_AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {DEPARTURE} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";


export class CoreGamePlay extends GameState {
    constructor() {
        super();
        this.machine = undefined
        this.initialised = false
        this.specialAircraftInterval = getRandomNumberBetween(480, 720)
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (!this.initialised) {
            this.machine.clear()
            this.initialised = true
        }
        if (this.ticks % 140 === 0) {
            // this.initTestAeroplanes()
            this.initArrival()
        }
        if (this.ticks % 105 === 0) {
            this.initDeparture()
        }
        if (this.ticks > 0 && this.ticks % this.specialAircraftInterval === 0) {
            this.initSpecialArrival()
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

    specialSpawnLocations = () => [
        {x: 0.8 * this.map.mapBoundaries.maxX, y: 1, heading: 240},
        {x: 1, y: 0.33 * this.map.mapBoundaries.maxY, heading: 90},
        {x: 1, y: 0.66 * this.map.mapBoundaries.maxY, heading: 90},
        {x: 0.8 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 300},
    ]


    initArrival = () => {
        const aeroplaneConfig = AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const spawnLocations = this.arrivalSpawnLocations()
        const location = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(180, 260), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(5000, 15000), 500)
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight)
        plane.setWaypoint(this.map, this.map.defaultWaypoint)
        this.machine.aeroplanes.push(plane)
    }

    initDeparture = () => {
        const aeroplaneConfig = AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const startX = 1
        const startY = 1
        const startHeading = 0
        const startSpeed = 0
        const startAltitude = this.map.features.runways[0].start.altitude
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight, DEPARTURE, READY_TO_TAXI)
        this.machine.aeroplanes.push(plane)
    }

    initSpecialArrival = () => {
        const aeroplaneConfig = SPECIAL_AIRCRAFT[Math.floor(Math.random() * SPECIAL_AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const spawnLocations = this.specialSpawnLocations()
        const location = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(aeroplaneConfig.minSpeed, aeroplaneConfig.maxSpeed), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(32000, 40000), 500)
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight)
        this.machine.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {
        // const aeroplane1 = new Aeroplane("BA123", "A321", 510, 455, 200, 90, 2500, 1)
        const aeroplane2 = new Aeroplane("BA999", "A321", 700, 50, 500, 30, 20000, 1, DEPARTURE, FLYING)
        this.machine.aeroplanes = [
            // aeroplane1,
            aeroplane2
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
        // aeroplane2.setTaxiAndHold(this.map, "9R")

        // this.machine.aeroplanes.forEach(plane => {
        //     plane.setAltitude(this.map, 4000)
        // })
    }
}