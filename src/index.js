import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";
import {StatsService} from "./Application/StatsService";


const ui = new UIController(EGLL)
const aeroplaneService = new AeroplaneService(ui.mapBoundaries)
const interfaceController = new InterfaceController(aeroplaneService)

export const statsService = new StatsService(interfaceController)

const gameLoop = new GameLoop(ui, interfaceController, aeroplaneService)

gameLoop.init()
gameLoop.start()