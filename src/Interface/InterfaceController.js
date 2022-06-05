export class InterfaceController {
    constructor(aeroplaneService) {
        this.aeroplaneService = aeroplaneService
        this.lastCallSign = null
    }

    init = () => {
        this._setupCommandInterface()
        this._focusCommandEntry()
    }

    _newCommandHandler = () => {
        let commandField = document.getElementById("command-entry-field");
        const parsedCommand = this.aeroplaneService.sendCommand(commandField.value)
        this.lastCallSign = parsedCommand.callSign
        commandField.value = ""
    };

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

}