import {Altitude, Heading, Speed} from "../Action/Action";
import {MAX_ALTITUDE, MIN_ALTITUDE, MIN_SPEED, round, toRadians} from "../../utils/common";

export class Aeroplane {
    constructor(callSign, x, y, speed, hdg, altitude) {
        this.callSign = callSign;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
        this.altitude = altitude;
        this.actions = []
    }

    addAction = (action) => {
        for (let x = 0; x < this.actions.length; x++) {
            if (this.actions[x].type === action.type) {
                this.actions[x].targetValue = action.targetValue
                this.actions[x].tickValues = action.tickValues
                return
            }
        }
        this.actions.push(action)
    }

    setSpeed = (speed) => {
        if (this._valid_speed(speed)) {
            this.addAction(new Speed(this.speed, speed))
        }
    }

    _valid_speed = (speed) => {
        return speed
            && speed !== this.speed
            && speed % 10 === 0  // Is multiple of 10
            && speed >= MIN_SPEED
    }

    setHeading = (heading) => {
        if (this._valid_heading(heading)) {
            this.addAction(new Heading(this.heading, heading))
        }
    }

    _valid_heading = (heading) => {
        return heading
            && heading !== this.heading
            && heading >= 0
            && heading <= 360
    }

    setAltitude = (altitude) => {
        if (this._valid_altitude(altitude)) {
            this.addAction(new Altitude(this.altitude, altitude))
        }
    }

    _valid_altitude = (altitude) => {
        return altitude
            && altitude !== this.altitude
            && altitude >= MIN_ALTITUDE
            && altitude <= MAX_ALTITUDE
            && altitude % 100 === 0  // Is multiple of 100
    }

    _clean_actions = () => {
        this.actions = this.actions.filter(action => action.tickValues.length > 0)
    }

    applyActions = () => {
        this.actions.forEach(action => {
            if (action.type === "heading") {
                if (action.tickValues.length > 0) {
                    this.heading = action.tickValues.pop()
                }
            }

            if (action.type === "speed") {
                if (action.tickValues.length > 0) {
                    this.speed = action.tickValues.pop()
                }
            }

            if (action.type === "altitude") {
                if (action.tickValues.length > 0) {
                    this.altitude = action.tickValues.pop()
                }
            }
        })

        const headingRadians = toRadians(this.heading)
        let newX;
        let newY;
        if (this.speed <= 100) {
            newX = this.x + Math.sin(headingRadians);
            newY = this.y - Math.cos(headingRadians);
        } else {
            const distancePerTick = 1 + ((this.speed - 100) / 10 * 0.5)
            newX = round(this.x + distancePerTick * Math.sin(headingRadians), 2);
            newY = round(this.y - distancePerTick * Math.cos(headingRadians), 2);
        }
        this.x = newX;
        this.y = newY;

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

}
