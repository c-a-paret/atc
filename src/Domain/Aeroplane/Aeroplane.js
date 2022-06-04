import {Heading, Speed} from "../Action/Action";
import {MIN_SPEED, round, toRadians} from "../../common";

export class Aeroplane {
    constructor(callSign, x, y, speed, hdg) {
        this.callSign = callSign;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
        this.actions = []
    }

    setSpeed = (speed) => {
        if (this._valid_speed(speed)) {
            this.actions.push(new Speed(this.speed, speed))
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
            this.actions.push(new Heading(this.heading, heading))
        }
    }

    _valid_heading = (heading) => {
        return heading
            && heading !== this.heading
            && heading >= 0
            && heading <= 360
    }

    _clean_actions = () => {
        this.actions = this.actions.filter(action => action.tickValues.length > 0)
    }

    applyActions() {
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


}
