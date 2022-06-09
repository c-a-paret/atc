import {Altitude, Heading, Landing, Speed, Waypoint} from "../Action/Action";
import {round, toRadians} from "../../utils/common";

export class Aeroplane {
    constructor(callSign, x, y, speed, hdg, altitude, weight) {
        this.callSign = callSign;
        this.weight = weight;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
        this.altitude = altitude;
        this.actions = []
        this.active = true
    }

    addAction = (action) => {
        if (action.type() === "Landing") { // landing overwrites everything
            this.actions = [action]
            return
        }
        for (let x = 0; x < this.actions.length; x++) {
            if (this.actions[x].type() === "Waypoint" && action.type() === "Heading") { // heading overwrites waypoint
                this.actions[x] = action
                return
            }
            if (this.actions[x].type() === "Heading" && action.type() === "Waypoint") { // waypoint overwrites heading
                this.actions[x] = action
                return
            }
            if (this.actions[x].type() === "Waypoint" && action.type() === "Waypoint") { // waypoint overwrites waypoint
                this.actions[x] = action
                return
            }
            if (this.actions[x].type() === action.type()) { // replace action
                this.actions[x] = action
                return
            }
        }
        this.actions.push(action)
    }

    setSpeed = (speed) => {
        const newSpeed = new Speed(this, speed);
        if (newSpeed.isValid()) {
            this.addAction(newSpeed)
            return speed
        }
    }

    setHeading = (heading) => {
        const newHeading = new Heading(this, heading);
        if (newHeading.isValid()) {
            this.addAction(newHeading)
            return heading
        }
    }

    setAltitude = (altitude) => {
        const newAltitude = new Altitude(this, altitude);
        if (newAltitude.isValid()) {
            this.addAction(newAltitude)
            return altitude
        }
    }

    setWaypoint = (waypoint) => {
        const newWaypoint = new Waypoint(this, waypoint);
        if (newWaypoint.isValid()) {
            this.addAction(newWaypoint)
            return waypoint
        }
    }

    setLanding = (runway) => {
        const newLanding = new Landing(this, runway);
        if (newLanding.isValid()) {
            this.addAction(newLanding)
            return runway
        }
    }

    _clean_actions = () => {
        this.actions = this.actions.filter(action => action.isActionable())
    }

    applyActions = () => {
        this.actions.forEach(action => {
            action.apply()
        })

        const headingRadians = toRadians(this.heading)
        const distancePerTick = 1 + ((this.speed - 100) / 20 * 0.5)
        this.x = round(this.x + distancePerTick * Math.sin(headingRadians), 2);
        this.y = round(this.y - distancePerTick * Math.cos(headingRadians), 2);

        this._clean_actions()
    }

    withinPosition = (x, y) => {
        const minX = x - 30
        const maxX = x + 30
        const minY = y - 30
        const maxY = y + 30
        const withinX = (minX < this.x && this.x < maxX)
        const withinY = (minY < this.y && this.y < maxY)
        return withinX && withinY
    }

    makeInactive = () => {
        this.active = false
    }

    isOutsideBoundaries = (mapBoundaries) => {
        const outsideX = (this.x < mapBoundaries.minX || this.x > mapBoundaries.maxX)
        const outsideY = (this.y < mapBoundaries.minY || this.y > mapBoundaries.maxY)
        return outsideX || outsideY
    }

    hasLanded = () => {
        return this.altitude < 20
    }

}
