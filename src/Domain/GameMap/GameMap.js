export class GameMap {
    constructor(mapConfig) {
        this.name = mapConfig.name
        this.shortCode = mapConfig.shortCode
        this.defaultWaypoint = mapConfig.defaultWaypoint
        this.maxX = mapConfig.maxX
        this.maxY = mapConfig.maxY
        this.focusableConfig = mapConfig.focusableConfig
        this.mapBoundaries = {
            minX: 0,
            maxX: mapConfig.maxX,
            minY: 0,
            maxY: mapConfig.maxY,
        }
        this.features = mapConfig.features
        this.terrain = mapConfig.terrain
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

    getWaypointInfo = (waypointId) => {
        for (let x = 0; x < this.features.waypoints.length; x++) {
            const waypoint = this.features.waypoints[x];
            if (waypoint.id === waypointId) {
                return waypoint
            }
        }
        return null
    }
}