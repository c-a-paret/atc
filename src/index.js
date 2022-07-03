import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";
import {StatsService} from "./Application/StatsService";
import {GameMap} from "./Domain/GameMap/GameMap";


const map = new GameMap(EGLL)

const statsService = new StatsService();
const aeroplaneService = new AeroplaneService(map, statsService)

const interfaceController = new InterfaceController(aeroplaneService)
const uiController = new UIController(map, aeroplaneService)

const gameLoop = new GameLoop(uiController, interfaceController, aeroplaneService, statsService)

gameLoop.init()
gameLoop.start()