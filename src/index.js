import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";
import {StatsService} from "./Application/StatsService";
import {GameMap} from "./Domain/GameMap/GameMap";


const map = new GameMap(EGLL)

const ui = new UIController(map)
const aeroplaneService = new AeroplaneService(map, ui.mapBoundaries)
const interfaceController = new InterfaceController(aeroplaneService)

aeroplaneService.setStatsService(new StatsService(interfaceController))

const gameLoop = new GameLoop(ui, interfaceController, aeroplaneService)

gameLoop.init()
gameLoop.start()