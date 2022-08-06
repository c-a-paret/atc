import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";
import {StatsService} from "./Application/StatsService";
import {GameMap} from "./Domain/GameMap/GameMap";
import {Easy} from "./States/Easy";
import {Difficulty} from "./config/constants";


const map = new GameMap(EGLL)

const statsService = new StatsService();
const startState = new Easy(true, Difficulty.EASY)

const aeroplaneService = new AeroplaneService(map, statsService, startState)

const interfaceController = new InterfaceController(aeroplaneService)
const uiController = new UIController(map, aeroplaneService, interfaceController)

const gameLoop = new GameLoop(uiController, interfaceController, aeroplaneService, statsService)

interfaceController.startEasyMode()
gameLoop.init()
gameLoop.start()