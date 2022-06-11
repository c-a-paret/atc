export class GameMap {
    constructor(mapConfig) {
        this.name = mapConfig.name
        this.shortCode = mapConfig.shortCode
        this.features = {
            runways: mapConfig.features.runways,
            waypoints: mapConfig.features.waypoints,
            exclusionZones: mapConfig.features.exclusionZones,
            mapLines: mapConfig.features.mapLines,
            crosses: mapConfig.features.crosses,
        }
    }

    runwayExists = (targetRunway) => {
        for (let x = 0; x < this.features.runways.length; x++) {
            let runway = this.features.runways[x]
            if (runway.start.label === targetRunway || runway.end.label === targetRunway) {
                return true
            }
        }
        return false
    }

    getRunwayInfo = (targetRunway) => {
        for (let x = 0; x < this.features.runways.length; x++) {
            let runway = this.features.runways[x]
            if (runway.start.label === targetRunway) {
                return runway.start
            }
            if (runway.end.label === targetRunway) {
                return runway.end
            }
        }
        return null
    }
}