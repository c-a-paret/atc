import {GameMap} from "../../GameMap/GameMap";

export const testGameMap = () => {
    return new GameMap({
        features: {
            runways: [{
                start: {
                    label: "9L", heading: 90, altitude: 0, landingZone: {
                        x: 510, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 500,
                        }, outerMarker: {
                            x: 280, y: 500,
                        }
                    },
                    goAround: {
                        targetWaypoint: "CHT",
                        targetSpeed: 200,
                        targetAltitude: 4000,
                    }
                }, end: {
                    label: "27R", heading: 270, altitude: 0, landingZone: {
                        x: 490, y: 500,
                    }, ILS: {
                        innerMarker: {
                            x: 500, y: 550,
                        }, outerMarker: {
                            x: 720, y: 550,
                        }
                    },
                    goAround: {
                        targetWaypoint: "LAM",
                        targetSpeed: 220,
                        targetAltitude: 5000,
                    }
                }
            }], waypoints: [{type: "VOR", id: "LAM", name: "Lambourne", x: 500, y: 500},]
        }
    })
}