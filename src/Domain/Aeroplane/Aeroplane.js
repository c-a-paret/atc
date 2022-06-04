import {Speed} from "../Action/Action";

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
        if (speed && speed !== this.speed) {
            this.actions.push(new Speed(this.speed, speed))
        }
    }

    setHeading = (heading) => {
        if (heading && heading >= 0 && heading <= 360) {
            this.heading = heading
        }
    }
}
