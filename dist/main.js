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
    this.popBoard();
  }
  popBoard() {}

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
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    let isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ship = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    let createdShip;
    if (!this.isValid(startCoordinate, length)) {
      return false;
    }

    // //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);

    //check that the ship to be placed does not overlap with an existing ship
    const shipCollision = this.checkShipCollision(startX, startY, length, isVertical, ship);

    //if a the new ship does overlap, return false
    if (shipCollision === true) {
      return false;
    }

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
        this.board[startX][y] = {};
        this.board[startX][y].marker = "S";
        this.board[startX][y].ship = ship || createdShip;
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
    if (this.board[x][y] === null) return false;
    return this.board[x][y].ship;
  }

  //check that the ship to be placed is within the board and fits on the board, returns true if valid
  //the board is a standard 10x10 battleship board, so coordinates must be between A-J and 1-10, example board:
  //   1  2  3  4  5  6  7  8  9  10
  // A -  -  -  -  -  -  -  -  -  -
  // B -  -  -  -  -  -  -  -  -  -
  // C -  -  -  -  -  -  -  -  -  -
  // D -  -  -  -  -  -  -  -  -  -
  // E -  -  -  -  -  -  -  -  -  -
  // F -  -  -  -  -  -  -  -  -  -
  // G -  -  -  -  -  -  -  -  -  -
  // H -  -  -  -  -  -  -  -  -  -
  // I -  -  -  -  -  -  -  -  -  -
  // J -  -  -  -  -  -  -  -  -  -
  isValid(coordinate, length) {
    //convert coordinate
    const [x, y] = this.convertCoordinate(coordinate);
    const regex = /^([0-9])$/; // use this to match numbers 0 through 9 since converted coords are in index form so -1

    //tests coordinates
    if (regex.test(x) && regex.test(y)) {
      //check if converted coords fit on 10x10 board
      if (y + length >= 10 || x + length >= 10) return false; //then check if it will go off board bounds by adding the length
      return true; //ship fulfills both conditions, return true
    }
    return false; //ship is not within the 10x10 board (ex: A11) return false
  }

  // check that this new ship will not overlap with an existing ship, returns true if collision is present
  checkShipCollision(startX, startY, length, isVertical, ship) {
    if (ship) length = ship.length;
    if (isVertical) {
      for (let i = startX; i < startX + length; i++) {
        //loop through the cells the ship would be placed on...
        if (this.board[i][startY] === null) return false; //if the cell is null, then no ship is present, no collision
        if (this.board[startX][i].marker === "S") return true; //"s" means ship is present, collison true
      }
    } else {
      for (let i = startY; i < startY + length; i++) {
        if (this.board[startX][i] === null) return false;
        if (this.board[startX][i].marker === "S") return true;
      }
    }
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
    while (boardDisplay.lastChild) {
      boardDisplay.removeChild(boardDisplay.lastChild);
      // boardDisplay.lastChild.remove()
      console.log("yes");
    }
    console.log(boardDisplay.lastChild);
    const gameBoard = player.board.board;
    this.generateBoard(gameBoard, boardDisplay);
  }
  createComputerBoard(cpu) {
    const boardDisplay = document.querySelector("#board-two");
    while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);
    const gameBoard = cpu.board.board;
    this.generateBoard(gameBoard, boardDisplay);
  }
  generateBoard(board, boardDisplay) {
    board.forEach(array => {
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
    document.querySelector('.reset-button').removeEventListener('click', this.resetGame);
    this.addBoardListeners();
    this.addResetListener();
  }
  updateBoards() {
    // this will update the boards at anytime with their new inputs
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
  }

  //funcs for running the game off event listeners here
  addBoardListeners() {
    const playerBoard = document.querySelector('#board-one');
    const computerBoard = document.querySelector("#board-two");
    playerBoard.addEventListener('click', this.clickHandler);
    computerBoard.addEventListener('click', this.clickHandler);
  }
  addResetListener() {
    const reset = document.querySelector('.reset-button');
    reset.addEventListener('click', this.resetGame);
  }
  resetGame = () => {
    document.querySelector("#board-one").removeEventListener("click", this.clickHandler);
    document.querySelector("#board-two").removeEventListener("click", this.clickHandler);
    this.player = new Player("human");
    this.computer = new Player("cpu");
    this.currentPlayer = this.player;
    this.startGame();
  };
  clickHandler(e) {
    const clickedCell = e.target;
    return console.log(clickedCell);
  }
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
gameHandler.startGame(); //this func is all thats needs to be called to run the game  

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxNQUFNQSxZQUFZLEdBQUc1RixtQkFBTyxDQUFDLGdFQUEyQixDQUFDO0FBRXpELE1BQU02RyxXQUFXLEdBQUcsSUFBSWpCLFlBQVksQ0FBQyxDQUFDO0FBQ3RDaUIsV0FBVyxDQUFDYixTQUFTLENBQUMsQ0FBQyxFQUFDOztBQUV4QjtBQUNBYSxXQUFXLENBQUN0QyxNQUFNLENBQUMvQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNyQ3FGLFdBQVcsQ0FBQ3RDLE1BQU0sQ0FBQy9CLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbkNxRSxXQUFXLENBQUN0QyxNQUFNLENBQUMvQixVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ25DcUUsV0FBVyxDQUFDdEMsTUFBTSxDQUFDL0IsVUFBVSxDQUFDLElBQUksQ0FBQztBQUNuQ3FFLFdBQVcsQ0FBQ3RDLE1BQU0sQ0FBQy9CLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDbkNxRSxXQUFXLENBQUNmLFFBQVEsQ0FBQ3RFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDcUYsV0FBVyxDQUFDUixZQUFZLENBQUMsQ0FBQztBQUMxQixPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9TY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL2V2ZW50SGFuZGxlci5qcyIsIndlYnBhY2s6Ly90aXRsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTaGlwID0gcmVxdWlyZShcIi4vU2hpcFwiKTtcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpO1xyXG4gICAgLy9rZXkgZm9yIGNvb3JkaW5hdGUgY29udmVyc2lvblxyXG4gICAgdGhpcy54Q29vcmRpbmF0ZXMgPSBcIkFCQ0RFRkdISUpcIjtcclxuICAgIHRoaXMueUNvb3JkaW5hdGVzID0gXCIxMjM0NTY3ODkxMFwiO1xyXG4gICAgdGhpcy5zaGlwcyA9IFtdO1xyXG4gICAgdGhpcy5taXNzZXMgPSBbXTtcclxuICAgIHRoaXMuaGl0cyA9IFtdO1xyXG4gICAgdGhpcy5wb3BCb2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgcG9wQm9hcmQoKSB7fVxyXG5cclxuICAvLyBjb252ZXJ0IHRha2VuIGNvb3JkaW5hdGUgKEI0KSBpbnRvIGluZGV4cyB0aGF0IHRoZSAyRCBib2FyZCBhcnJheSBjYW4gdXNlIChbMSwgM10pXHJcbiAgY29udmVydENvb3JkaW5hdGUoY29vcmRpbmF0ZSkge1xyXG4gICAgLy9zcGxpdCBjb29yZGluYXRlIGluIHR3b1xyXG4gICAgY29uc3QgeENvb3JkaW5hdGUgPSBjb29yZGluYXRlWzBdO1xyXG4gICAgY29uc3QgeUNvb3JkaW5hdGUgPSBjb29yZGluYXRlLnNsaWNlKDEpO1xyXG4gICAgLy9jb252ZXJ0IGVhY2ggaW5kZXggdG8gcmVzcGVjdGl2ZSBhcnJheSBpbmRleFxyXG4gICAgY29uc3QgeEluZGV4ID0gdGhpcy54Q29vcmRpbmF0ZXMuaW5kZXhPZih4Q29vcmRpbmF0ZSk7XHJcbiAgICBjb25zdCB5SW5kZXggPSBwYXJzZUludCh5Q29vcmRpbmF0ZSwgMTApIC0gMTtcclxuICAgIHJldHVybiBbeEluZGV4LCB5SW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm9hcmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZDtcclxuICB9XHJcblxyXG4gIHBsYWNlU2hpcChzdGFydENvb3JkaW5hdGUsIGxlbmd0aCA9IFwiXCIsIGlzVmVydGljYWwgPSBmYWxzZSwgc2hpcCA9IFwiXCIpIHtcclxuICAgIGxldCBjcmVhdGVkU2hpcDtcclxuXHJcbiAgICBpZiAoIXRoaXMuaXNWYWxpZChzdGFydENvb3JkaW5hdGUsIGxlbmd0aCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC8vY29udmVydCBjb29yZGluYXRlcyB0byBhcnJheSBpbmRleCBjb29yZHNcclxuICAgIGxldCBbc3RhcnRYLCBzdGFydFldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShzdGFydENvb3JkaW5hdGUpO1xyXG5cclxuICAgIC8vY2hlY2sgdGhhdCB0aGUgc2hpcCB0byBiZSBwbGFjZWQgZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFuIGV4aXN0aW5nIHNoaXBcclxuICAgIGNvbnN0IHNoaXBDb2xsaXNpb24gPSB0aGlzLmNoZWNrU2hpcENvbGxpc2lvbihcclxuICAgICAgc3RhcnRYLFxyXG4gICAgICBzdGFydFksXHJcbiAgICAgIGxlbmd0aCxcclxuICAgICAgaXNWZXJ0aWNhbCxcclxuICAgICAgc2hpcFxyXG4gICAgKTtcclxuXHJcbiAgICAvL2lmIGEgdGhlIG5ldyBzaGlwIGRvZXMgb3ZlcmxhcCwgcmV0dXJuIGZhbHNlXHJcbiAgICBpZiAoc2hpcENvbGxpc2lvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jcmF0ZSBzaGlwIGNsYXNzIGlmIG9uZSBkb2Vzbjt0IGV4aXN0IGFuZCBhZGQgc2hpcCB0byB0aGUgYm9hcmQncyBzaGlwcyBhcnJheSB0byBhY2Nlc3MgbGF0ZXJcclxuICAgIGlmICghc2hpcCkge1xyXG4gICAgICBjcmVhdGVkU2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7IC8vY3JlYXRlIHNoaXAgb2JqZWN0IGFuZCBhZGQgaXQgdG8gc2hpcHMgYXJyYXlcclxuICAgICAgdGhpcy5zaGlwcy5wdXNoKGNyZWF0ZWRTaGlwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcclxuICAgICAgbGVuZ3RoID0gc2hpcC5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGxhY2Ugc2hpcCBvbiBib2FyZFxyXG4gICAgaWYgKGlzVmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgIGZvciAobGV0IHkgPSBzdGFydFk7IHkgPD0gbGVuZ3RoICsgc3RhcnRZIC0gMTsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFtzdGFydFhdW3ldID0ge307XHJcbiAgICAgICAgdGhpcy5ib2FyZFtzdGFydFhdW3ldLm1hcmtlciA9IFwiU1wiO1xyXG4gICAgICAgIHRoaXMuYm9hcmRbc3RhcnRYXVt5XS5zaGlwID0gc2hpcCB8fCBjcmVhdGVkU2hpcDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1ZlcnRpY2FsID09PSB0cnVlKSB7XHJcbiAgICAgIGZvciAobGV0IHggPSBzdGFydFg7IHggPD0gbGVuZ3RoICsgc3RhcnRYIC0gMTsgeCsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFt4XVtzdGFydFldID0geyBtYXJrZXI6IFwiU1wiLCBzaGlwOiBzaGlwIHx8IGNyZWF0ZWRTaGlwIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlY2VpdmVIaXQoY29vcmRpbmF0ZSkge1xyXG4gICAgY29uc3QgW3gsIHldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKTtcclxuXHJcbiAgICAvL2ZpbmQgYW5kIHJldHVybiBzaGlwIGNsYXNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29vcmRpbmF0ZSwgbWFyayBhcyBoaXQgb24gYm9hcmQgYW5kIHNoaXAgaXRzZWxmLCBhbmQgYWRkIHRoZSBoaXQgdG8gaGl0cyBhcnJheSBpZiBhIHNoaXAgaXMgcHJlc2VudFxyXG4gICAgaWYgKHRoaXMuYm9hcmRbeF1beV0gJiYgdGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiU1wiKSB7XHJcbiAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLmdldFNoaXAoY29vcmRpbmF0ZSk7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID0gXCJYXCI7XHJcbiAgICAgIHRoaXMuaGl0cy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgIHNoaXAuaGl0KCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm9hcmRbeF1beV0gJiYgdGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0gPSB7IG1hcmtlcjogXCJPXCIgfTtcclxuICAgICAgdGhpcy5taXNzZXMucHVzaChbeCwgeV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tIaXQoY29vcmRpbmF0ZSkge1xyXG4gICAgY29uc3QgW3gsIHldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKTtcclxuXHJcbiAgICBpZiAodGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGNoZWNrQ29vcmRpbmF0ZShjb29yZGluYXRlKSB7XHJcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpO1xyXG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuZ2V0U2hpcChjb29yZGluYXRlKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtYXJrZXI6IHRoaXMuYm9hcmRbeF1beV0ubWFya2VyLFxyXG4gICAgICBzaGlwOiBzaGlwLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiBzaGlwIGNsYXNzIGluIC5zaGlwIHByb3BlcnR5IG9mIGJvYXJkIHNxdWFyZSBmb3IgYWNjZXNzXHJcbiAgZ2V0U2hpcChjb29yZGluYXRlKSB7XHJcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpO1xyXG4gICAgaWYgKHRoaXMuYm9hcmRbeF1beV0gPT09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiB0aGlzLmJvYXJkW3hdW3ldLnNoaXA7XHJcbiAgfVxyXG5cclxuICAvL2NoZWNrIHRoYXQgdGhlIHNoaXAgdG8gYmUgcGxhY2VkIGlzIHdpdGhpbiB0aGUgYm9hcmQgYW5kIGZpdHMgb24gdGhlIGJvYXJkLCByZXR1cm5zIHRydWUgaWYgdmFsaWRcclxuICAvL3RoZSBib2FyZCBpcyBhIHN0YW5kYXJkIDEweDEwIGJhdHRsZXNoaXAgYm9hcmQsIHNvIGNvb3JkaW5hdGVzIG11c3QgYmUgYmV0d2VlbiBBLUogYW5kIDEtMTAsIGV4YW1wbGUgYm9hcmQ6XHJcbiAgLy8gICAxICAyICAzICA0ICA1ICA2ICA3ICA4ICA5ICAxMFxyXG4gIC8vIEEgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEIgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEMgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEQgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEUgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEYgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEcgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEggLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEkgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIC8vIEogLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLSAgLVxyXG4gIGlzVmFsaWQoY29vcmRpbmF0ZSwgbGVuZ3RoKSB7XHJcbiAgICAvL2NvbnZlcnQgY29vcmRpbmF0ZVxyXG4gICAgY29uc3QgW3gsIHldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKTtcclxuXHJcbiAgICBjb25zdCByZWdleCA9IC9eKFswLTldKSQvOyAvLyB1c2UgdGhpcyB0byBtYXRjaCBudW1iZXJzIDAgdGhyb3VnaCA5IHNpbmNlIGNvbnZlcnRlZCBjb29yZHMgYXJlIGluIGluZGV4IGZvcm0gc28gLTFcclxuXHJcbiAgICAvL3Rlc3RzIGNvb3JkaW5hdGVzXHJcbiAgICBpZiAocmVnZXgudGVzdCh4KSAmJiByZWdleC50ZXN0KHkpKSB7XHJcbiAgICAgIC8vY2hlY2sgaWYgY29udmVydGVkIGNvb3JkcyBmaXQgb24gMTB4MTAgYm9hcmRcclxuICAgICAgaWYgKHkgKyBsZW5ndGggPj0gMTAgfHwgeCArIGxlbmd0aCA+PSAxMCkgcmV0dXJuIGZhbHNlOyAvL3RoZW4gY2hlY2sgaWYgaXQgd2lsbCBnbyBvZmYgYm9hcmQgYm91bmRzIGJ5IGFkZGluZyB0aGUgbGVuZ3RoXHJcbiAgICAgIHJldHVybiB0cnVlOyAvL3NoaXAgZnVsZmlsbHMgYm90aCBjb25kaXRpb25zLCByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlOyAvL3NoaXAgaXMgbm90IHdpdGhpbiB0aGUgMTB4MTAgYm9hcmQgKGV4OiBBMTEpIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgdGhhdCB0aGlzIG5ldyBzaGlwIHdpbGwgbm90IG92ZXJsYXAgd2l0aCBhbiBleGlzdGluZyBzaGlwLCByZXR1cm5zIHRydWUgaWYgY29sbGlzaW9uIGlzIHByZXNlbnRcclxuICBjaGVja1NoaXBDb2xsaXNpb24oc3RhcnRYLCBzdGFydFksIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcCkge1xyXG4gICAgaWYgKHNoaXApIGxlbmd0aCA9IHNoaXAubGVuZ3RoO1xyXG5cclxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydFg7IGkgPCBzdGFydFggKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIHRoZSBjZWxscyB0aGUgc2hpcCB3b3VsZCBiZSBwbGFjZWQgb24uLi5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtzdGFydFldID09PSBudWxsKSByZXR1cm4gZmFsc2U7IC8vaWYgdGhlIGNlbGwgaXMgbnVsbCwgdGhlbiBubyBzaGlwIGlzIHByZXNlbnQsIG5vIGNvbGxpc2lvblxyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3N0YXJ0WF1baV0ubWFya2VyID09PSBcIlNcIikgcmV0dXJuIHRydWU7IC8vXCJzXCIgbWVhbnMgc2hpcCBpcyBwcmVzZW50LCBjb2xsaXNvbiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydFk7IGkgPCBzdGFydFkgKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3N0YXJ0WF1baV0gPT09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFhdW2ldLm1hcmtlciA9PT0gXCJTXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL2NvbnZlcnRzIHRoaXMubWlzc2VzIGFycmF5IGludG8gbmV3IGFycmF5IGNvbnRhaW5pbmcgbWlzc2VzIGluIGxldHRlci1udW1iZXIgZm9ybWF0IGV4OiBCNVxyXG4gIGdldE1pc3NlcygpIHtcclxuICAgIGxldCBjb252ZXJ0ZWRNaXNzZXMgPSBbXTtcclxuICAgIHRoaXMubWlzc2VzLmZvckVhY2goKG1pc3MpID0+IHtcclxuICAgICAgY29uc3QgbWlzc0luZGV4T25lID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIG1pc3NbMF0pOyAvL2NvbnZlcnQgZmlyc3QgaW5kZXggb2YgbWlzcyBjb29yZGluYXRlIGJhY2sgaW50byBhIGxldHRlclxyXG4gICAgICBjb25zdCBuZXdNaXNzID0gbWlzc0luZGV4T25lICsgKG1pc3NbMV0gKyAxKTsgLy8gY29uY2F0ZW5hdGUgY29udmVydGVkIG1pc3MgdG8gcmVtb3ZlIGNvbW1hIGFuZCBhZGQgb25lIGJhY2sgdG8gc2Vjb25kIGluZGV4IGV4OiBbMSwgNF0gLT4gXCJCJVwiXHJcbiAgICAgIGNvbnZlcnRlZE1pc3Nlcy5wdXNoKG5ld01pc3MpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY29udmVydGVkTWlzc2VzO1xyXG4gIH1cclxuXHJcbiAgLy93aGVuIGNhbGxlZCwgY2hlY2tzIGlmIGFsbCBzaGlwcyBpbiB0aGlzLnNoaXBzIGhhdmUgc2hpcC5zdW5rIGVxdWFsIHRvIHRydWVcclxuICBhbGxTaGlwc1N1bmsoKSB7XHJcbiAgICBpZiAodGhpcy5zaGlwcy5zb21lKChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IGZhbHNlKSkgcmV0dXJuIHRoaXMuc2hpcHM7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9HYW1lYm9hcmRcIik7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGxheWVyVHlwZSkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkKClcclxuICAgICAgICB0aGlzLnBsYXllclR5cGUgPSBwbGF5ZXJUeXBlXHJcbiAgICB9XHJcblxyXG4gICAgLy9mdW5jdGlvbnMgdGhhdCB3aWxsIHJ1biB3aXRob3V0IG5lZWRpbmcgdG8gY2FsbCB0aGlzLmJvYXJkIChleDogcGxheWVyLmJvYXJkLmdldE1pc3NlcygpIHZzIHBsYXllci5nZXRNaXNzZXMoKSlcclxuICAgIHJlY2VpdmVIaXQoY29vcmRpbmF0ZSkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQucmVjZWl2ZUhpdChjb29yZGluYXRlKVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSGl0KGNvb3JkaW5hdGUpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSGl0KGNvb3JkaW5hdGUpXHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VTaGlwKHN0YXJ0Q29vcmRpbmF0ZSwgbGVuZ3RoID0gJycsIGlzVmVydGljYWwgPSBmYWxzZSwgc2hpcCA9ICcnKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5wbGFjZVNoaXAoc3RhcnRDb29yZGluYXRlLCBsZW5ndGgsIGlzVmVydGljYWwsIHNoaXApXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TWlzc2VzKCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuZ2V0TWlzc2VzKClcclxuICAgIH1cclxuXHJcbiAgICBhbGxTaGlwc1N1bmsoKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5hbGxTaGlwc1N1bmsoKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9HYW1lYm9hcmRcIik7XHJcbmNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9TaGlwXCIpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9QbGF5ZXJcIik7XHJcblxyXG4vL3NldCB1cCBpbml0aWFsIFVzZXIgSW50ZXJmYWNlIERPTSBlbGVtZW50cyBzbyBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIHRvIHRoZW1cclxuXHJcbmNsYXNzIFNjcmVlbkNvbnRyb2xsZXIge1xyXG4gICAgc2V0dXBHYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXNldC1idXR0b25cIikgXHJcbiAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jb250YWluZXJcIik7XHJcbiAgICAgICAgY29uc3QgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkLWNvbnRhaW5lclwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVBsYXllckJvYXJkKHBsYXllcikge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtb25lXCIpXHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgLy8gYm9hcmREaXNwbGF5Lmxhc3RDaGlsZC5yZW1vdmUoKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInllc1wiKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhib2FyZERpc3BsYXkubGFzdENoaWxkKVxyXG4gICAgICAgIGNvbnN0IGdhbWVCb2FyZCA9IHBsYXllci5ib2FyZC5ib2FyZFxyXG5cclxuICAgICAgICB0aGlzLmdlbmVyYXRlQm9hcmQoZ2FtZUJvYXJkLCBib2FyZERpc3BsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXB1dGVyQm9hcmQoY3B1KSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIik7XHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKSBib2FyZERpc3BsYXkucmVtb3ZlQ2hpbGQoYm9hcmREaXNwbGF5Lmxhc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdhbWVCb2FyZCA9IGNwdS5ib2FyZC5ib2FyZDtcclxuXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUJvYXJkKGdhbWVCb2FyZCwgYm9hcmREaXNwbGF5KVxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlQm9hcmQoYm9hcmQsIGJvYXJkRGlzcGxheSkge1xyXG4gICAgICAgIGJvYXJkLmZvckVhY2goKGFycmF5KSA9PiB7XHJcbiAgICAgICAgICBhcnJheS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJveFwiKTtcclxuICAgICAgICAgICAgaWYgKGNlbGwpIHtcclxuICAgICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiU1wiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiT1wiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheS5hcHBlbmRDaGlsZChncmlkRWxlbWVudCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlYWxFbmRHYW1lVUkod2lubmVyKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuQ29udHJvbGxlcjsiLCJjbGFzcyBTaGlwIHtcclxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgdGhpcy5oaXRzID0gMDtcclxuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGl0KCkge1xyXG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHJldHVybjtcclxuICAgIHRoaXMuaGl0cyA9IHRoaXMuaGl0cyArPSAxO1xyXG4gICAgdGhpcy5pc1N1bmsoKVxyXG4gIH1cclxuXHJcbiAgaXNTdW5rKCkge1xyXG4gICAgdGhpcy5zdW5rID0gdGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcCIsImNvbnN0IFVJID0gcmVxdWlyZShcIi4vU2NyZWVuQ29udHJvbGxlclwiKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpO1xyXG4vL1VzZSBVSSBlbGVtZW50cyBmcm9tIFNjcmVlbkNvbnRyb2xsZXIgdG8gYWRkIGV2ZW50IGxpc3RlbmVycyB1c2luZyBVSSBsb2FkaW5nIGZ1bmNzXHJcblxyXG5jbGFzcyBFdmVudEhhbmRsZXIge1xyXG4gICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgdGhpcy51aSA9IG5ldyBVSSgpXHJcbiAgICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcihcImh1bWFuXCIpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcImNwdVwiKTtcclxuICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5wbGF5ZXIgLy8gdGhlIHBsYXllciB3aG8gaXMgdGhlIFwiYWN0aXZlIHBsYXllclwiXHJcbiAgICB9XHJcbiAgIHN0YXJ0R2FtZSgpIHsgLy9ydW4gc2V0dXAgZnVuY3MgZnJvbSBTY3JlZW5Db250cm9sbGVyLmpzIGhlcmUgc2luY2UgaW5kZXguanMgd2lsbCBvbmx5IGltcG9ydCB0aGlzIGZpbGVcclxuICAgICAgdGhpcy51aS5zZXR1cEdhbWUoKVxyXG4gICAgICB0aGlzLnVpLmNyZWF0ZVBsYXllckJvYXJkKHRoaXMucGxheWVyKVxyXG4gICAgICB0aGlzLnVpLmNyZWF0ZUNvbXB1dGVyQm9hcmQodGhpcy5jb21wdXRlcilcclxuXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNldC1idXR0b24nKS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVzZXRHYW1lKVxyXG4gICAgICB0aGlzLmFkZEJvYXJkTGlzdGVuZXJzKClcclxuICAgICAgdGhpcy5hZGRSZXNldExpc3RlbmVyKClcclxuICAgfVxyXG5cclxuICAgdXBkYXRlQm9hcmRzKCkgey8vIHRoaXMgd2lsbCB1cGRhdGUgdGhlIGJvYXJkcyBhdCBhbnl0aW1lIHdpdGggdGhlaXIgbmV3IGlucHV0c1xyXG4gICAgICB0aGlzLnVpLmNyZWF0ZVBsYXllckJvYXJkKHRoaXMucGxheWVyKTtcclxuICAgICAgdGhpcy51aS5jcmVhdGVDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXIpO1xyXG4gICB9XHJcblxyXG4gICAvL2Z1bmNzIGZvciBydW5uaW5nIHRoZSBnYW1lIG9mZiBldmVudCBsaXN0ZW5lcnMgaGVyZVxyXG4gICBhZGRCb2FyZExpc3RlbmVycygpIHtcclxuICAgICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9hcmQtb25lJylcclxuICAgICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtdHdvXCIpO1xyXG5cclxuICAgICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlcilcclxuICAgICAgY29tcHV0ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tIYW5kbGVyKVxyXG4gICB9XHJcblxyXG4gICBhZGRSZXNldExpc3RlbmVyKCkge1xyXG4gICAgICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNldC1idXR0b24nKVxyXG4gICAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVzZXRHYW1lKVxyXG4gICB9XHJcblxyXG4gICByZXNldEdhbWUgPSAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtb25lXCIpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtdHdvXCIpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcihcImh1bWFuXCIpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcImNwdVwiKTtcclxuICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMuc3RhcnRHYW1lKClcclxuICAgfVxyXG5cclxuICAgY2xpY2tIYW5kbGVyKGUpIHtcclxuICAgICAgY29uc3QgY2xpY2tlZENlbGwgPSBlLnRhcmdldFxyXG4gICAgICByZXR1cm4gY29uc29sZS5sb2coY2xpY2tlZENlbGwpXHJcbiAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEhhbmRsZXIiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vbW9kdWxlcy9ldmVudEhhbmRsZXIuanNcIilcclxuXHJcbmNvbnN0IGdhbWVIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpXHJcbmdhbWVIYW5kbGVyLnN0YXJ0R2FtZSgpIC8vdGhpcyBmdW5jIGlzIGFsbCB0aGF0cyBuZWVkcyB0byBiZSBjYWxsZWQgdG8gcnVuIHRoZSBnYW1lICBcclxuXHJcbi8vIE1PQ0tcclxuZ2FtZUhhbmRsZXIucGxheWVyLnBsYWNlU2hpcCgnQjEnLCA0KVxyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdCgnQjEnKVxyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdCgnQTEnKVxyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdChcIkEyXCIpO1xyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdChcIkE3XCIpO1xyXG5nYW1lSGFuZGxlci5jb21wdXRlci5wbGFjZVNoaXAoJ0M0JywgNClcclxuZ2FtZUhhbmRsZXIudXBkYXRlQm9hcmRzKClcclxuLy8gTU9DS1xyXG5cclxuIl0sIm5hbWVzIjpbIlNoaXAiLCJyZXF1aXJlIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJib2FyZCIsIkFycmF5IiwiZnJvbSIsImxlbmd0aCIsImZpbGwiLCJ4Q29vcmRpbmF0ZXMiLCJ5Q29vcmRpbmF0ZXMiLCJzaGlwcyIsIm1pc3NlcyIsImhpdHMiLCJwb3BCb2FyZCIsImNvbnZlcnRDb29yZGluYXRlIiwiY29vcmRpbmF0ZSIsInhDb29yZGluYXRlIiwieUNvb3JkaW5hdGUiLCJzbGljZSIsInhJbmRleCIsImluZGV4T2YiLCJ5SW5kZXgiLCJwYXJzZUludCIsImdldEJvYXJkIiwicGxhY2VTaGlwIiwic3RhcnRDb29yZGluYXRlIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiaXNWZXJ0aWNhbCIsInNoaXAiLCJjcmVhdGVkU2hpcCIsImlzVmFsaWQiLCJzdGFydFgiLCJzdGFydFkiLCJzaGlwQ29sbGlzaW9uIiwiY2hlY2tTaGlwQ29sbGlzaW9uIiwicHVzaCIsInkiLCJtYXJrZXIiLCJ4IiwicmVjZWl2ZUhpdCIsImdldFNoaXAiLCJoaXQiLCJjaGVja0hpdCIsImNoZWNrQ29vcmRpbmF0ZSIsInJlZ2V4IiwidGVzdCIsImkiLCJnZXRNaXNzZXMiLCJjb252ZXJ0ZWRNaXNzZXMiLCJmb3JFYWNoIiwibWlzcyIsIm1pc3NJbmRleE9uZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsIm5ld01pc3MiLCJhbGxTaGlwc1N1bmsiLCJzb21lIiwic3VuayIsIm1vZHVsZSIsImV4cG9ydHMiLCJQbGF5ZXIiLCJwbGF5ZXJUeXBlIiwiU2NyZWVuQ29udHJvbGxlciIsInNldHVwR2FtZSIsInJlc2V0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2FtZUNvbnRhaW5lciIsImJvYXJkQ29udGFpbmVyIiwiY3JlYXRlUGxheWVyQm9hcmQiLCJwbGF5ZXIiLCJib2FyZERpc3BsYXkiLCJsYXN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImNvbnNvbGUiLCJsb2ciLCJnYW1lQm9hcmQiLCJnZW5lcmF0ZUJvYXJkIiwiY3JlYXRlQ29tcHV0ZXJCb2FyZCIsImNwdSIsImFycmF5IiwiY2VsbCIsImdyaWRFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImFwcGVuZENoaWxkIiwicmV2ZWFsRW5kR2FtZVVJIiwid2lubmVyIiwiaXNTdW5rIiwiVUkiLCJFdmVudEhhbmRsZXIiLCJ1aSIsImNvbXB1dGVyIiwiY3VycmVudFBsYXllciIsInN0YXJ0R2FtZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZXNldEdhbWUiLCJhZGRCb2FyZExpc3RlbmVycyIsImFkZFJlc2V0TGlzdGVuZXIiLCJ1cGRhdGVCb2FyZHMiLCJwbGF5ZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xpY2tIYW5kbGVyIiwiZSIsImNsaWNrZWRDZWxsIiwidGFyZ2V0IiwiZ2FtZUhhbmRsZXIiXSwic291cmNlUm9vdCI6IiJ9