import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";


const ui = new UIController()
const aeroplaneService = new AeroplaneService()
const interfaceController = new InterfaceController(aeroplaneService)
const gameLoop = new GameLoop(ui, interfaceController, aeroplaneService)

gameLoop.init()
gameLoop.start()