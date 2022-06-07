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

        this.mapBoundaries = {
            minX: 0,
            maxX: document.body.clientWidth - (document.body.clientWidth * 0.2),
            minY: 0,
            maxY: document.body.clientHeight,
        }

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

    initFeatures = () => {
        this._drawExclusionZones(this.mapConfig.features.exclusionZones)
        this._drawVORs(this.mapConfig.features.vors)
        this._drawRunways(this.mapConfig.features.runways)
    }

    drawAeroplane = (aeroplane) => {
        this._drawAeroplanePosition(aeroplane)
        this._drawAeroplaneSpeedTail(aeroplane)
        this._drawHeadingLabel(aeroplane)
        this._drawSpeedLabel(aeroplane)
        this._drawAltitudeLabel(aeroplane)
        this._drawCallSignLabel(aeroplane)
    }

    _drawExclusionZones = (exclusionZones) => {
        exclusionZones.forEach(zone => {
            const severityColourMap = {
                critical: {
                    solid: COLOURS.RED,
                    transparent: COLOURS.RED_TRANSPARENT
                },
                moderate: {
                    solid: COLOURS.ORANGE,
                    transparent: COLOURS.ORANGE_TRANSPARENT
                }
            }
            // Border
            this.featuresContext.strokeStyle = severityColourMap[zone.level].solid;
            this.featuresContext.lineWidth = 2;
            this.featuresContext.lineJoin = 'round';
            this.featuresContext.setLineDash([2]);
            this.featuresContext.beginPath();
            for (let x = 0; x < zone.boundaries.length; x++) {
                let boundary =  zone.boundaries[x]
                if (x === 0) {
                    this.featuresContext.moveTo(boundary.x, boundary.y)
                } else {
                    this.featuresContext.lineTo(boundary.x, boundary.y)
                }

            }
            this.featuresContext.closePath()
            this.featuresContext.stroke();

            // Fill
            this.featuresContext.fillStyle = severityColourMap[zone.level].transparent;
            this.featuresContext.beginPath();
            for (let x = 0; x < zone.boundaries.length; x++) {
                let boundary =  zone.boundaries[x]
                if (x === 0) {
                    this.featuresContext.moveTo(boundary.x, boundary.y)
                } else {
                    this.featuresContext.lineTo(boundary.x, boundary.y)
                }

            }
            this.featuresContext.closePath()
            this.featuresContext.fill();
        })
    }

    _drawRunways = (runways) => {
        runways.forEach(runway => {
            this.featuresContext.strokeStyle = COLOURS.MINT;
            this.featuresContext.lineWidth = 4;
            this.featuresContext.setLineDash([]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(runway.start.ILS.innerMarker.x, runway.start.ILS.innerMarker.y)
            this.featuresContext.lineTo(runway.end.ILS.innerMarker.x, runway.end.ILS.innerMarker.y)
            this.featuresContext.stroke();
            // Labels
            this.featuresContext.fillStyle = COLOURS.WHITE;
            this.featuresContext.beginPath();
            this.featuresContext.font = "12px Courier New";
            this.featuresContext.fillText(runway.start.label, runway.start.ILS.innerMarker.x - 20, runway.start.ILS.innerMarker.y - 5);
            this.featuresContext.fillText(runway.end.label, runway.end.ILS.innerMarker.x + 10, runway.end.ILS.innerMarker.y - 5);

        })
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
        const normalisedSpeed = aeroplane.speed / 8

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

    _drawVORs = (vors) => {
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
