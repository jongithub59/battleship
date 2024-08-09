/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");
class Gameboard {
  constructor() {
    this.board = Array.from({
      length: 10
    }, () => Array(10).fill(null));
    //key for coordinate conversion
    this.xCoordinates = "ABCDEFGHIJ";
    this.yCoordinates = "12345678910";
    this.ships = [];
    this.misses = [];
    this.hits = [];
  }

  // convert taken coordinate (B4) into indexs that the 2D board array can use ([1, 3])
  convertCoordinate(coordinate) {
    //split coordinate in two
    const xCoordinate = coordinate[0];
    const yCoordinate = coordinate.slice(1);
    //convert each index to respective array index
    const xIndex = this.xCoordinates.indexOf(xCoordinate);
    const yIndex = parseInt(yCoordinate, 10) - 1;
    return [xIndex, yIndex];
  }
  getBoard() {
    return this.board;
  }
  placeShip(startCoordinate) {
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ship = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    let createdShip;
    if (!this.isValid(startCoordinate, length)) {
      return false;
    }

    // //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);

    //crate ship class if one doesn;t exist and add ship to the board's ships array to access later
    if (!ship) {
      createdShip = new Ship(length); //create ship object and add it to ships array
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
      length = ship.length;
    }

    // Place ship on board
    if (isVertical === false) {
      for (let y = startY; y <= length + startY - 1; y++) {
        this.board[startX][y] = {
          marker: "S",
          ship: ship || createdShip
        };
      }
    }
    if (isVertical === true) {
      for (let x = startX; x <= length + startX - 1; x++) {
        this.board[x][startY] = {
          marker: "S",
          ship: ship || createdShip
        };
      }
    }
  }
  receiveHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);

    //find and return ship class associated with the coordinate, mark as hit on board and ship itself, and add the hit to hits array if a ship is present
    if (this.board[x][y] && this.board[x][y].marker === "S") {
      const ship = this.getShip(coordinate);
      this.board[x][y].marker = "X";
      this.hits.push([x, y]);
      ship.hit();
    } else if (this.board[x][y] && this.board[x][y].marker === "X") {
      return;
    } else {
      this.board[x][y] = {
        marker: "O"
      };
      this.misses.push([x, y]);
    }
  }
  checkHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);
    if (this.board[x][y].marker === "X") return true;
    return false;
  }
  checkCoordinate(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);
    const ship = this.getShip(coordinate);
    return {
      marker: this.board[x][y].marker,
      ship: ship
    };
  }

  // return ship class in .ship property of board square for access
  getShip(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);
    return this.board[x][y].ship;
  }
  isValid(coordinate, length) {
    //convert coordinate
    const [x, y] = this.convertCoordinate(coordinate);
    const regex = /^([0-9])$/; // use this to match numbers 0 through 9 since converted coords are in index form so -1

    //tests coordinates
    if (regex.test(x) && regex.test(y)) {
      //check if converted coords fit on 10x10 board
      if (y + length >= 10 || x + length >= 10) return false; //then check if it will go off board bounds by adding the length
      return true;
    }
    return false;
  }

  //converts this.misses array into new array containing misses in letter-number format ex: B5
  getMisses() {
    let convertedMisses = [];
    this.misses.forEach(miss => {
      const missIndexOne = String.fromCharCode(65 + miss[0]); //convert first index of miss coordinate back into a letter
      const newMiss = missIndexOne + (miss[1] + 1); // concatenate converted miss to remove comma and add one back to second index ex: [1, 4] -> "B%"
      convertedMisses.push(newMiss);
    });
    return convertedMisses;
  }

  //when called, checks if all ships in this.ships have ship.sunk equal to true
  allShipsSunk() {
    if (this.ships.some(ship => ship.sunk === false)) return this.ships;
    return true;
  }
}
module.exports = Gameboard;

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Gameboard = __webpack_require__(/*! ./Gameboard */ "./src/modules/Gameboard.js");
class Player {
  constructor(playerType) {
    this.board = new Gameboard();
    this.playerType = playerType;
  }

  //functions that will run without needing to call this.board (ex: player.board.getMisses() vs player.getMisses())
  receiveHit(coordinate) {
    this.board.receiveHit(coordinate);
  }
  checkHit(coordinate) {
    this.board.checkHit(coordinate);
  }
  placeShip(startCoordinate) {
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ship = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    this.board.placeShip(startCoordinate, length, isVertical, ship);
  }
  getMisses() {
    this.board.getMisses();
  }
  allShipsSunk() {
    this.board.allShipsSunk();
  }
}
module.exports = Player;

/***/ }),

/***/ "./src/modules/ScreenController.js":
/*!*****************************************!*\
  !*** ./src/modules/ScreenController.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Gameboard = __webpack_require__(/*! ./Gameboard */ "./src/modules/Gameboard.js");
const Ship = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");
const Player = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");

//set up initial User Interface DOM elements so event listeners can be added to them

class ScreenController {
  setupGame() {
    const reset = document.querySelector(".reset-button");
    const gameContainer = document.querySelector(".game-container");
    const boardContainer = document.querySelector(".board-container");
  }
  createPlayerBoard(player) {
    const boardDisplay = document.querySelector("#board-one");
    while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);
    const gameBoard = player.board.board;
    gameBoard.forEach(array => {
      array.forEach(cell => {
        const gridElement = document.createElement('div');
        gridElement.classList.add('box');
        if (cell) {
          if (cell.marker === "S") gridElement.classList.add("ship");
          if (cell.marker === 'O') gridElement.classList.add("miss");
          if (cell.marker === "X") gridElement.classList.add("hit");
        }
        boardDisplay.appendChild(gridElement);
      });
    });
    return gameBoard;
  }
  createComputerBoard(cpu) {
    const boardDisplay = document.querySelector("#board-two");
    while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);
    const gameBoard = cpu.board.board;
    gameBoard.forEach(array => {
      array.forEach(cell => {
        const gridElement = document.createElement("div");
        gridElement.classList.add("box");
        if (cell) {
          if (cell.marker === "S") gridElement.classList.add("ship");
          if (cell.marker === "O") gridElement.classList.add("miss");
          if (cell.marker === "X") gridElement.classList.add("hit");
        }
        boardDisplay.appendChild(gridElement);
      });
    });
    return gameBoard;
  }
  revealEndGameUI(winner) {}
}
module.exports = ScreenController;

/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((module) => {

class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }
  hit() {
    if (this.hits === this.length) return;
    this.hits = this.hits += 1;
    this.isSunk();
  }
  isSunk() {
    this.sunk = this.hits === this.length;
  }
}
module.exports = Ship;

/***/ }),

/***/ "./src/modules/eventHandler.js":
/*!*************************************!*\
  !*** ./src/modules/eventHandler.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const UI = __webpack_require__(/*! ./ScreenController */ "./src/modules/ScreenController.js");
const Player = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");
//Use UI elements from ScreenController to add event listeners using UI loading funcs

class EventHandler {
  constructor() {
    this.ui = new UI();
    this.player = new Player("human");
    this.computer = new Player("cpu");
    this.currentPlayer = this.player; // the player who is the "active player"
  }
  startGame() {
    //run setup funcs from ScreenController.js here since index.js will only import this file
    this.ui.setupGame();
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);

    //need funcs for adding eventlisteners to run the other funcs that run the game here, meaning startGame() is the only func that needs to run
  }
  updateBoards() {
    // this will update the boards at anytime with their new inputs
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
  }

  //funcs for running the game off event listeners here
}
module.exports = EventHandler;

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const EventHandler = __webpack_require__(/*! ./modules/eventHandler.js */ "./src/modules/eventHandler.js");
const gameHandler = new EventHandler();
gameHandler.startGame();

// MOCK
gameHandler.player.placeShip('B1', 4);
gameHandler.player.receiveHit('B1');
gameHandler.player.receiveHit('A1');
gameHandler.player.receiveHit("A2");
gameHandler.player.receiveHit("A7");
gameHandler.computer.placeShip('C4', 4);
gameHandler.updateBoards();
// MOCK
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUN4QixNQUFNLENBQUM1QyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyQ29FLFdBQVcsQ0FBQ3hCLE1BQU0sQ0FBQzlCLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbkNzRCxXQUFXLENBQUN4QixNQUFNLENBQUM5QixVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ25Dc0QsV0FBVyxDQUFDeEIsTUFBTSxDQUFDOUIsVUFBVSxDQUFDLElBQUksQ0FBQztBQUNuQ3NELFdBQVcsQ0FBQ3hCLE1BQU0sQ0FBQzlCLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbkNzRCxXQUFXLENBQUNKLFFBQVEsQ0FBQ2hFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDb0UsV0FBVyxDQUFDRCxZQUFZLENBQUMsQ0FBQztBQUMxQixPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9TY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL2V2ZW50SGFuZGxlci5qcyIsIndlYnBhY2s6Ly90aXRsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTaGlwID0gcmVxdWlyZShcIi4vU2hpcFwiKTtcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xyXG4gICAgLy9rZXkgZm9yIGNvb3JkaW5hdGUgY29udmVyc2lvblxyXG4gICAgdGhpcy54Q29vcmRpbmF0ZXMgPSBcIkFCQ0RFRkdISUpcIjtcclxuICAgIHRoaXMueUNvb3JkaW5hdGVzID0gXCIxMjM0NTY3ODkxMFwiO1xyXG4gICAgdGhpcy5zaGlwcyA9IFtdO1xyXG4gICAgdGhpcy5taXNzZXMgPSBbXTtcclxuICAgIHRoaXMuaGl0cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8gY29udmVydCB0YWtlbiBjb29yZGluYXRlIChCNCkgaW50byBpbmRleHMgdGhhdCB0aGUgMkQgYm9hcmQgYXJyYXkgY2FuIHVzZSAoWzEsIDNdKVxyXG4gIGNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpIHtcclxuICAgIC8vc3BsaXQgY29vcmRpbmF0ZSBpbiB0d29cclxuICAgIGNvbnN0IHhDb29yZGluYXRlID0gY29vcmRpbmF0ZVswXTtcclxuICAgIGNvbnN0IHlDb29yZGluYXRlID0gY29vcmRpbmF0ZS5zbGljZSgxKTtcclxuICAgIC8vY29udmVydCBlYWNoIGluZGV4IHRvIHJlc3BlY3RpdmUgYXJyYXkgaW5kZXhcclxuICAgIGNvbnN0IHhJbmRleCA9IHRoaXMueENvb3JkaW5hdGVzLmluZGV4T2YoeENvb3JkaW5hdGUpO1xyXG4gICAgY29uc3QgeUluZGV4ID0gcGFyc2VJbnQoeUNvb3JkaW5hdGUsIDEwKSAtIDE7XHJcbiAgICByZXR1cm4gW3hJbmRleCwgeUluZGV4XTtcclxuICB9XHJcblxyXG4gIGdldEJvYXJkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmRcclxuICB9XHJcblxyXG4gIHBsYWNlU2hpcChzdGFydENvb3JkaW5hdGUsIGxlbmd0aCA9ICcnLCBpc1ZlcnRpY2FsID0gZmFsc2UsIHNoaXAgPSAnJykge1xyXG4gICAgbGV0IGNyZWF0ZWRTaGlwO1xyXG5cclxuICAgIGlmICghdGhpcy5pc1ZhbGlkKHN0YXJ0Q29vcmRpbmF0ZSwgbGVuZ3RoKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLy9jb252ZXJ0IGNvb3JkaW5hdGVzIHRvIGFycmF5IGluZGV4IGNvb3Jkc1xyXG4gICAgbGV0IFtzdGFydFgsIHN0YXJ0WV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKHN0YXJ0Q29vcmRpbmF0ZSk7XHJcblxyXG4gICAgXHJcbiAgICAvL2NyYXRlIHNoaXAgY2xhc3MgaWYgb25lIGRvZXNuO3QgZXhpc3QgYW5kIGFkZCBzaGlwIHRvIHRoZSBib2FyZCdzIHNoaXBzIGFycmF5IHRvIGFjY2VzcyBsYXRlclxyXG4gICAgaWYgKCFzaGlwKSB7XHJcbiAgICAgIGNyZWF0ZWRTaGlwID0gbmV3IFNoaXAobGVuZ3RoKTsgLy9jcmVhdGUgc2hpcCBvYmplY3QgYW5kIGFkZCBpdCB0byBzaGlwcyBhcnJheVxyXG4gICAgICB0aGlzLnNoaXBzLnB1c2goY3JlYXRlZFNoaXApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xyXG4gICAgICBsZW5ndGggPSBzaGlwLmxlbmd0aFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBQbGFjZSBzaGlwIG9uIGJvYXJkXHJcbiAgICBpZiAoaXNWZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0WTsgeSA8PSAobGVuZ3RoICsgc3RhcnRZKSAtMTsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFtzdGFydFhdW3ldID0geyBtYXJrZXI6IFwiU1wiLCBzaGlwOiBzaGlwIHx8IGNyZWF0ZWRTaGlwIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNWZXJ0aWNhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICBmb3IgKGxldCB4ID0gc3RhcnRYOyB4IDw9IChsZW5ndGggKyBzdGFydFgpIC0gMTsgeCsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFt4XVtzdGFydFldID0geyBtYXJrZXI6IFwiU1wiLCBzaGlwOiBzaGlwIHx8IGNyZWF0ZWRTaGlwIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICByZWNlaXZlSGl0KGNvb3JkaW5hdGUpIHtcclxuICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuY29udmVydENvb3JkaW5hdGUoY29vcmRpbmF0ZSk7XHJcblxyXG4gICAgLy9maW5kIGFuZCByZXR1cm4gc2hpcCBjbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvb3JkaW5hdGUsIG1hcmsgYXMgaGl0IG9uIGJvYXJkIGFuZCBzaGlwIGl0c2VsZiwgYW5kIGFkZCB0aGUgaGl0IHRvIGhpdHMgYXJyYXkgaWYgYSBzaGlwIGlzIHByZXNlbnRcclxuICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldICYmIHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID09PSBcIlNcIikge1xyXG4gICAgICBjb25zdCBzaGlwID0gdGhpcy5nZXRTaGlwKGNvb3JkaW5hdGUpO1xyXG4gICAgICB0aGlzLmJvYXJkW3hdW3ldLm1hcmtlciA9IFwiWFwiO1xyXG4gICAgICB0aGlzLmhpdHMucHVzaChbeCwgeV0pO1xyXG4gICAgICBzaGlwLmhpdCgpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3hdW3ldICYmIHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID09PSBcIlhcIikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvYXJkW3hdW3ldID0geyBtYXJrZXI6IFwiT1wiIH07XHJcbiAgICAgIHRoaXMubWlzc2VzLnB1c2goW3gsIHldKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrSGl0KGNvb3JkaW5hdGUpIHtcclxuICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuY29udmVydENvb3JkaW5hdGUoY29vcmRpbmF0ZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID09PSBcIlhcIikgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjaGVja0Nvb3JkaW5hdGUoY29vcmRpbmF0ZSkge1xyXG4gICAgY29uc3QgW3gsIHldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKTtcclxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLmdldFNoaXAoY29vcmRpbmF0ZSlcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtYXJrZXI6IHRoaXMuYm9hcmRbeF1beV0ubWFya2VyLFxyXG4gICAgICBzaGlwOiBzaGlwLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiBzaGlwIGNsYXNzIGluIC5zaGlwIHByb3BlcnR5IG9mIGJvYXJkIHNxdWFyZSBmb3IgYWNjZXNzXHJcbiAgZ2V0U2hpcChjb29yZGluYXRlKSB7XHJcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpXHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZFt4XVt5XS5zaGlwO1xyXG4gIH1cclxuXHJcbiAgaXNWYWxpZChjb29yZGluYXRlLCBsZW5ndGgpIHtcclxuICAgIC8vY29udmVydCBjb29yZGluYXRlXHJcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpO1xyXG5cclxuICAgIGNvbnN0IHJlZ2V4ID0gL14oWzAtOV0pJC87IC8vIHVzZSB0aGlzIHRvIG1hdGNoIG51bWJlcnMgMCB0aHJvdWdoIDkgc2luY2UgY29udmVydGVkIGNvb3JkcyBhcmUgaW4gaW5kZXggZm9ybSBzbyAtMVxyXG5cclxuICAgIC8vdGVzdHMgY29vcmRpbmF0ZXNcclxuICAgIGlmIChyZWdleC50ZXN0KHgpICYmIHJlZ2V4LnRlc3QoeSkpIHsgLy9jaGVjayBpZiBjb252ZXJ0ZWQgY29vcmRzIGZpdCBvbiAxMHgxMCBib2FyZFxyXG4gICAgICBpZiAoeSArIGxlbmd0aCA+PSAxMCB8fCB4ICsgbGVuZ3RoID49IDEwKSByZXR1cm4gZmFsc2U7IC8vdGhlbiBjaGVjayBpZiBpdCB3aWxsIGdvIG9mZiBib2FyZCBib3VuZHMgYnkgYWRkaW5nIHRoZSBsZW5ndGhcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vY29udmVydHMgdGhpcy5taXNzZXMgYXJyYXkgaW50byBuZXcgYXJyYXkgY29udGFpbmluZyBtaXNzZXMgaW4gbGV0dGVyLW51bWJlciBmb3JtYXQgZXg6IEI1XHJcbiAgZ2V0TWlzc2VzKCkge1xyXG4gICAgbGV0IGNvbnZlcnRlZE1pc3NlcyA9IFtdO1xyXG4gICAgdGhpcy5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xyXG4gICAgICBjb25zdCBtaXNzSW5kZXhPbmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgbWlzc1swXSk7IC8vY29udmVydCBmaXJzdCBpbmRleCBvZiBtaXNzIGNvb3JkaW5hdGUgYmFjayBpbnRvIGEgbGV0dGVyXHJcbiAgICAgIGNvbnN0IG5ld01pc3MgPSBtaXNzSW5kZXhPbmUgKyAobWlzc1sxXSArIDEpOyAvLyBjb25jYXRlbmF0ZSBjb252ZXJ0ZWQgbWlzcyB0byByZW1vdmUgY29tbWEgYW5kIGFkZCBvbmUgYmFjayB0byBzZWNvbmQgaW5kZXggZXg6IFsxLCA0XSAtPiBcIkIlXCJcclxuICAgICAgY29udmVydGVkTWlzc2VzLnB1c2gobmV3TWlzcyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb252ZXJ0ZWRNaXNzZXM7XHJcbiAgfVxyXG5cclxuICAvL3doZW4gY2FsbGVkLCBjaGVja3MgaWYgYWxsIHNoaXBzIGluIHRoaXMuc2hpcHMgaGF2ZSBzaGlwLnN1bmsgZXF1YWwgdG8gdHJ1ZVxyXG4gIGFsbFNoaXBzU3VuaygpIHtcclxuICAgIGlmICh0aGlzLnNoaXBzLnNvbWUoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gZmFsc2UpKSByZXR1cm4gdGhpcy5zaGlwcztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL0dhbWVib2FyZFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQoKVxyXG4gICAgICAgIHRoaXMucGxheWVyVHlwZSA9IHBsYXllclR5cGVcclxuICAgIH1cclxuXHJcbiAgICAvL2Z1bmN0aW9ucyB0aGF0IHdpbGwgcnVuIHdpdGhvdXQgbmVlZGluZyB0byBjYWxsIHRoaXMuYm9hcmQgKGV4OiBwbGF5ZXIuYm9hcmQuZ2V0TWlzc2VzKCkgdnMgcGxheWVyLmdldE1pc3NlcygpKVxyXG4gICAgcmVjZWl2ZUhpdChjb29yZGluYXRlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5yZWNlaXZlSGl0KGNvb3JkaW5hdGUpXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tIaXQoY29vcmRpbmF0ZSkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuY2hlY2tIaXQoY29vcmRpbmF0ZSlcclxuICAgIH1cclxuXHJcbiAgICBwbGFjZVNoaXAoc3RhcnRDb29yZGluYXRlLCBsZW5ndGggPSAnJywgaXNWZXJ0aWNhbCA9IGZhbHNlLCBzaGlwID0gJycpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLnBsYWNlU2hpcChzdGFydENvb3JkaW5hdGUsIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcClcclxuICAgIH1cclxuXHJcbiAgICBnZXRNaXNzZXMoKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5nZXRNaXNzZXMoKVxyXG4gICAgfVxyXG5cclxuICAgIGFsbFNoaXBzU3VuaygpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmFsbFNoaXBzU3VuaygpXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL0dhbWVib2FyZFwiKTtcclxuY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL1NoaXBcIik7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoXCIuL1BsYXllclwiKTtcclxuXHJcbi8vc2V0IHVwIGluaXRpYWwgVXNlciBJbnRlcmZhY2UgRE9NIGVsZW1lbnRzIHNvIGV2ZW50IGxpc3RlbmVycyBjYW4gYmUgYWRkZWQgdG8gdGhlbVxyXG5cclxuY2xhc3MgU2NyZWVuQ29udHJvbGxlciB7XHJcbiAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJ1dHRvblwiKSBcclxuICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLWNvbnRhaW5lclwiKTtcclxuICAgICAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtY29udGFpbmVyXCIpXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUGxheWVyQm9hcmQocGxheWVyKSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC1vbmVcIilcclxuXHJcbiAgICAgICAgd2hpbGUgKGJvYXJkRGlzcGxheS5sYXN0Q2hpbGQpIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2FtZUJvYXJkID0gcGxheWVyLmJvYXJkLmJvYXJkXHJcblxyXG4gICAgICAgIGdhbWVCb2FyZC5mb3JFYWNoKChhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKChjZWxsKSA9PntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgICAgIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2JveCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJTXCIpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gJ08nKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmREaXNwbGF5LmFwcGVuZENoaWxkKGdyaWRFbGVtZW50KVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdhbWVCb2FyZFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXB1dGVyQm9hcmQoY3B1KSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIik7XHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKVxyXG4gICAgICAgIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2FtZUJvYXJkID0gY3B1LmJvYXJkLmJvYXJkO1xyXG5cclxuICAgICAgICBnYW1lQm9hcmQuZm9yRWFjaCgoYXJyYXkpID0+IHtcclxuICAgICAgICBhcnJheS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJveFwiKTtcclxuICAgICAgICAgICAgaWYgKGNlbGwpIHtcclxuICAgICAgICAgICAgaWYgKGNlbGwubWFya2VyID09PSBcIlNcIikgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJPXCIpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheS5hcHBlbmRDaGlsZChncmlkRWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnYW1lQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZWFsRW5kR2FtZVVJKHdpbm5lcikge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbkNvbnRyb2xsZXI7IiwiY2xhc3MgU2hpcCB7XHJcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIHRoaXMuaGl0cyA9IDA7XHJcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGhpdCgpIHtcclxuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICB0aGlzLmhpdHMgPSB0aGlzLmhpdHMgKz0gMTtcclxuICAgIHRoaXMuaXNTdW5rKClcclxuICB9XHJcblxyXG4gIGlzU3VuaygpIHtcclxuICAgIHRoaXMuc3VuayA9IHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGg7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXAiLCJjb25zdCBVSSA9IHJlcXVpcmUoXCIuL1NjcmVlbkNvbnRyb2xsZXJcIik7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoXCIuL1BsYXllclwiKTtcclxuLy9Vc2UgVUkgZWxlbWVudHMgZnJvbSBTY3JlZW5Db250cm9sbGVyIHRvIGFkZCBldmVudCBsaXN0ZW5lcnMgdXNpbmcgVUkgbG9hZGluZyBmdW5jc1xyXG5cclxuY2xhc3MgRXZlbnRIYW5kbGVyIHtcclxuICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHRoaXMudWkgPSBuZXcgVUkoKVxyXG4gICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoXCJodW1hblwiKTtcclxuICAgICAgdGhpcy5jb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJjcHVcIik7XHJcbiAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMucGxheWVyIC8vIHRoZSBwbGF5ZXIgd2hvIGlzIHRoZSBcImFjdGl2ZSBwbGF5ZXJcIlxyXG4gICAgfVxyXG4gICBzdGFydEdhbWUoKSB7IC8vcnVuIHNldHVwIGZ1bmNzIGZyb20gU2NyZWVuQ29udHJvbGxlci5qcyBoZXJlIHNpbmNlIGluZGV4LmpzIHdpbGwgb25seSBpbXBvcnQgdGhpcyBmaWxlXHJcbiAgICAgIHRoaXMudWkuc2V0dXBHYW1lKClcclxuICAgICAgdGhpcy51aS5jcmVhdGVQbGF5ZXJCb2FyZCh0aGlzLnBsYXllcilcclxuICAgICAgdGhpcy51aS5jcmVhdGVDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXIpXHJcblxyXG4gICAgICAvL25lZWQgZnVuY3MgZm9yIGFkZGluZyBldmVudGxpc3RlbmVycyB0byBydW4gdGhlIG90aGVyIGZ1bmNzIHRoYXQgcnVuIHRoZSBnYW1lIGhlcmUsIG1lYW5pbmcgc3RhcnRHYW1lKCkgaXMgdGhlIG9ubHkgZnVuYyB0aGF0IG5lZWRzIHRvIHJ1blxyXG4gICB9XHJcblxyXG4gICB1cGRhdGVCb2FyZHMoKSB7Ly8gdGhpcyB3aWxsIHVwZGF0ZSB0aGUgYm9hcmRzIGF0IGFueXRpbWUgd2l0aCB0aGVpciBuZXcgaW5wdXRzXHJcbiAgICAgIHRoaXMudWkuY3JlYXRlUGxheWVyQm9hcmQodGhpcy5wbGF5ZXIpO1xyXG4gICAgICB0aGlzLnVpLmNyZWF0ZUNvbXB1dGVyQm9hcmQodGhpcy5jb21wdXRlcik7XHJcbiAgIH1cclxuXHJcbiAgIC8vZnVuY3MgZm9yIHJ1bm5pbmcgdGhlIGdhbWUgb2ZmIGV2ZW50IGxpc3RlbmVycyBoZXJlXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL21vZHVsZXMvZXZlbnRIYW5kbGVyLmpzXCIpXHJcblxyXG5jb25zdCBnYW1lSGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKVxyXG5nYW1lSGFuZGxlci5zdGFydEdhbWUoKVxyXG5cclxuLy8gTU9DS1xyXG5nYW1lSGFuZGxlci5wbGF5ZXIucGxhY2VTaGlwKCdCMScsIDQpXHJcbmdhbWVIYW5kbGVyLnBsYXllci5yZWNlaXZlSGl0KCdCMScpXHJcbmdhbWVIYW5kbGVyLnBsYXllci5yZWNlaXZlSGl0KCdBMScpXHJcbmdhbWVIYW5kbGVyLnBsYXllci5yZWNlaXZlSGl0KFwiQTJcIik7XHJcbmdhbWVIYW5kbGVyLnBsYXllci5yZWNlaXZlSGl0KFwiQTdcIik7XHJcbmdhbWVIYW5kbGVyLmNvbXB1dGVyLnBsYWNlU2hpcCgnQzQnLCA0KVxyXG5nYW1lSGFuZGxlci51cGRhdGVCb2FyZHMoKVxyXG4vLyBNT0NLXHJcblxyXG4iXSwibmFtZXMiOlsiU2hpcCIsInJlcXVpcmUiLCJHYW1lYm9hcmQiLCJjb25zdHJ1Y3RvciIsImJvYXJkIiwiQXJyYXkiLCJmcm9tIiwibGVuZ3RoIiwiZmlsbCIsInhDb29yZGluYXRlcyIsInlDb29yZGluYXRlcyIsInNoaXBzIiwibWlzc2VzIiwiaGl0cyIsImNvbnZlcnRDb29yZGluYXRlIiwiY29vcmRpbmF0ZSIsInhDb29yZGluYXRlIiwieUNvb3JkaW5hdGUiLCJzbGljZSIsInhJbmRleCIsImluZGV4T2YiLCJ5SW5kZXgiLCJwYXJzZUludCIsImdldEJvYXJkIiwicGxhY2VTaGlwIiwic3RhcnRDb29yZGluYXRlIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiaXNWZXJ0aWNhbCIsInNoaXAiLCJjcmVhdGVkU2hpcCIsImlzVmFsaWQiLCJzdGFydFgiLCJzdGFydFkiLCJwdXNoIiwieSIsIm1hcmtlciIsIngiLCJyZWNlaXZlSGl0IiwiZ2V0U2hpcCIsImhpdCIsImNoZWNrSGl0IiwiY2hlY2tDb29yZGluYXRlIiwicmVnZXgiLCJ0ZXN0IiwiZ2V0TWlzc2VzIiwiY29udmVydGVkTWlzc2VzIiwiZm9yRWFjaCIsIm1pc3MiLCJtaXNzSW5kZXhPbmUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJuZXdNaXNzIiwiYWxsU2hpcHNTdW5rIiwic29tZSIsInN1bmsiLCJtb2R1bGUiLCJleHBvcnRzIiwiUGxheWVyIiwicGxheWVyVHlwZSIsIlNjcmVlbkNvbnRyb2xsZXIiLCJzZXR1cEdhbWUiLCJyZXNldCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdhbWVDb250YWluZXIiLCJib2FyZENvbnRhaW5lciIsImNyZWF0ZVBsYXllckJvYXJkIiwicGxheWVyIiwiYm9hcmREaXNwbGF5IiwibGFzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJnYW1lQm9hcmQiLCJhcnJheSIsImNlbGwiLCJncmlkRWxlbWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUNvbXB1dGVyQm9hcmQiLCJjcHUiLCJyZXZlYWxFbmRHYW1lVUkiLCJ3aW5uZXIiLCJpc1N1bmsiLCJVSSIsIkV2ZW50SGFuZGxlciIsInVpIiwiY29tcHV0ZXIiLCJjdXJyZW50UGxheWVyIiwic3RhcnRHYW1lIiwidXBkYXRlQm9hcmRzIiwiZ2FtZUhhbmRsZXIiXSwic291cmNlUm9vdCI6IiJ9