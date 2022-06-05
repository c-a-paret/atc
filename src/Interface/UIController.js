import {COLOURS} from '../utils/common'

export class UIController {
    constructor(mapConfig) {
        this.mapConfig = mapConfig

        this.backgroundCanvas = document.getElementById("background");
        this.backgroundContext = this.backgroundCanvas.getContext('2d');
        this.featuresCanvas = document.getElementById("features");
        this.featuresContext = this.featuresCanvas.getContext('2d');
        this.aeroplaneCanvas = document.getElementById("aeroplanes");
        this.aeroplaneContext = this.aeroplaneCanvas.getContext('2d');

        this.initBackgroundLayer()
        this.initFeaturesLayer()
        this.initAeroplaneLayer()

        this.initFeatures()
    }

    initBackgroundLayer = () => {
        this.backgroundContext.fillStyle = COLOURS.BACKGROUND;

        this.backgroundCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
        this.backgroundCanvas.height = document.body.clientHeight;

        this.backgroundContext.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height)
    }

    initFeaturesLayer = () => {
        this.featuresCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
        this.featuresCanvas.height = document.body.clientHeight;
    }

    initAeroplaneLayer = () => {
        this.aeroplaneCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
        this.aeroplaneCanvas.height = document.body.clientHeight;
    }

    clearAeroplaneLayer = () => {
        this.aeroplaneContext.clearRect(0, 0, document.body.clientWidth - (document.body.clientWidth * 0.2), document.body.clientHeight);
    }

    _drawExclusionZone = () => {
        this.featuresContext.strokeStyle = COLOURS.RED;
        this.featuresContext.lineWidth = 2;

        this.featuresContext.beginPath();
        this.featuresContext.moveTo(500, 600)
        this.featuresContext.lineTo(530, 550)
        this.featuresContext.lineTo(640, 500)
        this.featuresContext.lineTo(700, 500)
        this.featuresContext.lineTo(660, 550)
        this.featuresContext.lineTo(530, 630)
        this.featuresContext.closePath()

        this.featuresContext.stroke();
    }

    initFeatures = () => {
        this._drawExclusionZone()
        this._drawVOR(this.mapConfig.features.vor)
    }

    drawAeroplane = (aeroplane) => {
        this._drawAeroplanePosition(aeroplane)
        this._drawAeroplaneSpeedTail(aeroplane)
        this._drawHeadingLabel(aeroplane)
        this._drawSpeedLabel(aeroplane)
        this._drawAltitudeLabel(aeroplane)
        this._drawCallSignLabel(aeroplane)
    }

    _drawAeroplanePosition = (aeroplane) => {
        this.aeroplaneContext.strokeStyle = COLOURS.YELLOW;
        this.featuresContext.lineWidth = 2;
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.arc(aeroplane.x, aeroplane.y, 5, 0, Math.PI * 2, false);
        this.aeroplaneContext.stroke();
    }

    _drawAeroplaneSpeedTail = (aeroplane) => {
        this.aeroplaneContext.strokeStyle = COLOURS.YELLOW;
        this.featuresContext.lineWidth = 2;
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.moveTo(aeroplane.x, aeroplane.y)

        const oppositeHeading = aeroplane.heading + 180

        const headingRadians = (Math.PI / 180) * oppositeHeading
        const normalisedSpeed = aeroplane.speed / 4

        let tailEndX = aeroplane.x + normalisedSpeed * Math.sin(headingRadians);
        let tailEndY = aeroplane.y - normalisedSpeed * Math.cos(headingRadians);

        this.aeroplaneContext.moveTo(tailEndX, tailEndY)
        this.aeroplaneContext.lineTo(aeroplane.x, aeroplane.y)
        this.aeroplaneContext.stroke();
    }

    _drawHeadingLabel = (aeroplane) => {
        this.aeroplaneContext.fillStyle = COLOURS.MINT;
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.fillText(`${aeroplane.heading}`, aeroplane.x - 20, aeroplane.y - 20);
    }

    _drawSpeedLabel = (aeroplane) => {
        this.aeroplaneContext.fillStyle = COLOURS.YELLOW;
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        const headingLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.heading}`).width;
        this.aeroplaneContext.fillText(`${aeroplane.speed}`, aeroplane.x - 20 + headingLabelWidth + 5, aeroplane.y - 20);
    }

    _drawAltitudeLabel = (aeroplane) => {
        this.aeroplaneContext.fillStyle = COLOURS.MINT;
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        const headingLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.heading}`).width;
        const speedLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.speed}`).width;
        this.aeroplaneContext.fillText(`${Math.round(aeroplane.altitude / 100)}`, aeroplane.x - 20 + (headingLabelWidth + 5) + (speedLabelWidth + 5), aeroplane.y - 20);
    }

    _drawCallSignLabel = (aeroplane) => {
        this.aeroplaneContext.fillStyle = COLOURS.MINT;
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.fillText(`${aeroplane.callSign}`, aeroplane.x - 20, aeroplane.y - 30);
    }

    _drawVOR = (vors) => {
        vors.forEach(vor => {
            this.featuresContext.strokeStyle = COLOURS.WHITE;
            this.featuresContext.lineWidth = 2;
            this.featuresContext.setLineDash([2]);
            this.featuresContext.beginPath();
            this.featuresContext.arc(vor.x, vor.y, 12, 0, Math.PI * 2, false);
            this.featuresContext.stroke();

            this.featuresContext.fillStyle = COLOURS.WHITE;
            this.featuresContext.beginPath();
            this.featuresContext.arc(vor.x, vor.y, 2, 0, Math.PI * 2, false);
            this.featuresContext.fill();

            this.featuresContext.fillStyle = COLOURS.WHITE;
            this.featuresContext.font = "14px Courier New";
            this.featuresContext.beginPath();
            this.featuresContext.fillText(vor.id, vor.x - 12, vor.y - 20);

        })
    }
}
