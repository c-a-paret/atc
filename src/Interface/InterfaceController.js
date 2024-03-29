import {commandMessage} from "../Command/CommandParser/CommandParser";
import {timeStringFromSeconds} from "../utils/timeFormatters";
import {div, p} from "./elements";
import {Tutorial} from "../States/Tutorial";
import {round, roundToNearest} from "../utils/maths";
import {FLYING} from "../Domain/Aeroplane/aeroplaneStates";
import {Easy} from "../States/Easy";
import {Hard} from "../States/Hard";
import {RealisticStart} from "../States/Realistic/RealisticStart";
import {Dynamic} from "../States/Dynamic";
import {COLOURS} from "../config/colours";

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

        this.gamePaused = false
        this.unPauseCallback = undefined
        this.gameSpeed = 1
        this.projectedPathsOn = false
        this._init()
    }

    _init = () => {
        this._setupCommandInterface()
        this._setupClickInterface()
        this._setupPlayPauseInterface()
        this._setupButtonsInterface()
        this._setupSettingsButtons()
        this._setupGameSpeedButtons()
        this._focusCommandEntry()
    }

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

    _setupPlayPauseInterface = () => {
        document.getElementById("pause-play").addEventListener("click", this._playPauseHandler)
        document.addEventListener('keyup', (e) => {
            if (e.code === "Escape") {
                this._playPauseHandler()
            }
        })
    }

    _setupButtonsInterface = () => {
        const helpButton = document.getElementById('help')
        helpButton.addEventListener('click', (_) => {
            this._handleHelpMenu()
        });
    }

    _setupSettingsButtons = () => {
        document.getElementById("tutorial").addEventListener("click", this.startTutorialMode)
        document.getElementById("easy").addEventListener("click", this.startEasyMode)
        document.getElementById("realistic").addEventListener("click", this.startRealisticMode)
        document.getElementById("hard").addEventListener("click", this.startHardMode)
        document.getElementById("dynamic").addEventListener("click", this.startDynamicMode)
        document.getElementById("projected-paths").addEventListener("click", this._toggleProjectedPaths)
    }

    _setupGameSpeedButtons = () => {
        document.addEventListener('keyup', (e) => {
            if (e.code === "AltLeft") {
                this.gameSpeed = this.gameSpeed >= 3 ? this.gameSpeed : this.gameSpeed + 1
            } else if (e.code === "ControlLeft") {
                this.gameSpeed = this.gameSpeed <= 1 ? this.gameSpeed : this.gameSpeed - 1
            }
            document.getElementById("game-speed-text").innerText = `${this.gameSpeed}x`
            if (this.gameSpeed === 1) {
                document.getElementById("game-speed-text").classList.remove('bad')
                document.getElementById("game-speed-text").classList.remove('not-ideal')
                document.getElementById("game-speed-text").classList.add('neutral')
            }
            if (this.gameSpeed === 2) {
                document.getElementById("game-speed-text").classList.remove('neutral')
                document.getElementById("game-speed-text").classList.remove('bad')
                document.getElementById("game-speed-text").classList.add('not-ideal')
            }
            if (this.gameSpeed === 3) {
                document.getElementById("game-speed-text").classList.remove('neutral')
                document.getElementById("game-speed-text").classList.remove('not-ideal')
                document.getElementById("game-speed-text").classList.add('bad')
            }
            this._focusCommandEntry()
        });

    }

    _focusCommandEntry = () => {
        document.getElementById("command-entry-field").focus()
    }

    // Public Methods

    setUnPauseCallback = (callback) => {
        this.unPauseCallback = callback
    }

    setStats = (totalLanded, correctlyLandedPercentage, totalDeparted, correctlyDepartedPercentage, exitedCount, breachedRestrictions, outOfFuelCount) => {
        if (exitedCount > 0) {
            document.getElementById("exited-count").classList.remove('good')
            document.getElementById("exited-count").classList.add('bad')
        } else {
            document.getElementById("exited-count").classList.remove('bad')
            document.getElementById("exited-count").classList.add('good')
        }

        if (outOfFuelCount > 0) {
            document.getElementById("out-of-fuel").classList.remove('good')
            document.getElementById("out-of-fuel").classList.add('bad')
        } else {
            document.getElementById("out-of-fuel").classList.remove('bad')
            document.getElementById("out-of-fuel").classList.add('good')
        }

        if (breachedRestrictions > 0) {
            document.getElementById("breached-restrictions").classList.remove('good')
            document.getElementById("breached-restrictions").classList.add('bad')
        } else {
            document.getElementById("breached-restrictions").classList.remove('bad')
            document.getElementById("breached-restrictions").classList.add('good')
        }

        if (totalLanded === 0) {
            document.getElementById("correctly-landed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-landed-percentage").classList.remove('bad')
            document.getElementById("correctly-landed-percentage").classList.remove('good')
            document.getElementById("correctly-landed-percentage").classList.add('neutral')
        } else if (correctlyLandedPercentage >= 95) {
            document.getElementById("correctly-landed-percentage").classList.remove('neutral')
            document.getElementById("correctly-landed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-landed-percentage").classList.remove('bad')
            document.getElementById("correctly-landed-percentage").classList.add('good')

        } else if (correctlyLandedPercentage >= 75) {
            document.getElementById("correctly-landed-percentage").classList.remove('neutral')
            document.getElementById("correctly-landed-percentage").classList.remove('good')
            document.getElementById("correctly-landed-percentage").classList.remove('bad')
            document.getElementById("correctly-landed-percentage").classList.add('not-ideal')
        } else {
            document.getElementById("correctly-landed-percentage").classList.remove('neutral')
            document.getElementById("correctly-landed-percentage").classList.remove('good')
            document.getElementById("correctly-landed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-landed-percentage").classList.add('bad')
        }

        if (totalDeparted === 0) {
            document.getElementById("correctly-departed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-departed-percentage").classList.remove('bad')
            document.getElementById("correctly-departed-percentage").classList.remove('good')
            document.getElementById("correctly-departed-percentage").classList.add('neutral')
        } else if (correctlyDepartedPercentage >= 95) {
            document.getElementById("correctly-departed-percentage").classList.remove('neutral')
            document.getElementById("correctly-departed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-departed-percentage").classList.remove('bad')
            document.getElementById("correctly-departed-percentage").classList.add('good')
        } else if (correctlyDepartedPercentage >= 75) {
            document.getElementById("correctly-departed-percentage").classList.remove('neutral')
            document.getElementById("correctly-departed-percentage").classList.remove('good')
            document.getElementById("correctly-departed-percentage").classList.remove('bad')
            document.getElementById("correctly-departed-percentage").classList.add('not-ideal')
        } else {
            document.getElementById("correctly-departed-percentage").classList.remove('neutral')
            document.getElementById("correctly-departed-percentage").classList.remove('good')
            document.getElementById("correctly-departed-percentage").classList.remove('not-ideal')
            document.getElementById("correctly-departed-percentage").classList.add('bad')
        }

        document.getElementById("total-landed").innerText = totalLanded
        document.getElementById("total-departed").innerText = totalDeparted

        document.getElementById("correctly-landed-percentage").innerText = totalLanded > 0 ? correctlyLandedPercentage + '%' : '-'
        document.getElementById("correctly-departed-percentage").innerText = totalDeparted > 0 ? correctlyDepartedPercentage + '%' : '-'
        document.getElementById("exited-count").innerText = exitedCount
        document.getElementById("out-of-fuel").innerText = outOfFuelCount
        document.getElementById("breached-restrictions").innerText = timeStringFromSeconds(breachedRestrictions)
    }

    showHint = (hintTitle, hintBodyBefore, hintCode, hintBodyAfter, confirmButtonText, confirmButtonCallback) => {
        document.getElementById("hint").style.display = 'none'

        const title = document.getElementById('hint-title')
        const bodyBefore = document.getElementById('hint-body-before')
        const code = document.getElementById('hint-code')
        const bodyAfter = document.getElementById('hint-body-after')
        const confirmButton = document.getElementById("hint-confirm")

        // Hide optional elements
        code.style.display = 'none'
        bodyAfter.style.display = 'none'
        confirmButton.style.display = 'none'

        // Clear optional elements' content
        code.innerText = ''
        bodyAfter.innerText = ''
        confirmButton.innerText = ''

        // Always have a title and some content
        title.innerText = hintTitle
        bodyBefore.innerText = hintBodyBefore

        // Display optional content
        if (hintCode) {
            code.innerText = hintCode
            code.style.display = 'inline-block'
        } else {
            code.style.display = 'none'
        }

        if (hintBodyAfter) {
            bodyAfter.innerText = hintBodyAfter
            bodyAfter.style.display = 'inline-block'
        } else {
            bodyAfter.style.display = 'none'
        }

        if (confirmButtonText) {
            confirmButton.innerText = confirmButtonText
            confirmButton.style.display = 'inline-block'
            document.getElementById("hint-confirm").onclick = confirmButtonCallback
        } else {
            confirmButton.style.display = 'none'
        }

        document.getElementById("hint").style.display = 'block'
    }

    hideHint = () => {
        document.getElementById("hint").style.display = 'none'
    }

    focusAttention = (focusableElementConfig) => {
        const attentionElement = document.getElementById("attention-focus");

        attentionElement.style.left = `${round(focusableElementConfig.minX, 0)}px`
        attentionElement.style.top = `${focusableElementConfig.minY}px`

        attentionElement.style.width = `${focusableElementConfig.maxX - focusableElementConfig.minX}px`
        attentionElement.style.height = `${focusableElementConfig.maxY - focusableElementConfig.minY}px`

        attentionElement.style.display = 'block'
    }

    blurAttention = () => {
        document.getElementById("attention-focus").style.display = 'none';
    }

    clearCommandEntry = () => {
        let commandField = document.getElementById("command-entry-field");
        commandField.value = ""
    }

    // Wind Indicator
    updateWindIndicator = () => {
        const windDirection = this.aeroplaneService.weather.wind.direction
        const windArrow = document.getElementById("wind-arrow");
        windArrow.style.transform = `rotate(${windDirection}deg)`

        const windSpeed = this.aeroplaneService.weather.wind.speed
        const windSpeedIndicator = document.getElementById("wind-speed");
        windSpeedIndicator.innerText = windSpeed
    }

    // Message

    _displayCommandMessage = (success, callSign, messages) => {
        let messageContainer = document.getElementById("message-container");

        const messageItem = div(["message-item"])
        const messageItemMessage = p(["message-item-message", "bold"])

        messageItemMessage.innerText = callSign ? callSign : ''

        messageItem.appendChild(messageItemMessage)
        messageContainer.append(messageItem)

        messages.forEach(message => {
            if (message) {
                const messageItem = div(["message-item"])
                const messageItemIndicator = p(["message-item-indicator"])
                const messageItemMessage = p(["message-item-message"])

                if (message.state === 'valid') {
                    messageItemIndicator.classList.add('background-green')
                } else if (message.state === 'error') {
                    messageItemIndicator.classList.add('background-red')
                } else {
                    messageItemIndicator.classList.add('background-orange')
                }

                messageItemMessage.innerText = message.text ? message.text : ''

                messageItem.appendChild(messageItemIndicator)
                messageItem.appendChild(messageItemMessage)
                messageContainer.append(messageItem)
            }
        })
        messageContainer.style.border = success ? '' : '1px solid red'
        messageContainer.style.display = "block"
    }

    _clearMessage = () => {
        document.getElementById("message-container").innerHTML = ''
        document.getElementById("message-container").style.display = "none"
    }

    // Sidebar strips
    drawStrips = () => {
        this.aeroplaneService.aeroplanes.forEach(plane => {
            if (!this._getStripFor(plane.callSign)) {
                this.addStrip(plane)
            }
        })
    }

    addStrip = (aeroplane) => {
        const sidebar = document.getElementById("sidebar");
        const strip = div(["aeroplane-strip", aeroplane.type.toLowerCase()], aeroplane.callSign)

        const overview = this._overviewBlock(aeroplane)
        const state = this._stateBlock(aeroplane)
        const actionsOverview = this._actionsOverviewBlock(aeroplane)

        strip.appendChild(overview)
        strip.appendChild(state)
        strip.appendChild(actionsOverview)

        strip.addEventListener('click', () => this._selectStrip(strip))

        sidebar.appendChild(strip)
    }

    updateStrips = () => {
        this.aeroplaneService.aeroplanes.forEach(plane => {
            // Final Target
            const finalTargetElement = document.getElementById(`${plane.callSign}-final-target`)
            finalTargetElement.innerText = plane.finalTarget

            // State
            const stateCallSignElement = document.getElementById(`${plane.callSign}-state-call-sign`)
            stateCallSignElement.innerText = this._format_state(plane)

            const overviewValues = this._get_action_overview_values(plane)
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

            // Fuel
            this.updateFuelIndicator(plane)

            // State indicator
            const indicator = document.getElementById(`${plane.callSign}-state-indicator`)
            indicator.style.backgroundColor = this.determineStateIndicatorColour(plane)
        })
    }

    determineStateIndicatorColour = (plane) => {
        if (plane.hasTakeoffClearance) {
            return COLOURS.ORANGE
        }
        return 'transparent'
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

    _overviewBlock = (aeroplane) => {
        const overview = div(["row", "overview"])

        //  Call Sign
        const callSign = div(["value"])
        const callSignText = p(["text"], "call-sign")
        callSignText.innerText = aeroplane.callSign
        callSign.appendChild(callSignText)

        //  Short class
        const shortClass = div(["value"])
        const shortClassText = p(["text", "center", "short-class"])
        shortClassText.innerText = aeroplane.shortClass
        shortClass.appendChild(shortClassText)

        //  Target
        const target = div(["value"])
        const targetText = p(["text", "right", "final-target"], `${aeroplane.callSign}-final-target`)
        targetText.innerText = aeroplane.finalTarget
        target.appendChild(targetText)


        overview.appendChild(callSign)
        overview.appendChild(shortClass)
        overview.appendChild(target)

        return overview
    }

    _stateBlock = (aeroplane) => {
        const stateBlock = div(["row", "state"])

        // State block
        // State
        const state = div([], 'aircraft-state')
        const stateText = p(["text"], `${aeroplane.callSign}-state-call-sign`)
        stateText.innerText = this._format_state(aeroplane)
        state.appendChild(stateText)
        // State indicator
        const stateIndicator = div(['state-indicator'], `${aeroplane.callSign}-state-indicator`)
        state.appendChild(stateIndicator)

        stateBlock.appendChild(state)


        // Fuel
        if (aeroplane.fuelLevel !== null) {
            const fuelContainer = div(["fuel-container"])
            const fuelIndicator = this._fuelIndicator(aeroplane)
            fuelContainer.appendChild(fuelIndicator)

            stateBlock.appendChild(fuelContainer)
        }


        return stateBlock
    }

    _fuelIndicator = (aeroplane) => {
        const pip1 = div(["fuel-indicator-pip", "pip1"], `${aeroplane.callSign}-pip1`)
        const pip2 = div(["fuel-indicator-pip", "pip2"], `${aeroplane.callSign}-pip2`)
        const pip3 = div(["fuel-indicator-pip", "pip3"], `${aeroplane.callSign}-pip3`)
        const pip4 = div(["fuel-indicator-pip", "pip4"], `${aeroplane.callSign}-pip4`)
        const pip5 = div(["fuel-indicator-pip", "pip5"], `${aeroplane.callSign}-pip5`)

        const fuelIndicator = div(["fuel-indicator", "align-right"])

        fuelIndicator.appendChild(pip1)
        fuelIndicator.appendChild(pip2)
        fuelIndicator.appendChild(pip3)
        fuelIndicator.appendChild(pip4)
        fuelIndicator.appendChild(pip5)

        return fuelIndicator
    }

    updateFuelIndicator = (aeroplane) => {
        const pips = [
            document.getElementById(`${aeroplane.callSign}-pip1`),
            document.getElementById(`${aeroplane.callSign}-pip2`),
            document.getElementById(`${aeroplane.callSign}-pip3`),
            document.getElementById(`${aeroplane.callSign}-pip4`),
            document.getElementById(`${aeroplane.callSign}-pip5`)
        ]

        const fuelLevel = aeroplane.fuelLevel
        const numFilled = Math.ceil(fuelLevel / 20)
        const fillColour = this._fuelIndicatorColour(fuelLevel)

        pips.forEach((pip, index) => {
            pip.classList.remove(
                'pip-green', 'pip-orange', 'pip-red',
                'background-green', 'background-orange', 'background-red',
                'pip-border-green', 'pip-border-orange', 'pip-border-red'
            )
            pip.classList.add(`pip-border-${fillColour}`)
            if (index < numFilled) {
                pip.classList.add(`background-${fillColour}`)
            }
        })
    }

    _fuelIndicatorColour = (fuelLevel) => {
        if (fuelLevel <= 20) {
            return 'red'
        } else if (fuelLevel <= 60) {
            return 'orange'
        } else {
            return 'green'
        }
    }

    _actionsOverviewBlock = (aeroplane) => {
        const actionsOverview = div(["row", "actions-overview"])

        const overviewValues = this._get_action_overview_values(aeroplane)

        //  Speed
        const speed = div(["action-target"])
        const speedText = p(["text", this._colour_class(overviewValues.speed)], `${aeroplane.callSign}-speed`)
        speedText.innerText = overviewValues.speed.value
        speed.appendChild(speedText)

        //  Location
        const location = div(["action-target"])
        const locationText = p(["text", "center", this._colour_class(overviewValues.location)], `${aeroplane.callSign}-location`)
        locationText.innerText = overviewValues.location.value
        location.appendChild(locationText)

        //  Altitude
        const altitude = div(["action-target"])
        const altitudeText = p(["text", this._colour_class(overviewValues.altitude), "right"], `${aeroplane.callSign}-altitude`)
        altitudeText.innerText = overviewValues.altitude.value
        altitude.appendChild(altitudeText)


        actionsOverview.appendChild(speed)
        actionsOverview.appendChild(location)
        actionsOverview.appendChild(altitude)

        return actionsOverview
    }

    _format_state = (aeroplane) => {
        const state_map = {
            READY_TO_TAXI: "READY",
            TAXIING: "TAXI",
            HOLDING_SHORT: `SHORT ${aeroplane.positionDescription}`,
            TAKING_OFF: "T/O",
            FLYING: "FLYING",
            HOLDING_PATTERN: "HOLD",
            LANDING: "LANDING",
            GOING_AROUND: "G/A",
        }
        return state_map[aeroplane.state]
    }

    _get_action_overview_values = (aeroplane) => {
        return {
            altitude: this._get_altitude(aeroplane),
            location: this._get_location(aeroplane),
            speed: this._get_speed(aeroplane)
        }
    }

    _get_altitude = (aeroplane) => {
        if (aeroplane.targetAltitude) {
            return new TargetValue(aeroplane.targetAltitude)
        }
        return new CurrentValue(roundToNearest(aeroplane.altitude, 10))
    }

    _get_location = (aeroplane) => {
        if (aeroplane.isInHoldingPattern()) {
            return new TargetValue('-')
        } else {
            if (aeroplane.targetLocation) {
                return new TargetValue(aeroplane.targetLocation)
            }
            return new CurrentValue(roundToNearest(aeroplane.heading, 1))
        }
    }

    _get_speed = (aeroplane) => {
        if (aeroplane.targetSpeed) {
            return new TargetValue(aeroplane.targetSpeed)
        }
        return new CurrentValue(roundToNearest(aeroplane.speed, 1))
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

    // Event handlers

    // -> Play & Pause
    _playPauseHandler = () => {
        if (this.gamePaused) {
            this._unPauseGame()
            this._hidePauseMenu()
        } else {
            this._pauseGame()
            this._showPauseMenu()
        }
    }

    _pauseGame = () => {
        document.getElementById("pause-play").style.backgroundColor = 'rgba(255,2,109,0.5)'
        this.gamePaused = true
    }

    _unPauseGame = () => {
        this._hideHelpMenu()
        this._hidePauseMenu()
        document.getElementById("pause-play").style.backgroundColor = 'rgba(22, 145, 203, 0.5)'
        this.gamePaused = false
        this.unPauseCallback()
    }

    // -> Pause Menu
    _hidePauseMenu = () => {
        const helpMenu = document.getElementById('pause-menu')
        helpMenu.style.display = 'none'
    }

    _showPauseMenu = () => {
        const helpMenu = document.getElementById('pause-menu')
        helpMenu.style.display = 'flex'
    }

    // -> Help Menu
    _handleHelpMenu = () => {
        const helpMenu = document.getElementById('help-menu')
        if (this.gamePaused) {
            const display = helpMenu.style.display;
            if (display === '' || display === 'none') {
                this._showHelpMenu()
            } else {
                this._hideHelpMenu()
            }
        } else {
            this._pauseGame()
            this._showHelpMenu()
        }
    }

    _hideHelpMenu = () => {
        const helpMenu = document.getElementById('help-menu')
        helpMenu.style.display = 'none'
    }

    _showHelpMenu = () => {
        const helpMenu = document.getElementById('help-menu')
        helpMenu.style.display = 'block'
    }

    // -> Game mode
    startTutorialMode = () => {
        this.hideHint()
        this.blurAttention()
        this._clearGameModeSelection()
        document.getElementById("tutorial-text").classList.add('selected-green')
        this._setGameModeIndicator('Tutorial', 'rgba(239,239,239,0.31)')
        this.aeroplaneService.transitionTo(new Tutorial(this.aeroplaneService.map, this))
    }

    startEasyMode = () => {
        this.hideHint()
        this.blurAttention()
        this._clearGameModeSelection()
        document.getElementById("easy-text").classList.add('selected-green')
        this._setGameModeIndicator('Easy', 'rgba(60,201,60,0.47)')
        this.aeroplaneService.transitionTo(new Easy(true))
    }

    startRealisticMode = () => {
        this.hideHint()
        this.blurAttention()
        this._clearGameModeSelection()
        document.getElementById("realistic-text").classList.add('selected-orange')
        this._setGameModeIndicator('Realistic', 'rgba(60,196,201,0.47)')
        this.aeroplaneService.transitionTo(new RealisticStart(true))
    }

    startHardMode = () => {
        this.hideHint()
        this.blurAttention()
        this._clearGameModeSelection()
        document.getElementById("hard-text").classList.add('selected-red')
        this._setGameModeIndicator('Hard', 'rgba(201,76,60,0.47)')
        this.aeroplaneService.transitionTo(new Hard(true))
    }

    startDynamicMode = () => {
        this.hideHint()
        this.blurAttention()
        this._clearGameModeSelection()
        document.getElementById("dynamic-text").classList.add('selected-red')
        this._setGameModeIndicator('Dynamic', 'rgba(201,76,60,0.47)')
        this.aeroplaneService.transitionTo(new Dynamic(true))
    }

    _clearGameModeSelection = () => {
        document.getElementById("tutorial-text").classList.remove('selected-green')
        document.getElementById("easy-text").classList.remove('selected-green')
        document.getElementById("realistic-text").classList.remove('selected-orange')
        document.getElementById("hard-text").classList.remove('selected-red')
        document.getElementById("dynamic-text").classList.remove('selected-red')
    }

    _setGameModeIndicator = (mode, colour) => {
        document.getElementById("mode-text").innerText = mode
        document.getElementById("mode-indicator").style.backgroundColor = colour
    }
    // -> Projected Paths
    _toggleProjectedPaths = () => {
        if (this.projectedPathsOn) {
            this.projectedPathsOn = false
            document.getElementById("projected-paths-text").innerText = 'Off'
        } else {
            this.projectedPathsOn = true
            document.getElementById("projected-paths-text").innerText = 'On'
        }
    }

    // -> Command handling

    _newCommandHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        const passedCommands = this.aeroplaneService.sendCommand(commandField.value)
        this.lastCallSign = passedCommands.callSign ? passedCommands.callSign : this.lastCallSign
        commandField.value = ""
        this._clearStripFocus()
        const {success, callSign, messages} = commandMessage(passedCommands);
        this._displayCommandMessage(success, callSign, messages)
        setTimeout(() => {
            this._clearMessage()
            this.selectedCallSign = ""
        }, 2000)
    };

    _previousCallSignHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        commandField.value = this.lastCallSign
        this.selectedCallSign = this.lastCallSign
        const strip = this._getStripFor(this.lastCallSign)
        this._selectStrip(strip)
    };

}
