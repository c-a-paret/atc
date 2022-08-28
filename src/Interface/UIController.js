import {COLOURS} from "../config/colours";
import {ILS_MIN_X} from "../config/constants";
import {round, toRadians} from "../utils/maths";
import {
    FLYING,
    GOING_AROUND,
    HOLDING_SHORT,
    READY_TO_TAXI,
    TAKING_OFF,
    TAXIING
} from "../Domain/Aeroplane/aeroplaneStates";

export class UIController {
    constructor(map, aeroplaneService, interfaceController, weatherService) {
        this.map = map
        this.aeroplaneService = aeroplaneService
        this.interfaceController = interfaceController
        this.weatherService = weatherService

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
        this._drawRestrictedZones(this.map.features.restrictedZones)
        this._drawVORs(this.map.features.waypoints)
        this._drawRunways(this.map.features.runways)
        this._drawILSFeathers(this.map.features.runways)
        this._drawMapLines(this.map.features.mapLines)
        this._drawMapCrosses(this.map.features.crosses)
        this._drawTallStructures(this.map.features.tallStructures)
        this._drawTerrain(this.map.terrain)
        // this._drawRangeIndicators(this.mapBoundaries)
    }

    drawAeroplanes = () => {
        this.aeroplaneService.aeroplanes.forEach(plane => {
            this._drawAeroplanePosition(plane)
            this._drawAeroplaneSpeedTail(plane)
            this._drawHeadingLabel(plane)
            this._drawSpeedLabel(plane)
            this._drawAltitudeLabel(plane)
            this._drawCallSignLabel(plane)
            this._drawFinalTargetLabel(plane)
            this._drawProjectedPath(plane)
            this.drawWeather()
        })
    }

    _drawRestrictedZones = (restrictedZones) => {
        restrictedZones.forEach(zone => {
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

            const labelHeight = this.featuresContext.measureText(`${zone.label.text}`).fontBoundingBoxAscent;
            let minAltitudeLabel;
            if (zone.minAltitude) {
                minAltitudeLabel = `${zone.minAltitude / 100}`;
                this.featuresContext.fillStyle = COLOURS.YELLOW;
                this.featuresContext.font = "12px Courier New";
                this.featuresContext.beginPath();
                this.featuresContext.fillText(minAltitudeLabel, zone.label.location.x, zone.label.location.y + labelHeight);
            }
            if (zone.minAltitude && zone.maxAltitude) {
                const maxAltitudeLabel = `${zone.maxAltitude / 100}`;
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

    _drawTallStructures = (structures) => {
        structures.forEach(structure => {
            this.featuresContext.fillStyle = COLOURS.WHITE;
            this.featuresContext.lineWidth = 1;
            this.featuresContext.setLineDash([]);
            this.featuresContext.beginPath();
            this.featuresContext.moveTo(structure.x - 5, structure.y + 5);
            this.featuresContext.lineTo(structure.x, structure.y - 5);
            this.featuresContext.lineTo(structure.x + 5, structure.y + 5);
            this.featuresContext.closePath();
            this.featuresContext.fill();

            this.featuresContext.font = "12px Courier New";
            this.featuresContext.beginPath();
            this.featuresContext.fillText(structure.label, structure.x + 5, structure.y - 5);
        })
    }

    _drawAeroplanePosition = (aeroplane) => {
        if (aeroplane.is([HOLDING_SHORT, TAKING_OFF, FLYING, GOING_AROUND])) {
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
    }

    _drawAeroplaneSpeedTail = (aeroplane) => {
        if (aeroplane.breachingProximity) {
            this.aeroplaneContext.strokeStyle = COLOURS.RED;
        } else {
            this.aeroplaneContext.strokeStyle = COLOURS.YELLOW;
        }
        for (let x = 0; x < aeroplane.lastPositions.length - 2; x += 2) {
            let markerX = aeroplane.lastPositions[x].x
            let markerY = aeroplane.lastPositions[x].y
            this.aeroplaneContext.beginPath();
            const offset = 5
            this.aeroplaneContext.moveTo(markerX - offset, markerY + offset)
            this.aeroplaneContext.lineTo(markerX + offset / 1.2, markerY - offset / 1.2)
            this.aeroplaneContext.stroke();
        }
    }

    _drawSpeedLabel = (aeroplane) => {
        if (aeroplane.isNot([READY_TO_TAXI, TAXIING])) {
            if (aeroplane.breachingProximity) {
                this.aeroplaneContext.fillStyle = COLOURS.RED;
            } else {
                this.aeroplaneContext.fillStyle = COLOURS.MINT;
            }
            this.aeroplaneContext.font = "bold 12px Courier New";
            this.aeroplaneContext.beginPath();
            this.aeroplaneContext.fillText(`${round(aeroplane.speed, 0)}`, aeroplane.x - 20, aeroplane.y - 20);
        }
    }

    _drawHeadingLabel = (aeroplane) => {
        if (aeroplane.isNot([READY_TO_TAXI, TAXIING])) {
            if (aeroplane.breachingProximity) {
                this.aeroplaneContext.fillStyle = COLOURS.RED;
            } else {
                this.aeroplaneContext.fillStyle = COLOURS.YELLOW;
            }
            this.aeroplaneContext.font = "bold 12px Courier New";
            this.aeroplaneContext.beginPath();
            const speedLabelWidth = this.aeroplaneContext.measureText(`${round(aeroplane.speed, 0)}`).width;
            this.aeroplaneContext.fillText(`${round(aeroplane.heading, 0)}`, aeroplane.x - 20 + speedLabelWidth + 5, aeroplane.y - 20);
        }
    }

    _drawAltitudeLabel = (aeroplane) => {
        if (aeroplane.isNot([READY_TO_TAXI, TAXIING])) {
            if (aeroplane.breachingProximity) {
                this.aeroplaneContext.fillStyle = COLOURS.RED;
            } else {
                this.aeroplaneContext.fillStyle = COLOURS.MINT;
            }
            this.aeroplaneContext.font = "bold 12px Courier New";
            this.aeroplaneContext.beginPath();
            const headingLabelWidth = this.aeroplaneContext.measureText(`${round(aeroplane.heading, 0)}`).width;
            const speedLabelWidth = this.aeroplaneContext.measureText(`${round(aeroplane.speed, 0)}`).width;
            this.aeroplaneContext.fillText(`${Math.round(aeroplane.altitude / 100)}`, aeroplane.x - 20 + (headingLabelWidth + 5) + (speedLabelWidth + 5), aeroplane.y - 20);
        }
    }

    _drawCallSignLabel = (aeroplane) => {
        if (aeroplane.isNot([READY_TO_TAXI, TAXIING])) {
            if (aeroplane.breachingProximity) {
                this.aeroplaneContext.fillStyle = COLOURS.RED;
            } else {
                this.aeroplaneContext.fillStyle = COLOURS.MINT;
            }
            this.aeroplaneContext.font = "bold 12px Courier New";
            this.aeroplaneContext.beginPath();
            this.aeroplaneContext.fillText(aeroplane.callSign, aeroplane.x - 20, aeroplane.y - 30);
        }
    }

    _drawFinalTargetLabel = (aeroplane) => {
        if (aeroplane.isNot([READY_TO_TAXI, TAXIING])) {
            if (aeroplane.finalTarget) {
                this.aeroplaneContext.fillStyle = COLOURS.PURPLE;
                this.aeroplaneContext.font = "bold 12px Courier New";

                const callSignWidth = this.featuresContext.measureText(aeroplane.callSign).width;

                this.aeroplaneContext.beginPath();
                this.aeroplaneContext.fillText(aeroplane.finalTarget, aeroplane.x - 10 + callSignWidth, aeroplane.y - 30);
            }
        }
    }

    _drawProjectedPath = (aeroplane) => {
        if (this.interfaceController.projectedPathsOn && aeroplane.is([TAKING_OFF, FLYING, GOING_AROUND])) {
            if (aeroplane.nextPositions.length > 0) {
                const firstX = aeroplane.nextPositions[0].x
                const firstY = aeroplane.nextPositions[0].y
                const lastX = aeroplane.nextPositions[aeroplane.nextPositions.length - 1].x
                const lastY = aeroplane.nextPositions[aeroplane.nextPositions.length - 1].y

                const gradient = this.aeroplaneContext.createLinearGradient(firstX, firstY, lastX, lastY);
                gradient.addColorStop(0, COLOURS.GREY);
                gradient.addColorStop(1, COLOURS.GREY_TRANSPARENT);

                this.aeroplaneContext.strokeStyle = gradient;
                this.aeroplaneContext.lineWidth = 2;

                // Projected path
                this.aeroplaneContext.beginPath();
                this.aeroplaneContext.moveTo(aeroplane.nextPositions[0].x, aeroplane.nextPositions[0].y)
                aeroplane.nextPositions.forEach(position => {
                    this.aeroplaneContext.lineTo(position.x, position.y)
                })
                this.aeroplaneContext.stroke();

                // Marker
                aeroplane.nextPositions.forEach(position => {
                    if (position.marker) {
                        this._drawMarker(position.x, position.y)
                    }
                })
            }
        }
    }

    _drawMarker = (x, y) => {
        this.aeroplaneContext.strokeStyle = COLOURS.MINT;
        this.aeroplaneContext.lineWidth = 2;
        this.aeroplaneContext.beginPath();
        this.aeroplaneContext.arc(x, y, 4, 0, Math.PI * 2, false);
        this.aeroplaneContext.stroke();
        this.aeroplaneContext.strokeStyle = COLOURS.GREY;
    }

    _drawRangeIndicators = (mapBoundaries) => {
        this.featuresContext.strokeStyle = COLOURS.WHITE_TRANSPARENT_MAX;
        this.featuresContext.lineWidth = 2;
        [100, 200, 300, 400, 500, 600, 700].forEach(radius => {
            this.featuresContext.beginPath();
            this.featuresContext.arc(0.5 * mapBoundaries.maxX, 0.508 * mapBoundaries.maxY, radius, 0, Math.PI * 2, false);
            this.featuresContext.stroke();
        })
        this.featuresContext.strokeStyle = COLOURS.GREY;
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

    _drawTerrain = (terrain) => {
        terrain.waterBodies.forEach(river => {
            river.borders.forEach(border => {
                this.featuresContext.fillStyle = COLOURS.WHITE_TRANSPARENT_MAX;
                this.featuresContext.lineWidth = 1;
                this.featuresContext.beginPath();
                this.featuresContext.moveTo(border[0].x, border[0].y);
                border.forEach(point => {
                    this.featuresContext.lineTo(point.x, point.y);
                })
                this.featuresContext.closePath()
                this.featuresContext.fill();
            })
        })
    }

    drawWeather = () => {
        this.weatherService.clouds.clouds.forEach(cloud => {
            const pattern = document.createElement("canvas");
            pattern.classList.add("weather")
            pattern.width = 10;
            pattern.height = 10;
            const patternContext = pattern.getContext('2d');

            if (cloud.points[0].radius < 60) {
                cloud.green += 1
            }
            if (cloud.points[0].radius < 80) {
                cloud.red -= 2
            }
            if (cloud.points[0].radius < 100) {
                cloud.green += 1
            }

            cloud.red = Math.max(128, cloud.red)
            cloud.green = Math.min(cloud.green, 212)
            patternContext.fillStyle = `rgba(${cloud.red}, ${cloud.green}, 0, 0.8)`

            patternContext.arc(5, 5, 1, 0, Math.PI * 2, false);
            patternContext.fill();

            this.aeroplaneContext.fillStyle = patternContext.createPattern(pattern, "repeat")
            // this.aeroplaneContext.strokeStyle = COLOURS.PURPLE
            this.aeroplaneContext.lineWidth = 1
            this.aeroplaneContext.beginPath()

            // Border
            cloud.points.forEach((point, index) => {
                if (index !== 0) {
                    let x = cloud.x + point.radius * Math.sin(toRadians(point.angle));
                    let y = cloud.y - point.radius * Math.cos(toRadians(point.angle));
                    this.aeroplaneContext.lineTo(x, y)
                }
            })

            this.aeroplaneContext.closePath()
            this.aeroplaneContext.fill()
            // this.aeroplaneContext.stroke()
        })
    }
}
