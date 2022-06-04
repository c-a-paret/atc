/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CommandParser/CommandParser.js":
/*!********************************************!*\
  !*** ./src/CommandParser/CommandParser.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"parseCommand\": () => (/* binding */ parseCommand),\n/* harmony export */   \"parseSpeed\": () => (/* binding */ parseSpeed)\n/* harmony export */ });\nconst parseCommand = (command) => {\n    return {\n        \"callSign\": command.substring(0, 5),\n        \"speed\": parseSpeed(command)\n    }\n}\n\nconst parseSpeed = (command) => {\n    const match = command.match(/S(\\d{2,3})/g);\n    if (match && match.length === 1) {\n        return parseInt(match[0].substring(1))\n    }\n    return null\n}\n\n//# sourceURL=webpack://atc/./src/CommandParser/CommandParser.js?");

/***/ }),

/***/ "./src/Interface/UIController.js":
/*!***************************************!*\
  !*** ./src/Interface/UIController.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UIController\": () => (/* binding */ UIController)\n/* harmony export */ });\nclass UIController {\n    constructor() {\n        this.backgroundCanvas = document.getElementById(\"background\");\n        this.backgroundContext = this.backgroundCanvas.getContext('2d');\n        this.featuresCanvas = document.getElementById(\"features\");\n        this.featuresContext = this.featuresCanvas.getContext('2d');\n        this.aeroplaneCanvas = document.getElementById(\"aeroplanes\");\n        this.aeroplaneContext = this.aeroplaneCanvas.getContext('2d');\n\n        this.initBackgroundLayer()\n        this.initFeaturesLayer()\n        this.initFeaturesLayer()\n    }\n\n    initBackgroundLayer = () => {\n        this.backgroundContext.fillStyle = 'rgb(18,19,49)';\n\n        this.backgroundCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);\n        this.backgroundCanvas.height = document.body.clientHeight;\n\n        this.backgroundContext.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height)\n    }\n\n    initFeaturesLayer = () => {\n        this.featuresCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);\n        this.featuresCanvas.height = document.body.clientHeight;\n    }\n\n    initAeroplaneLayer = () => {\n        this.aeroplaneCanvas.width = document.body.clientWidth - (document.body.clientWidth * 0.2);\n        this.aeroplaneCanvas.height = document.body.clientHeight;\n    }\n\n    clearAeroplaneLayer = () => {\n        this.aeroplaneContext.clearRect(0, 0, document.body.clientWidth - (document.body.clientWidth * 0.2), document.body.clientHeight);\n    }\n\n    drawExclusionZone = () => {\n        console.log(\"Drawing exclusion zone...\")\n        this.featuresContext.strokeStyle = 'rgb(208,19,55)';\n        this.featuresContext.beginPath();\n        this.featuresContext.moveTo(500, 600)\n        this.featuresContext.lineTo(550, 500)\n        this.featuresContext.lineTo(600, 500)\n        this.featuresContext.lineTo(600, 600)\n        this.featuresContext.closePath()\n        this.featuresContext.stroke();\n    }\n\n    drawExclusionZone2 = () => {\n        console.log(\"Drawing exclusion zone 2...\")\n        this.featuresContext.strokeStyle = 'rgb(208,19,55)';\n        this.featuresContext.beginPath();\n        this.featuresContext.moveTo(900, 600)\n        this.featuresContext.lineTo(800, 500)\n        this.featuresContext.lineTo(800, 800)\n        this.featuresContext.lineTo(1100, 600)\n        this.featuresContext.closePath()\n        this.featuresContext.stroke();\n    }\n\n    position = () => {\n        console.log(\"Drawing position...\")\n        this.aeroplaneContext.strokeStyle = 'rgb(252,210,100)';\n        this.aeroplaneContext.beginPath();\n        this.aeroplaneContext.arc(400, 500, 5, 0, Math.PI * 2, false);\n        this.aeroplaneContext.stroke();\n    }\n}\n\n\n//# sourceURL=webpack://atc/./src/Interface/UIController.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _CommandParser_CommandParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CommandParser/CommandParser */ \"./src/CommandParser/CommandParser.js\");\n/* harmony import */ var _Interface_UIController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Interface/UIController */ \"./src/Interface/UIController.js\");\n\n\n\n\nconst COLOURS = {\n    YELLOW: 'rgb(252,210,100)',\n    MINT: 'rgb(0,213,170)',\n    RED: 'rgb(208,19,55)',\n    BACKGROUND: 'rgb(18,19,49)'\n}\n\nclass Aeroplane {\n    constructor(ctx, callSign, x, y, speed, hdg) {\n        this.ctx = ctx;\n        this.callSign = callSign;\n        this.x = x;\n        this.y = y;\n        this.speed = speed;\n        this.heading = hdg;\n    }\n\n    setSpeed = (speed) => {\n        console.log(`${this.callSign} setting speed to ${speed}`)\n        this.speed = speed\n    }\n\n    setHeading = (heading) => {\n        this.heading = heading\n    }\n\n    draw = () => {\n        this.position()\n        this.drawAeroplaneSpeedTail()\n        this.drawSpeedLabel()\n        this.drawHeadingLabel()\n    }\n\n    position = () => {\n        this.ctx.strokeStyle = COLOURS.YELLOW;\n        this.ctx.beginPath();\n        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);\n        this.ctx.stroke();\n    }\n\n    drawAeroplaneSpeedTail = () => {\n        console.log(\"Drawing speed tail...\")\n        this.ctx.strokeStyle = COLOURS.YELLOW;\n        this.ctx.beginPath();\n        this.ctx.moveTo(this.x, this.y)\n\n        const oppositeHeading = this.heading + 180\n\n        const headingRadians = (Math.PI / 180) * oppositeHeading\n        const normalisedSpeed = this.speed / 4\n\n        let tailEndX = this.x + normalisedSpeed * Math.sin(headingRadians);\n        let tailEndY = this.y - normalisedSpeed * Math.cos(headingRadians);\n\n        this.ctx.moveTo(tailEndX, tailEndY)\n        this.ctx.lineTo(this.x, this.y)\n        this.ctx.stroke();\n    }\n\n    drawSpeedLabel = () => {\n        this.ctx.fillStyle = COLOURS.MINT;\n        this.ctx.font = \"bold 12px Courier New\";\n        this.ctx.beginPath();\n        this.ctx.fillText(`${this.heading}`, this.x - 20, this.y - 20);\n    }\n\n    drawHeadingLabel = () => {\n        this.ctx.fillStyle = COLOURS.YELLOW;\n        this.ctx.font = \"bold 12px Courier New\";\n        this.ctx.beginPath();\n        const headingLabelWidth = this.ctx.measureText(`${this.heading}`).width;\n        this.ctx.fillText(`${this.speed}`, this.x - 20 + headingLabelWidth + 5, this.y - 20);\n    }\n}\n\nconst sendCommand = () => {\n    const rawCommand = document.getElementById(\"command-entry-field\").value\n    const command = (0,_CommandParser_CommandParser__WEBPACK_IMPORTED_MODULE_0__.parseCommand)(rawCommand)\n    planes.forEach(plane => {\n        if (plane.callSign === command.callSign) {\n            plane.setSpeed(command.speed)\n        }\n    })\n}\n\n\nconst setupInterface = () => {\n    document.getElementById(\"send-command\").addEventListener(\"click\", sendCommand)\n}\n\nconst ui = new _Interface_UIController__WEBPACK_IMPORTED_MODULE_1__.UIController()\n\nui.initBackgroundLayer()\n// const planeCtx = ui.aeroplaneContext\n\nsetupInterface()\n\nui.drawExclusionZone()\nui.position()\n\n// let planes = [\n//     new Aeroplane(planeCtx, \"AA792\", 230, 320, 120, 97),\n//     new Aeroplane(planeCtx, \"PK324\", 400, 400, 100, 135),\n//     new Aeroplane(planeCtx, \"BA767\", 600, 500, 240, 270),\n//     new Aeroplane(planeCtx, \"LH132\", 300, 700, 220, 350)\n// ]\n\n\n// setInterval(() => {\n//     ui.clearAeroplaneLayer()\n//     planes.forEach(plane => plane.draw())\n// }, 5000)\n\n\n//# sourceURL=webpack://atc/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;