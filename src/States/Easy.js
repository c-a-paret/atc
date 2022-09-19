import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {ARRIVAL, DEPARTURE} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";


export class Easy extends GameState {
    constructor(clearAircraftOnStart = false) {
        super();
        this.clearAircraftOnStart = clearAircraftOnStart
        this.machine = undefined
        this.initialised = false

        this.arrivalSpawnInterval = 170
        this.departureSpawnInterval = 140
        this.speedRange = [180, 220]
        this.altitudeRange = [5000, 7000]
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (!this.initialised && this.clearAircraftOnStart) {
            this.machine.weather.static()
            this.machine.clear()
            this.initialised = true
        } else {
            this.initialised = true
        }
        if (this.ticks % this.arrivalSpawnInterval === 0) {
            this.initArrival()
            // this.initTestAeroplanes()
        }
        if (this.ticks !== 0 && this.ticks % this.departureSpawnInterval === 0) {
            this.initDeparture()
        }

        this.ticks += 1
    }

    arrivalSpawnLocations = () => [
        {x: 0.2 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.5 * this.map.mapBoundaries.maxX, y: 1, heading: 180},
        {x: 0.7 * this.map.mapBoundaries.maxX, y: 1, heading: 225},
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
            weight
        )
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
            READY_TO_TAXI
        )
        this.machine.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {
        // const aeroplane1 = new Aeroplane("BA123", "A321", 1150, 470, 200, 270, 3000, 1)
        const aeroplane1 = new Aeroplane("BA123", "A321", 750, 470, 200, 90, 3000, 1, ARRIVAL, FLYING, null, 100)
        // const aeroplane1 = new Aeroplane("BA999", "A321", 1, 1, 0, 0, 0, 1, DEPARTURE, READY_TO_TAXI, "GWC")
        this.machine.aeroplanes = [
            aeroplane1,
            // aeroplane2,
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

        // aeroplane1.clearForLanding(this.map, "9L")
        // aeroplane1.setTaxiAndHold(this.map, "27L")
        // aeroplane1.setWaypoint(this.map, "GWC")
        // aeroplane1.setSpeed(this.map, 300)
        // aeroplane1.setAltitude(this.map, 40000)

        // this.machine.aeroplanes.forEach(plane => {
        //     plane.setAltitude(this.map, 4000)
        // })
    }


}