export class InterfaceController {
    constructor(aeroplaneService) {
        this.aeroplaneService = aeroplaneService
    }

    init = () => {
        this._setupCommandInterface()
    }

    _setupCommandInterface = () => {
        document.getElementById("send-command").addEventListener(
            "click",
            () => this.aeroplaneService.sendCommand(document.getElementById("command-entry-field").value)
        )
    }

}