import {UIController} from "./Interface/UIController";
import {AeroplaneService} from "./Application/AeroplaneService";
import {GameLoop} from "./Application/GameLoop";
import {InterfaceController} from "./Interface/InterfaceController";
import {EGLL} from "./config/maps/EGLL";
import {StatsService} from "./Application/StatsService";
import {GameMap} from "./Domain/GameMap/GameMap";
import {Weather} from "./Application/Weather/WeatherService";


const map = new GameMap(EGLL)
const weather = new Weather()

const statsService = new StatsService();

const aeroplaneService = new AeroplaneService(map, statsService, weather)

const interfaceController = new InterfaceController(aeroplaneService)
const uiController = new UIController(map, aeroplaneService, interfaceController, weather)

const gameLoop = new GameLoop(uiController, interfaceController, aeroplaneService, statsService)

interfaceController.startEasyMode()
gameLoop.init()
gameLoop.start()