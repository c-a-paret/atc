import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";


const ui = new UIController(EGLL)
const aeroplaneService = new AeroplaneService(ui.mapBoundaries)
const interfaceController = new InterfaceController(aeroplaneService)
const gameLoop = new GameLoop(ui, interfaceController, aeroplaneService)

gameLoop.init()
gameLoop.start()