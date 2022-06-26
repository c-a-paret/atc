import {commandMessage} from "../Command/CommandParser/CommandParser";
import {timeStringFromSeconds} from "../utils/timeFormatters";

class TargetValue {
    constructor(value) {
        this.value = value
        this.isTarget = true
    }
}

class CurrentValue {
    constructor(value) {
        this.value = value
        this.isTarget = false
    }
}

export class InterfaceController {
    constructor(aeroplaneService) {
        this.aeroplaneService = aeroplaneService

        this.lastCallSign = null
        this.selectedStrip = null
        this.selectedCallSign = null

        this.gamePaused = false;
        this._init()
    }

    setStats = (landedCount, exitedCount, breachedRestrictions) => {
        if (exitedCount > 0) {
            document.getElementById("exited-count").classList.remove('good')
            document.getElementById("exited-count").classList.add('bad')
        }
        if (breachedRestrictions > 0) {
            document.getElementById("breached-restrictions").classList.remove('good')
            document.getElementById("breached-restrictions").classList.add('bad')
        }
        document.getElementById("landed-count").innerText = landedCount
        document.getElementById("exited-count").innerText = exitedCount
        document.getElementById("breached-restrictions").innerText = timeStringFromSeconds(breachedRestrictions)
    }

    drawStrips = () => {
        this.aeroplaneService.aeroplanes.forEach(plane => {
            if (!this._getStripFor(plane.callSign)) {
                this.addStrip(plane)
            }
        })
    }

    addStrip = (aeroplane) => {
        // <div className="aeroplane-strip">
        //     <div className="overview">
        //         <div className="value">
        //             <p className="text">BA123</p>
        //         </div>
        //         <div className="target">
        //             <p className="text">27L</p>
        //         </div>
        //     </div>
        //     <div className="separator"></div>
        //     <div className="actions-overview">
        //         <div className="action-target">
        //             <p className="text">262</p>
        //         </div>
        //         <div className="action-target with-direction">
        //             <p className="text">50</p>
        //             <p className="text arrow">↘︎︎</p>
        //         </div>
        //         <div className="action-target">
        //             <p className="text">260</p>
        //         </div>
        //     </div>
        // </div>
        const sidebar = document.getElementById("sidebar");
        const strip = this._div(["aeroplane-strip"], aeroplane.callSign)

        const overview = this._overviewBlock(aeroplane)
        const separator = this._div(["separator"])
        const actionsOverview = this._actionsOverviewBlock(aeroplane)

        strip.appendChild(overview)
        strip.appendChild(separator)
        strip.appendChild(actionsOverview)

        strip.addEventListener('click', () => this._selectStrip(strip))

        sidebar.appendChild(strip)
    }

    updateStrips = () => {
        this.aeroplaneService.aeroplanes.forEach(plane => {
            const overviewValues = this._get_overview_values(plane)

            // Location
            const locationTextElement = document.getElementById(`${plane.callSign}-location`)
            const locationColourClass = this._colour_class(overviewValues.location);
            locationTextElement.classList.add(locationColourClass)
            locationTextElement.classList.remove(this._invert(locationColourClass))
            locationTextElement.innerText = overviewValues.location.value

            // Altitude
            const altitudeTextElement = document.getElementById(`${plane.callSign}-altitude`)
            const altitudeColourClass = this._colour_class(overviewValues.altitude);
            altitudeTextElement.classList.add(altitudeColourClass)
            altitudeTextElement.classList.remove(this._invert(altitudeColourClass))
            altitudeTextElement.innerText = overviewValues.altitude.value

            // Speed
            const speedTextElement = document.getElementById(`${plane.callSign}-speed`)
            const speedColourClass = this._colour_class(overviewValues.speed);
            speedTextElement.classList.add(speedColourClass)
            speedTextElement.classList.remove(this._invert(speedColourClass))
            speedTextElement.innerText = overviewValues.speed.value
        })
    }

    clearInactiveStrips = () => {
        const strips = document.querySelectorAll(".aeroplane-strip")
        const aeroplaneCallSigns = this.aeroplaneService.aeroplanes.map(plane => plane.callSign)
        strips.forEach(strip => {
            if (!aeroplaneCallSigns.includes(strip.id)) {
                strip.remove()
            }
        })
    }

    _init = () => {
        this._setupCommandInterface()
        this._setupClickInterface()
        this._focusCommandEntry()
        this._setupPlayPauseInterface()
    }

    _element = (tag, classes, id) => {
        const element = document.createElement(tag)
        classes.forEach(cls => {
            element.classList.add(cls)
        })
        element.setAttribute('id', id)
        return element
    }

    _div = (classes, id) => {
        return this._element("div", classes, id)
    }

    _p = (classes, id) => {
        return this._element("p", classes, id)
    }

    _overviewBlock = (aeroplane) => {
        const overview = this._div(["overview"])

        //  Call Sign
        const callSign = this._div(["value"])
        const callSignText = this._p(["text"])
        callSignText.innerText = aeroplane.callSign
        callSign.appendChild(callSignText)

        //  Short class
        const shortClass = this._div(["value"])
        const shortClassText = this._p(["text", "center", "short-class"])
        shortClassText.innerText = aeroplane.shortClass
        shortClass.appendChild(shortClassText)

        //  Target
        const target = this._div(["value"])
        const targetText = this._p(["text", "right"])
        targetText.innerText = "27L"
        target.appendChild(targetText)

        overview.appendChild(callSign)
        overview.appendChild(shortClass)
        overview.appendChild(target)

        return overview
    }

    _get_location = (aeroplane) => {
        if (aeroplane.isLanding()) {
            return new TargetValue('Landing')
        } else if (aeroplane.isHolding()) {
            return new TargetValue(`Hold`)
        } else {
            if (aeroplane.targetLocation) {
                return new TargetValue(aeroplane.targetLocation)
            }
            return new CurrentValue(aeroplane.heading)
        }
    }

    _get_altitude = (aeroplane) => {
        if (!aeroplane.isLanding()) {
            if (aeroplane.targetAltitude) {
                return new TargetValue(aeroplane.targetAltitude)
            }
            return new CurrentValue(aeroplane.altitude)
        }
        return new CurrentValue('')
    }

    _get_speed = (aeroplane) => {
        if (!aeroplane.isLanding()) {
            if (aeroplane.targetSpeed) {
                return new TargetValue(aeroplane.targetSpeed)
            }
            return new CurrentValue(aeroplane.speed)
        }
        return new CurrentValue('')
    }

    _get_overview_values = (aeroplane) => {
        return {
            location: this._get_location(aeroplane),
            altitude: this._get_altitude(aeroplane),
            speed: this._get_speed(aeroplane)
        }
    }

    _colour_class = (value) => {
        if (value.isTarget) {
            return 'target-value'
        }
        return 'current-value'
    }

    _invert = (cls) => {
        if (cls === 'target-value') {
            return 'current-value'
        }
        return 'target-value'
    }

    _actionsOverviewBlock = (aeroplane) => {
        const actionsOverview = this._div(["actions-overview"])

        const overviewValues = this._get_overview_values(aeroplane)

        //  Location
        const location = this._div(["action-target"])
        const locationText = this._p(["text", this._colour_class(overviewValues.location)], `${aeroplane.callSign}-location`)
        locationText.innerText = overviewValues.location.value
        location.appendChild(locationText)

        //  Speed
        const speed = this._div(["action-target"])
        const speedText = this._p(["text", this._colour_class(overviewValues.speed), "center"], `${aeroplane.callSign}-speed`)
        speedText.innerText = overviewValues.speed.value
        speed.appendChild(speedText)

        //  Altitude
        const altitude = this._div(["action-target"])
        const altitudeText = this._p(["text", this._colour_class(overviewValues.altitude), "right"], `${aeroplane.callSign}-altitude`)
        altitudeText.innerText = overviewValues.altitude.value
        altitude.appendChild(altitudeText)


        actionsOverview.appendChild(location)
        actionsOverview.appendChild(speed)
        actionsOverview.appendChild(altitude)

        return actionsOverview
    }

    _clearStripFocus = () => {
        try {
            this.selectedStrip.classList.remove('selected')
        } catch (e) {

        }
    }

    _selectStrip = (strip) => {
        this._clearStripFocus()
        strip.classList.add('selected')
        this.selectedStrip = strip
        this.selectedCallSign = strip.id
        this.lastCallSign = strip.id
        let commandField = document.getElementById("command-entry-field");
        commandField.value = this.selectedCallSign
        this._focusCommandEntry()
    }

    _getStripFor = (callSign) => {
        return document.getElementById(callSign)
    }

    _newCommandHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        const acceptedCommands = this.aeroplaneService.sendCommand(commandField.value)
        this.lastCallSign = acceptedCommands.callSign
        commandField.value = ""
        this._clearStripFocus()
        this._displayMessage(commandMessage(acceptedCommands))
        setTimeout(() => {
            this._clearMessage()
        }, 2000)
    };

    _displayMessage = (message) => {
        let messageContainer = document.getElementById("message-container");
        let messageField = document.getElementById("message-display");
        messageContainer.style.display = "flex"
        messageField.innerText = message
    }

    _clearMessage = () => {
        document.getElementById("message-display").innerText = ""
        document.getElementById("message-container").style.display = "none"
    }

    _previousCallSignHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        commandField.value = this.lastCallSign
        const strip = this._getStripFor(this.lastCallSign)
        this._selectStrip(strip)
    };

    _setupCommandInterface = () => {
        document.getElementById("send-command").addEventListener("click", this._newCommandHandler)
        document.addEventListener('keyup', (e) => {
            if (e.code === "Enter") {
                this._newCommandHandler()
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === "ArrowUp") {
                this._previousCallSignHandler()
            }
        });
    }

    _setupPlayPauseInterface = () => {
        document.getElementById("pause-play").addEventListener("click", this._play_pause_handler)
    }

    _play_pause_handler = () => {
        if (this.gamePaused) {
            document.getElementById("pause-play").style.backgroundColor = 'rgba(22, 145, 203, 0.5)'
        } else {
            document.getElementById("pause-play").style.backgroundColor = 'rgba(255,2,109,0.5)'
        }
        this.gamePaused = !this.gamePaused
    }

    _focusCommandEntry = () => {
        document.getElementById("command-entry-field").focus()
    }

    _setupClickInterface = () => {
        document.addEventListener('click', (e) => {
            const clickedX = e.clientX
            const clickedY = e.clientY
            const callSign = this.aeroplaneService.getCallSignByPosition(clickedX, clickedY)
            if (callSign) {
                let commandField = document.getElementById("command-entry-field");
                commandField.value = callSign
                this.lastCallSign = callSign
                const strip = this._getStripFor(callSign)
                this._selectStrip(strip)
                this._focusCommandEntry()
            }
        });
    }

}