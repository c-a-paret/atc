import {commandMessage} from "../Command/CommandParser/CommandParser";

export class InterfaceController {
    constructor(aeroplaneService) {
        this.aeroplaneService = aeroplaneService
        this.lastCallSign = null
    }

    init = () => {
        this._styleInterfaceElements()
        this._setupCommandInterface()
        this._setupClickInterface()
        this._focusCommandEntry()
    }

    _newCommandHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        const parsedCommand = this.aeroplaneService.sendCommand(commandField.value)
        this.lastCallSign = parsedCommand.callSign
        commandField.value = ""
        this._displayMessage(commandMessage(parsedCommand))
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