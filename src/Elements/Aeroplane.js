export class Aeroplane {
    constructor(callSign, x, y, speed, hdg) {
        this.callSign = callSign;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = hdg;
    }

    setSpeed = (speed) => {
        console.log(`${this.callSign} setting speed to ${speed}`)
        this.speed = speed
    }

    setHeading = (heading) => {
        this.heading = heading
    }
}
