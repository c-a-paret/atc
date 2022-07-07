import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";


export class CoreGamePlay extends GameState {
    constructor() {
        super();
        this.machine = undefined
        this.initialised = false
    }

    setMachine = (machine) => {
        this.machine = machine
    }

    tick = () => {
        if (!this.initialised) {
            this.machine.clear()
            this.initialised = true
        }
        if (this.ticks % 105 === 0) {
            this.initTestAeroplanes()
            // this.initArrival()
        }
        this.ticks += 1
    }

    spawnLocations = () => [
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
        const aeroplaneConfig = AIRCRAFT[Math.floor(Math.random() * AIRCRAFT.length)]
        const callSign = `${aeroplaneConfig.operatorIATA}${getRandomNumberBetween(100, 999)}`
        const shortClass = aeroplaneConfig.shortClass
        const spawnLocations = this.spawnLocations()
        const location = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(180, 260), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(5000, 8000), 500)
        const weight = aeroplaneConfig.weight
        const plane = new Aeroplane(callSign, shortClass, startX, startY, startSpeed, startHeading, startAltitude, weight)
        plane.setWaypoint(this.map, this.map.defaultWaypoint)
        this.machine.aeroplanes.push(plane)
    }

    initTestAeroplanes = () => {
        this.machine.aeroplanes = [
            new Aeroplane("BA123", "A321", 450, 440, 200, 90, 2200, 1),
            // new Aeroplane("BA999", "A321", 300, 425, 200, 90, 6000, 1),
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

        // this.aeroplanes.forEach(plane => {
        //     plane.setLanding(this.map, "9L")
        // })
    }
}