import {COLOURS} from "../config/colours";
import {ILS_MIN_X} from "../config/constants";

export class UIController {
    constructor(map) {
        this.map = map

        this.backgroundCanvas = document.getElementById("background");
        this.backgroundContext = this.backgroundCanvas.getContext('2d');
        this.featuresCanvas = document.getElementById("features");
        this.featuresContext = this.featuresCanvas.getContext('2d');
        this.aeroplaneCanvas = document.getElementById("aeroplanes");
        this.aeroplaneContext = this.aeroplaneCanvas.getContext('2d');

        this.mapBoundaries = {
            minX: 0,
            maxX: document.body.clientWidth,
            minY: 0,
            maxY: document.body.clientHeight,
        }

        this.initBackgroundLayer()
        this.initFeaturesLayer()
        this.initAeroplaneLayer()

        this.initFeatures()
    }

    initBackgroundLayer = () => {
        this.backgroundCanvas.width = document.body.clientWidth;
        this.backgroundCanvas.height = document.body.clientHeight;

        this.backgroundContext.fillStyle = COLOURS.BACKGROUND;
        this.backgroundContext.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height)
    }

    initFeaturesLayer = () => {
        this.featuresCanvas.width = document.body.clientWidth;
        this.featuresCanvas.height = document.body.clientHeight;
    }

    initAeroplaneLayer = () => {
        this.aeroplaneCanvas.width = document.body.clientWidth;
        this.aeroplaneCanvas.height = document.body.clientHeight;
    }

    clearAeroplaneLayer = () => {
        this.aeroplaneContext.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    }

    initFeatures = () => {
        this._drawExclusionZones(this.map.features.exclusionZones)
        this._drawVORs(this.map.features.waypoints)
        this._drawRunways(this.map.features.runways)
        this._drawILSFeathers(this.map.features.runways)
        this._drawMapLines(this.map.features.mapLines)
        this._drawMapCrosses(this.map.features.crosses)
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
                },
                informational: {
                    solid: COLOURS.BLUE,
                    transparent: COLOURS.BLUE_TRANSPARENT
                }
            }
            // Border
            this.featuresContext.strokeStyle = severityColourMap[zone.level].solid;
            this.featuresContext.lineWidth = 3;
            this.featuresContext.lineJoin = 'round';
            this.featuresContext.setLineDash([zone.dashes]);
            this.featuresContext.beginPath();
            for (let x = 0; x < zone.boundaries.length; x++) {
                let boundary = zone.boundaries[x]
                if (x === 0) {
                    this.featuresContext.moveTo(boundary.x, boundary.y)
                } else {
                    this.featuresContext.lineTo(boundary.x, boundary.y)
                }

            }
            this.featuresContext.closePath()
            this.featuresContext.stroke();

            // Fill
            if (zone.level !== 'informational') {
                this.featuresContext.fillStyle = severityColourMap[zone.level].transparent;
                this.featuresContext.beginPath();
                for (let x = 0; x < zone.boundaries.length; x++) {
                    let boundary = zone.boundaries[x]
                    if (x === 0) {
                        this.featuresContext.moveTo(boundary.x, boundary.y)
                    } else {
                        this.featuresContext.lineTo(boundary.x, boundary.y)
                    }
                }
                this.featuresContext.closePath()
                this.featuresContext.fill();
            }

            // Label
            this.featuresContext.fillStyle = COLOURS.WHITE;
            this.featuresContext.font = "12px Courier New";
            this.featuresContext.beginPath();
            this.featuresContext.fillText(zone.label.text, zone.label.location.x, zone.label.location.y);

            if (zone.minAltitude && zone.maxAltitude) {
                const labelHeight = this.featuresContext.measureText(`${zone.label.text}`).fontBoundingBoxAscent;
                const minAltitudeLabel = `${zone.minAltitude / 100}`;
                const maxAltitudeLabel = `${zone.maxAltitude / 100}`;

                this.featuresContext.fillStyle = COLOURS.YELLOW;
                this.featuresContext.font = "12px Courier New";
                this.featuresContext.beginPath();
                this.featuresContext.fillText(minAltitudeLabel, zone.label.location.x, zone.label.location.y + labelHeight);

                const minAltitudeLabelWidth = this.featuresContext.measureText(minAltitudeLabel).width;
                this.featuresContext.fillStyle = COLOURS.WHITE;
                this.featuresContext.font = "12px Courier New";
                this.featuresContext.beginPath();
                this.featuresContext.fillText(maxAltitudeLabel, zone.label.location.x + minAltitudeLabelWidth + 4, zone.label.location.y + labelHeight);
            }
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

    _drawILSFeathers = (runways) => {
        runways.forEach(runway => {
            this.featuresContext.strokeStyle = COLOURS.GREY;
            this.featuresContext.fillStyle = COLOURS.GREY_TRANSPARENT

            const spikiness = 15
            const spread = 20;

            // Feathers
            this.featuresContext.lineWidth = 1;
            this.featuresContext.setLineDash([4]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(runway.start.ILS.innerMarker.x, runway.start.ILS.innerMarker.y)
            this.featuresContext.lineTo(runway.start.ILS.outerMarker.x - spikiness, runway.start.ILS.outerMarker.y - spread)
            this.featuresContext.lineTo(runway.start.ILS.outerMarker.x, runway.start.ILS.outerMarker.y)
            this.featuresContext.lineTo(runway.start.ILS.outerMarker.x - spikiness, runway.start.ILS.outerMarker.y + spread)
            this.featuresContext.lineTo(runway.start.ILS.innerMarker.x, runway.start.ILS.innerMarker.y)

            this.featuresContext.moveTo(runway.end.ILS.innerMarker.x, runway.end.ILS.innerMarker.y)
            this.featuresContext.lineTo(runway.end.ILS.outerMarker.x + spikiness, runway.end.ILS.outerMarker.y - spread)
            this.featuresContext.lineTo(runway.end.ILS.outerMarker.x, runway.end.ILS.outerMarker.y)
            this.featuresContext.lineTo(runway.end.ILS.outerMarker.x + spikiness, runway.end.ILS.outerMarker.y + spread)
            this.featuresContext.lineTo(runway.end.ILS.innerMarker.x, runway.end.ILS.innerMarker.y)
            this.featuresContext.stroke();

            // Landing command limits indicator
            this.featuresContext.lineWidth = 2;
            this.featuresContext.setLineDash([1]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(runway.start.ILS.outerMarker.x, runway.start.ILS.outerMarker.y)
            this.featuresContext.lineTo(runway.start.ILS.innerMarker.x - ILS_MIN_X, runway.start.ILS.innerMarker.y)
            this.featuresContext.moveTo(runway.end.ILS.outerMarker.x, runway.end.ILS.outerMarker.y)
            this.featuresContext.lineTo(runway.end.ILS.innerMarker.x + ILS_MIN_X, runway.end.ILS.innerMarker.y)
            this.featuresContext.stroke();
        })
    }

    _drawMapLines = (mapLines) => {
        mapLines.forEach(line => {
            this.featuresContext.strokeStyle = COLOURS.WHITE_TRANSPARENT;
            this.featuresContext.lineWidth = 1;
            this.featuresContext.setLineDash([line.dashes]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(line.start.x, line.start.y);
            this.featuresContext.lineTo(line.end.x, line.end.y);
            this.featuresContext.stroke();
        })
    }

    _drawMapCrosses = (crosses) => {
        crosses.forEach(cross => {
            this.featuresContext.strokeStyle = COLOURS.WHITE;
            this.featuresContext.lineWidth = 2;
            this.featuresContext.setLineDash([]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(cross.x - 4, cross.y);
            this.featuresContext.lineTo(cross.x + 4, cross.y);
            this.featuresContext.moveTo(cross.x, cross.y - 4);
            this.featuresContext.lineTo(cross.x, cross.y + 4);
            this.featuresContext.stroke();
        })
    }

    _drawAeroplanePosition = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.strokeStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.strokeStyle = COLOURS.YELLOW;
        }
        // Construct diamond shape
        const radius = 6
        this.aeroplaneContext.lineWidth = 1;
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.moveTo(aeroplane.x, aeroplane.y - radius)
        this.aeroplaneContext.lineTo(aeroplane.x + radius, aeroplane.y)
        this.aeroplaneContext.lineTo(aeroplane.x, aeroplane.y + radius)
        this.aeroplaneContext.lineTo(aeroplane.x - radius, aeroplane.y)
        this.aeroplaneContext.closePath()
        this.aeroplaneContext.stroke();
    }

    _drawAeroplaneSpeedTail = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.strokeStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.strokeStyle = COLOURS.YELLOW;
        }
        for (let x = 0; x < aeroplane.lastPositions.length - 2; x+=2) {
            let markerX = aeroplane.lastPositions[x].x
            let markerY = aeroplane.lastPositions[x].y
            this.aeroplaneContext.beginPath();
            const offset = 5
            this.aeroplaneContext.moveTo(markerX - offset, markerY + offset)
            this.aeroplaneContext.lineTo(markerX + offset / 1.2, markerY - offset / 1.2)
            this.aeroplaneContext.stroke();
        }
    }

    _drawHeadingLabel = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.fillStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.fillStyle = COLOURS.MINT;
        }
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.fillText(`${aeroplane.heading}`, aeroplane.x - 20, aeroplane.y - 20);
    }

    _drawSpeedLabel = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.fillStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.fillStyle = COLOURS.YELLOW;
        }
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        const headingLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.heading}`).width;
        this.aeroplaneContext.fillText(`${aeroplane.speed}`, aeroplane.x - 20 + headingLabelWidth + 5, aeroplane.y - 20);
    }

    _drawAltitudeLabel = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.fillStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.fillStyle = COLOURS.MINT;
        }
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        const headingLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.heading}`).width;
        const speedLabelWidth = this.aeroplaneContext.measureText(`${aeroplane.speed}`).width;
        this.aeroplaneContext.fillText(`${Math.round(aeroplane.altitude / 100)}`, aeroplane.x - 20 + (headingLabelWidth + 5) + (speedLabelWidth + 5), aeroplane.y - 20);
    }

    _drawCallSignLabel = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.fillStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.fillStyle = COLOURS.MINT;
        }
        this.aeroplaneContext.font = "bold 12px Courier New";
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.fillText(aeroplane.callSign, aeroplane.x - 20, aeroplane.y - 30);
    }

    _drawVORs = (waypoints) => {
        for (let x = 0; x < waypoints.length; x++) {
            const waypoint = waypoints[x]
            if (waypoint.type === "VOR") {
                this.featuresContext.strokeStyle = COLOURS.WHITE;
                this.featuresContext.lineWidth = 2;
                this.featuresContext.setLineDash([2]);
                this.featuresContext.beginPath();
                this.featuresContext.arc(waypoint.x, waypoint.y, 12, 0, Math.PI * 2, false);
                this.featuresContext.stroke();

                this.featuresContext.fillStyle = COLOURS.WHITE;
                this.featuresContext.beginPath();
                this.featuresContext.arc(waypoint.x, waypoint.y, 2, 0, Math.PI * 2, false);
                this.featuresContext.fill();

                this.featuresContext.fillStyle = COLOURS.WHITE;
                this.featuresContext.font = "14px Courier New";
                this.featuresContext.beginPath();
                this.featuresContext.fillText(waypoint.id, waypoint.x - 12, waypoint.y - 20);
            }
        }
    }
}
