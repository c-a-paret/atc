export class Aeroplane {
    constructor(callSign, x, y, speed, hdg) {
        this.callSign = callSign;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
    }

    setSpeed = (speed) => {
        if (speed) {
            console.log(`${this.callSign} setting speed to ${speed}`)
            this.speed = speed
        }
    }

    setHeading = (heading) => {
        if (heading && heading >= 0 && heading <= 360) {
            this.heading = heading
        }
    }
}
