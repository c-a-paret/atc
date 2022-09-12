import {AIRCRAFT} from "../config/aircraft";
import {getRandomNumberBetween, roundToNearest} from "../utils/maths";
import {Aeroplane} from "../Domain/Aeroplane/Aeroplane";
import {GameState} from "./GameState";
import {ARRIVAL, DEPARTURE} from "../config/constants";
import {FLYING, READY_TO_TAXI} from "../Domain/Aeroplane/aeroplaneStates";
import {randomChoice} from "../utils/selectors";


export class Dynamic extends GameState {
    constructor(clearAircraftOnStart = false) {
        super();
        this.clearAircraftOnStart = clearAircraftOnStart
        this.machine = undefined
        this.initialised = false

        this.difficulty_adjusting_interval = 240

        this.difficultyScore = 0
        this.currentDifficultyConfig = undefined

        this.targetRunways = randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]]),
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
        this.shouldDetermineDifficulty() && this.determineDifficulty()

        this.currentDifficultyConfig.determineLandingRunways()
        this.currentDifficultyConfig.updateLandingTargets()

        if (this.currentDifficultyConfig.arrivalSpawnInterval && this.ticks % this.currentDifficultyConfig.arrivalSpawnInterval === 0) {
            this.initArrival(randomChoice(this.currentDifficultyConfig.targetRunways))
        }

        if (this.ticks !== 0 && this.currentDifficultyConfig.departureSpawnInterval && this.ticks % this.currentDifficultyConfig.departureSpawnInterval === 0) {
            this.initDeparture(randomChoice(this.currentDifficultyConfig.targetWaypoints))
        }

        this.ticks += 1
    }

    shouldDetermineDifficulty = () => {
        return this.ticks === 0 ||
            (this.ticks !== 0 && this.ticks % this.difficulty_adjusting_interval === 0)
    }

    determineDifficulty = () => {
        if (this.userPerformingWell()) {
            this.difficultyScore = Math.min(this.difficultyScore + 1, 4)
        } else if (this.userPerformingPoorly()) {
            this.difficultyScore = Math.max(0, this.difficultyScore - 1)
        }
        this.currentDifficultyConfig = this.difficultyConfig(this.difficultyScore)
    }

    userPerformingWell = () => {
        // return this.ticks !== 0 && true
        return this.machine.statsService.correctlyLandedPercentage() > 80
            && this.machine.statsService.correctlyDepartedPercentage() > 80
            && this.machine.statsService.lostPercentage() < 10
    }

    userPerformingPoorly = () => {
        // return false
        return this.machine.statsService.correctlyLandedPercentage() < 60
            && this.machine.statsService.correctlyDepartedPercentage() < 60
            && this.machine.statsService.lostPercentage() > 25
    }

    difficultyConfig = (difficultyScore) => {
        const difficultyConfigMap = {
            0: {
                arrivalSpawnInterval: 170,
                departureSpawnInterval: 140,
                speedRange: [170, 200],
                altitudeRange: [5000, 7000],
                targetRunways: null,
                targetWaypoints: null,
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                }
            },
            1: {
                arrivalSpawnInterval: 150,
                departureSpawnInterval: 120,
                speedRange: [200, 210],
                altitudeRange: [6000, 9000],
                targetRunways: null,
                targetWaypoints: null,
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            2: {
                arrivalSpawnInterval: 140,
                departureSpawnInterval: 110,
                speedRange: [210, 230],
                altitudeRange: [7000, 10000],
                targetRunways: null,
                targetWaypoints: null,
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            3: {
                arrivalSpawnInterval: 110,
                departureSpawnInterval: 100,
                speedRange: [220, 240],
                altitudeRange: [7000, 10000],
                targetRunways: null,
                targetWaypoints: ["LAM", "BPK", "MAY", "DET"],
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            4: {
                arrivalSpawnInterval: 100,
                departureSpawnInterval: 90,
                speedRange: [240, 260],
                altitudeRange: [10000, 14000],
                targetRunways: null,
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            5: {
                arrivalSpawnInterval: 100,
                departureSpawnInterval: 90,
                speedRange: [240, 280],
                altitudeRange: [12000, 16000],
                targetRunways: null,
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            6: {
                arrivalSpawnInterval: 100,
                departureSpawnInterval: 90,
                speedRange: [240, 280],
                altitudeRange: [12000, 16000],
                targetRunways: ["9L", "9R", "27L", "27R"],
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            7: {
                arrivalSpawnInterval: 120,
                departureSpawnInterval: 110,
                speedRange: [240, 280],
                altitudeRange: [12000, 16000],
                targetRunways: randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]]),
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                },
                determineLandingRunways: () => {
                },
            },
            8: {
                arrivalSpawnInterval: 120,
                departureSpawnInterval: 110,
                speedRange: [240, 280],
                altitudeRange: [12000, 16000],
                targetRunways: randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]]),
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET", "GWC"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                    ["LAM"],
                    ["DET"],
                    ["GWC"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},
                    {x: 0.7 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                    this.updateTargets()
                },
                determineLandingRunways: () => {
                    this.determineLandingRunwayDirections()
                },
            },
            9: {
                arrivalSpawnInterval: 120,
                departureSpawnInterval: 110,
                speedRange: [240, 280],
                altitudeRange: [12000, 16000],
                targetRunways: randomChoice([["9L", "9R"], ["27L", "27R"], ["9L"], ["9R"], ["27L"], ["27R"]]),
                targetWaypoints: randomChoice([
                    ["LAM", "BPK", "MAY", "DET", "GWC"],
                    ["OCK", "EPM", "MAY"],
                    ["CPT", "CHT"],
                    ["LAM"],
                    ["DET"],
                    ["GWC"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},
                    {x: 0.7 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                    this.updateTargets()
                },
                determineLandingRunways: () => {
                    this.determineLandingRunwayDirections()
                },
            },
            10: {
                arrivalSpawnInterval: 120,
                departureSpawnInterval: 140,
                speedRange: [250, 300],
                altitudeRange: [12000, 18000],
                targetRunways: randomChoice([["9L"], ["9R"], ["27L"], ["27R"]]),
                targetWaypoints: randomChoice([
                    ["CPT", "CHT"],
                    ["OCK", "EPM"],
                    ["EPM", "CHT"]
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 90},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},
                    {x: 0.7 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                    this.updateTargets()
                },
                determineLandingRunways: () => {
                    this.determineLandingRunwayDirections()
                }
            },
            11: {
                arrivalSpawnInterval: 80,
                departureSpawnInterval: 100,
                speedRange: [280, 320],
                altitudeRange: [15000, 22000],
                targetRunways: randomChoice([["9L"], ["9R"], ["27L"], ["27R"]]),
                targetWaypoints: randomChoice([
                    ["OCK", "EPM"],
                ]),
                arrivalSpawnLocations: [
                    {x: 1, y: 0.2 * this.map.mapBoundaries.maxY, heading: 135},
                    {x: 1, y: 0.4 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.6 * this.map.mapBoundaries.maxY, heading: 90},
                    {x: 1, y: 0.8 * this.map.mapBoundaries.maxY, heading: 45},

                    {x: 0.2 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 350},
                    {x: 0.5 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 290},
                    {x: 0.7 * this.map.mapBoundaries.maxX, y: this.map.mapBoundaries.maxY, heading: 360},

                    {x: this.map.mapBoundaries.maxX, y: 0.2 * this.map.mapBoundaries.maxY, heading: 270},
                    {x: this.map.mapBoundaries.maxX, y: 0.8 * this.map.mapBoundaries.maxY, heading: 270},
                ],
                updateLandingTargets: () => {
                    this.updateTargets()
                },
                determineLandingRunways: () => {
                    this.determineLandingRunwayDirections()
                }
            },
        };
        return difficultyConfigMap[difficultyScore]
    }

    determineLandingRunwayDirections = () => {
        if (this.machine.weather.wind.easterly()) {
            if (this.difficultyScore > 3) {
                this.targetRunways = randomChoice([["9L", "9R"], ["9L"], ["9R"]])
            } else {
                this.targetRunways = randomChoice([["9L", "9R"]])
            }
            this.targetRunwayPrefix = '9'
        } else {
            if (this.difficultyScore > 3) {
                this.targetRunways = randomChoice([["27L"], ["27R"]])
            } else {
                this.targetRunways = randomChoice([["27L", "27R"]])
            }
            this.targetRunwayPrefix = '27'
        }
    }

    updateTargets = () => {
        this.machine.aeroplanes.forEach(aeroplane => {
            if (aeroplane.isArrival() && !aeroplane.isLanding() && aeroplane.altitude > 3500 && aeroplane.finalTarget && !aeroplane.finalTarget.startsWith(this.targetRunwayPrefix)) {
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
        const spawnLocations = this.currentDifficultyConfig.arrivalSpawnLocations
        const location = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
        const startX = location.x
        const startY = location.y
        const startHeading = location.heading
        const startSpeed = roundToNearest(getRandomNumberBetween(...this.currentDifficultyConfig.speedRange), 10)
        const startAltitude = roundToNearest(getRandomNumberBetween(...this.currentDifficultyConfig.altitudeRange), 500)
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