import {commandMessage} from "../Command/CommandParser/CommandParser";

export class InterfaceController {
    constructor(aeroplaneService) {
        this.aeroplaneService = aeroplaneService
        this.lastCallSign = null
        this.gamePaused = false;
    }

    init = () => {
        this._setupCommandInterface()
        this._setupClickInterface()
        this._focusCommandEntry()
        this._setupPlayPauseInterface()
    }

    _newCommandHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        const acceptedCommands = this.aeroplaneService.sendCommand(commandField.value)
        this.lastCallSign = acceptedCommands.callSign
        commandField.value = ""
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
                this._focusCommandEntry()
            }
        });
    }

}