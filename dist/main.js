/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/EventHandler.js":
/*!*************************************!*\
  !*** ./src/modules/EventHandler.js ***!
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
    this.activePlayer = this.player; // the player whose turn it is, making their move
    this.inactivePlayer = this.computer; //player who is having a move made on them
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
  addBoardListeners() {
    const playerBoard = document.querySelector('#board-one');
    const computerBoard = document.querySelector("#board-two");
    playerBoard.addEventListener('click', this.attackHandler);
    computerBoard.addEventListener('click', this.attackHandler);
  }
  addResetListener() {
    const reset = document.querySelector('.reset-button');
    reset.addEventListener('click', this.resetGame);
  }

  //reset game by assigning new players to create fresh boards and resetting the turn
  resetGame = () => {
    document.querySelector("#board-one").removeEventListener("click", this.clickHandler);
    document.querySelector("#board-two").removeEventListener("click", this.clickHandler);
    this.player = new Player("human");
    this.computer = new Player("cpu");
    this.currentPlayer = this.player;
    this.startGame();
  };
  attackHandler = e => {
    if (!e.target.classList.value.includes('box')) return; //return if a valid cell is not clicked
    console.log('yes');
    if (e.target.dataset.player === this.activePlayer.playerType) return; //return if a player clicks on their own board
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    const coordinate = [Number(x), Number(y)]; //create the coordinate, forcing them to be numbers
    //if false, then an already hit cell was clicked, so return so another hit can be attempted
    if (!this.inactivePlayer.board.receiveHit(coordinate)) return;
    this.updateBoards();
    this.switchTurns();
  };

  // advance to the next turn by swapping the active player
  switchTurns() {
    if (this.activePlayer === this.player) {
      this.activePlayer = this.computer;
      this.inactivePlayer = this.player;
    } else {
      this.activePlayer = this.player;
      this.inactivePlayer = this.computer;
    }
  }
}
module.exports = EventHandler;

/***/ }),

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
    //key for coordinate conversion, not needed anymore
    this.xCoordinates = "ABCDEFGHIJ";
    this.yCoordinates = "12345678910";
    this.ships = [];
    this.misses = [];
    this.hits = [];
  }

  //no longer needed since board cell will already contain coordinates in converted format
  // convert taken coordinate (B4) into indexs that the 2D board array can use ([1, 3])
  // convertCoordinate(coordinate) {
  //   //split coordinate in two
  //   const xCoordinate = coordinate[0];
  //   const yCoordinate = coordinate.slice(1);
  //   //convert each index to respective array index
  //   const xIndex = this.xCoordinates.indexOf(xCoordinate);
  //   const yIndex = parseInt(yCoordinate, 10) - 1;
  //   return [xIndex, yIndex];
  // }

  getBoard() {
    return this.board;
  }
  placeShip(_ref, length) {
    let [startX, startY] = _ref;
    let isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ship = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    let createdShip;
    if (!this.isValid([startX, startY], length)) return false;

    // //convert coordinates to array index coords

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
  receiveHit(_ref2) {
    let [x, y] = _ref2;
    //find and return ship class associated with the coordinate, mark as hit on board and ship itself, and add the hit to hits array if a ship is present
    if (this.board[x][y] === null) {
      this.board[x][y] = {
        marker: "O"
      };
      this.misses.push([x, y]);
      return true;
    } else if (this.board[x][y].marker === "X") {
      return false;
    } else if (this.board[x][y].marker === "S") {
      const ship = this.getShip([x, y]);
      this.board[x][y] = {
        marker: "X"
      };
      this.hits.push([x, y]);
      ship.hit();
      return true;
    }
  }
  checkHit(_ref3) {
    let [x, y] = _ref3;
    if (this.board[x][y].marker === "X") return true;
    return false;
  }
  checkCoordinate(_ref4) {
    let [x, y] = _ref4;
    const ship = this.getShip([x, y]);
    return {
      marker: this.board[x][y].marker,
      ship: ship
    };
  }

  // return ship class in .ship property of board square for access
  getShip(_ref5) {
    let [x, y] = _ref5;
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
  isValid(_ref6, length) {
    let [x, y] = _ref6;
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
  receiveHit(_ref) {
    let [x, y] = _ref;
    this.board.receiveHit([x, y]);
  }
  checkHit(coordinate) {
    this.board.checkHit(coordinate);
  }
  placeShip(coordinate) {
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    let isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let ship = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    this.board.placeShip(coordinate, length, isVertical, ship);
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
    this.generateBoard(gameBoard, boardDisplay, player);
  }
  createComputerBoard(cpu) {
    const boardDisplay = document.querySelector("#board-two");
    while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);
    const gameBoard = cpu.board.board;
    this.generateBoard(gameBoard, boardDisplay, cpu);
  }
  generateBoard(board, boardDisplay, player) {
    //counter for x coordinate
    let i = 0;
    board.forEach(array => {
      //counter for y coordinate, resets for every row by initializing a new one for each row
      let j = 0;
      array.forEach(cell => {
        const gridElement = document.createElement("div");
        gridElement.classList.add("box");
        if (cell) {
          if (cell.marker === "S") gridElement.classList.add("ship");
          if (cell.marker === "O") gridElement.classList.add("miss");
          if (cell.marker === "X") gridElement.classList.add("hit");
        }
        //save data needed for running methods here in the DOM element for easy access later
        gridElement.dataset.x = i; //save cell coordinates
        gridElement.dataset.y = j;
        gridElement.dataset.player = player.playerType; //tells what player the cell belongs to
        boardDisplay.appendChild(gridElement);
        j++; //increments after each individual cell is created and added
      });
      i++; //increments after each row is complete
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
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const EventHandler = __webpack_require__(/*! ./modules/EventHandler.js */ "./src/modules/EventHandler.js");
const gameHandler = new EventHandler();
gameHandler.startGame(); //this func is all thats needs to be called to run the game  

// MOCK
gameHandler.player.placeShip([1, 0], 4);
gameHandler.player.receiveHit([1, 0]);
gameHandler.player.receiveHit([0, 0]);
gameHandler.player.receiveHit([0, 1]);
gameHandler.player.receiveHit([0, 6]);
gameHandler.computer.placeShip([2, 3], 4);
gameHandler.updateBoards();
// MOCK
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUM7QUFDdkN3RCxXQUFXLENBQUM1RyxNQUFNLENBQUNvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckN3RSxXQUFXLENBQUM1RyxNQUFNLENBQUNvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckN3RSxXQUFXLENBQUM1RyxNQUFNLENBQUNvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckN3RSxXQUFXLENBQUM1RyxNQUFNLENBQUNvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckN3RSxXQUFXLENBQUMzRyxRQUFRLENBQUNtRCxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDd0QsV0FBVyxDQUFDOUYsWUFBWSxDQUFDLENBQUM7QUFDMUIsTyIsInNvdXJjZXMiOlsid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvRXZlbnRIYW5kbGVyLmpzIiwid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvUGxheWVyLmpzIiwid2VicGFjazovL3RpdGxlLy4vc3JjL21vZHVsZXMvU2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVUkgPSByZXF1aXJlKFwiLi9TY3JlZW5Db250cm9sbGVyXCIpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9QbGF5ZXJcIik7XHJcbi8vVXNlIFVJIGVsZW1lbnRzIGZyb20gU2NyZWVuQ29udHJvbGxlciB0byBhZGQgZXZlbnQgbGlzdGVuZXJzIHVzaW5nIFVJIGxvYWRpbmcgZnVuY3NcclxuXHJcbmNsYXNzIEV2ZW50SGFuZGxlciB7XHJcbiAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLnVpID0gbmV3IFVJKClcclxuICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKFwiaHVtYW5cIik7XHJcbiAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY3B1XCIpO1xyXG4gICAgICB0aGlzLmFjdGl2ZVBsYXllciA9IHRoaXMucGxheWVyIC8vIHRoZSBwbGF5ZXIgd2hvc2UgdHVybiBpdCBpcywgbWFraW5nIHRoZWlyIG1vdmVcclxuICAgICAgdGhpcy5pbmFjdGl2ZVBsYXllciA9IHRoaXMuY29tcHV0ZXIgLy9wbGF5ZXIgd2hvIGlzIGhhdmluZyBhIG1vdmUgbWFkZSBvbiB0aGVtXHJcbiAgICB9XHJcbiAgIHN0YXJ0R2FtZSgpIHsgLy9ydW4gc2V0dXAgZnVuY3MgZnJvbSBTY3JlZW5Db250cm9sbGVyLmpzIGhlcmUgc2luY2UgaW5kZXguanMgd2lsbCBvbmx5IGltcG9ydCB0aGlzIGZpbGVcclxuICAgICAgdGhpcy51aS5zZXR1cEdhbWUoKVxyXG4gICAgICB0aGlzLnVpLmNyZWF0ZVBsYXllckJvYXJkKHRoaXMucGxheWVyKVxyXG4gICAgICB0aGlzLnVpLmNyZWF0ZUNvbXB1dGVyQm9hcmQodGhpcy5jb21wdXRlcilcclxuXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNldC1idXR0b24nKS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVzZXRHYW1lKVxyXG4gICAgICB0aGlzLmFkZEJvYXJkTGlzdGVuZXJzKClcclxuICAgICAgdGhpcy5hZGRSZXNldExpc3RlbmVyKClcclxuICAgfVxyXG5cclxuICAgdXBkYXRlQm9hcmRzKCkgey8vIHRoaXMgd2lsbCB1cGRhdGUgdGhlIGJvYXJkcyBhdCBhbnl0aW1lIHdpdGggdGhlaXIgbmV3IGlucHV0c1xyXG4gICAgICB0aGlzLnVpLmNyZWF0ZVBsYXllckJvYXJkKHRoaXMucGxheWVyKTtcclxuICAgICAgdGhpcy51aS5jcmVhdGVDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXIpO1xyXG4gICB9XHJcblxyXG4gICBhZGRCb2FyZExpc3RlbmVycygpIHtcclxuICAgICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9hcmQtb25lJylcclxuICAgICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtdHdvXCIpO1xyXG5cclxuICAgICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmF0dGFja0hhbmRsZXIpXHJcbiAgICAgIGNvbXB1dGVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmF0dGFja0hhbmRsZXIpXHJcbiAgIH1cclxuXHJcbiAgIGFkZFJlc2V0TGlzdGVuZXIoKSB7XHJcbiAgICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2V0LWJ1dHRvbicpXHJcbiAgICAgIHJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5yZXNldEdhbWUpXHJcbiAgIH1cclxuXHJcbiAgIC8vcmVzZXQgZ2FtZSBieSBhc3NpZ25pbmcgbmV3IHBsYXllcnMgdG8gY3JlYXRlIGZyZXNoIGJvYXJkcyBhbmQgcmVzZXR0aW5nIHRoZSB0dXJuXHJcbiAgIHJlc2V0R2FtZSA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC1vbmVcIikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIikucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKFwiaHVtYW5cIik7XHJcbiAgICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY3B1XCIpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgPSB0aGlzLnBsYXllcjtcclxuICAgICAgdGhpcy5zdGFydEdhbWUoKVxyXG4gICB9XHJcblxyXG4gICBhdHRhY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC52YWx1ZS5pbmNsdWRlcygnYm94JykpIHJldHVybjsgLy9yZXR1cm4gaWYgYSB2YWxpZCBjZWxsIGlzIG5vdCBjbGlja2VkXHJcbiAgICAgY29uc29sZS5sb2coJ3llcycpXHJcbiAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXQucGxheWVyID09PSB0aGlzLmFjdGl2ZVBsYXllci5wbGF5ZXJUeXBlKSByZXR1cm47IC8vcmV0dXJuIGlmIGEgcGxheWVyIGNsaWNrcyBvbiB0aGVpciBvd24gYm9hcmRcclxuICAgICBjb25zdCB4ID0gZS50YXJnZXQuZGF0YXNldC54O1xyXG4gICAgIGNvbnN0IHkgPSBlLnRhcmdldC5kYXRhc2V0Lnk7XHJcbiAgICAgY29uc3QgY29vcmRpbmF0ZSA9IFtOdW1iZXIoeCksIE51bWJlcih5KV07IC8vY3JlYXRlIHRoZSBjb29yZGluYXRlLCBmb3JjaW5nIHRoZW0gdG8gYmUgbnVtYmVyc1xyXG4gICAgIC8vaWYgZmFsc2UsIHRoZW4gYW4gYWxyZWFkeSBoaXQgY2VsbCB3YXMgY2xpY2tlZCwgc28gcmV0dXJuIHNvIGFub3RoZXIgaGl0IGNhbiBiZSBhdHRlbXB0ZWRcclxuICAgICBpZiAoIXRoaXMuaW5hY3RpdmVQbGF5ZXIuYm9hcmQucmVjZWl2ZUhpdChjb29yZGluYXRlKSkgcmV0dXJuXHJcbiAgICAgdGhpcy51cGRhdGVCb2FyZHMoKTtcclxuICAgICB0aGlzLnN3aXRjaFR1cm5zKCk7XHJcbiAgIH1cclxuXHJcbiAgIC8vIGFkdmFuY2UgdG8gdGhlIG5leHQgdHVybiBieSBzd2FwcGluZyB0aGUgYWN0aXZlIHBsYXllclxyXG4gICBzd2l0Y2hUdXJucygpIHtcclxuICAgICAgaWYgKHRoaXMuYWN0aXZlUGxheWVyID09PSB0aGlzLnBsYXllcikge1xyXG4gICAgICAgICB0aGlzLmFjdGl2ZVBsYXllciA9IHRoaXMuY29tcHV0ZXJcclxuICAgICAgICAgdGhpcy5pbmFjdGl2ZVBsYXllciA9IHRoaXMucGxheWVyXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIHRoaXMuYWN0aXZlUGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgICAgIHRoaXMuaW5hY3RpdmVQbGF5ZXIgPSB0aGlzLmNvbXB1dGVyO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyIiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL1NoaXBcIik7XHJcblxyXG5jbGFzcyBHYW1lYm9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTtcclxuICAgIC8va2V5IGZvciBjb29yZGluYXRlIGNvbnZlcnNpb24sIG5vdCBuZWVkZWQgYW55bW9yZVxyXG4gICAgdGhpcy54Q29vcmRpbmF0ZXMgPSBcIkFCQ0RFRkdISUpcIjtcclxuICAgIHRoaXMueUNvb3JkaW5hdGVzID0gXCIxMjM0NTY3ODkxMFwiO1xyXG4gICAgdGhpcy5zaGlwcyA9IFtdO1xyXG4gICAgdGhpcy5taXNzZXMgPSBbXTtcclxuICAgIHRoaXMuaGl0cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy9ubyBsb25nZXIgbmVlZGVkIHNpbmNlIGJvYXJkIGNlbGwgd2lsbCBhbHJlYWR5IGNvbnRhaW4gY29vcmRpbmF0ZXMgaW4gY29udmVydGVkIGZvcm1hdFxyXG4gIC8vIGNvbnZlcnQgdGFrZW4gY29vcmRpbmF0ZSAoQjQpIGludG8gaW5kZXhzIHRoYXQgdGhlIDJEIGJvYXJkIGFycmF5IGNhbiB1c2UgKFsxLCAzXSlcclxuICAvLyBjb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKSB7XHJcbiAgLy8gICAvL3NwbGl0IGNvb3JkaW5hdGUgaW4gdHdvXHJcbiAgLy8gICBjb25zdCB4Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVbMF07XHJcbiAgLy8gICBjb25zdCB5Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGUuc2xpY2UoMSk7XHJcbiAgLy8gICAvL2NvbnZlcnQgZWFjaCBpbmRleCB0byByZXNwZWN0aXZlIGFycmF5IGluZGV4XHJcbiAgLy8gICBjb25zdCB4SW5kZXggPSB0aGlzLnhDb29yZGluYXRlcy5pbmRleE9mKHhDb29yZGluYXRlKTtcclxuICAvLyAgIGNvbnN0IHlJbmRleCA9IHBhcnNlSW50KHlDb29yZGluYXRlLCAxMCkgLSAxO1xyXG4gIC8vICAgcmV0dXJuIFt4SW5kZXgsIHlJbmRleF07XHJcbiAgLy8gfVxyXG5cclxuICBnZXRCb2FyZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmJvYXJkO1xyXG4gIH1cclxuXHJcbiAgcGxhY2VTaGlwKFtzdGFydFgsIHN0YXJ0WV0sbGVuZ3RoLCBpc1ZlcnRpY2FsID0gZmFsc2UsIHNoaXAgPSBcIlwiKSB7XHJcbiAgICBsZXQgY3JlYXRlZFNoaXA7XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoW3N0YXJ0WCwgc3RhcnRZXSwgbGVuZ3RoKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIC8vIC8vY29udmVydCBjb29yZGluYXRlcyB0byBhcnJheSBpbmRleCBjb29yZHNcclxuXHJcbiAgICAvL2NoZWNrIHRoYXQgdGhlIHNoaXAgdG8gYmUgcGxhY2VkIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbiBleGlzdGluZyBzaGlwXHJcbiAgICBjb25zdCBzaGlwQ29sbGlzaW9uID0gdGhpcy5jaGVja1NoaXBDb2xsaXNpb24oXHJcbiAgICAgIHN0YXJ0WCxcclxuICAgICAgc3RhcnRZLFxyXG4gICAgICBsZW5ndGgsXHJcbiAgICAgIGlzVmVydGljYWwsXHJcbiAgICAgIHNoaXBcclxuICAgICk7XHJcblxyXG4gICAgLy9pZiBhIHRoZSBuZXcgc2hpcCBkb2VzIG92ZXJsYXAsIHJldHVybiBmYWxzZVxyXG4gICAgaWYgKHNoaXBDb2xsaXNpb24gPT09IHRydWUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY3JhdGUgc2hpcCBjbGFzcyBpZiBvbmUgZG9lc247dCBleGlzdCBhbmQgYWRkIHNoaXAgdG8gdGhlIGJvYXJkJ3Mgc2hpcHMgYXJyYXkgdG8gYWNjZXNzIGxhdGVyXHJcbiAgICBpZiAoIXNoaXApIHtcclxuICAgICAgY3JlYXRlZFNoaXAgPSBuZXcgU2hpcChsZW5ndGgpOyAvL2NyZWF0ZSBzaGlwIG9iamVjdCBhbmQgYWRkIGl0IHRvIHNoaXBzIGFycmF5XHJcbiAgICAgIHRoaXMuc2hpcHMucHVzaChjcmVhdGVkU2hpcCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XHJcbiAgICAgIGxlbmd0aCA9IHNoaXAubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBsYWNlIHNoaXAgb24gYm9hcmRcclxuICAgIGlmIChpc1ZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICBmb3IgKGxldCB5ID0gc3RhcnRZOyB5IDw9IGxlbmd0aCArIHN0YXJ0WSAtIDE7IHkrKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbc3RhcnRYXVt5XSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYm9hcmRbc3RhcnRYXVt5XS5tYXJrZXIgPSBcIlNcIjtcclxuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WF1beV0uc2hpcCA9IHNoaXAgfHwgY3JlYXRlZFNoaXA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNWZXJ0aWNhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICBmb3IgKGxldCB4ID0gc3RhcnRYOyB4IDw9IGxlbmd0aCArIHN0YXJ0WCAtIDE7IHgrKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbeF1bc3RhcnRZXSA9IHsgbWFya2VyOiBcIlNcIiwgc2hpcDogc2hpcCB8fCBjcmVhdGVkU2hpcCB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNlaXZlSGl0KFt4LCB5XSkge1xyXG4gICAgLy9maW5kIGFuZCByZXR1cm4gc2hpcCBjbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvb3JkaW5hdGUsIG1hcmsgYXMgaGl0IG9uIGJvYXJkIGFuZCBzaGlwIGl0c2VsZiwgYW5kIGFkZCB0aGUgaGl0IHRvIGhpdHMgYXJyYXkgaWYgYSBzaGlwIGlzIHByZXNlbnRcclxuICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0gPSB7IG1hcmtlcjogXCJPXCIgfTtcclxuICAgICAgdGhpcy5taXNzZXMucHVzaChbeCwgeV0pO1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3hdW3ldLm1hcmtlciA9PT0gXCJYXCIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3hdW3ldLm1hcmtlciA9PT0gXCJTXCIpIHtcclxuICAgICAgY29uc3Qgc2hpcCA9IHRoaXMuZ2V0U2hpcChbeCwgeV0pO1xyXG4gICAgICB0aGlzLmJvYXJkW3hdW3ldID0geyBtYXJrZXI6IFwiWFwiIH07XHJcbiAgICAgIHRoaXMuaGl0cy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgIHNoaXAuaGl0KCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tIaXQoW3gsIHldKSB7XHJcbiAgICBpZiAodGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGNoZWNrQ29vcmRpbmF0ZShbeCwgeV0pIHtcclxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLmdldFNoaXAoW3gsIHldKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtYXJrZXI6IHRoaXMuYm9hcmRbeF1beV0ubWFya2VyLFxyXG4gICAgICBzaGlwOiBzaGlwLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiBzaGlwIGNsYXNzIGluIC5zaGlwIHByb3BlcnR5IG9mIGJvYXJkIHNxdWFyZSBmb3IgYWNjZXNzXHJcbiAgZ2V0U2hpcChbeCwgeV0pIHtcclxuICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldID09PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZFt4XVt5XS5zaGlwO1xyXG4gIH1cclxuXHJcbiAgLy9jaGVjayB0aGF0IHRoZSBzaGlwIHRvIGJlIHBsYWNlZCBpcyB3aXRoaW4gdGhlIGJvYXJkIGFuZCBmaXRzIG9uIHRoZSBib2FyZCwgcmV0dXJucyB0cnVlIGlmIHZhbGlkXHJcbiAgLy90aGUgYm9hcmQgaXMgYSBzdGFuZGFyZCAxMHgxMCBiYXR0bGVzaGlwIGJvYXJkLCBzbyBjb29yZGluYXRlcyBtdXN0IGJlIGJldHdlZW4gQS1KIGFuZCAxLTEwLCBleGFtcGxlIGJvYXJkOlxyXG4gIC8vICAgMSAgMiAgMyAgNCAgNSAgNiAgNyAgOCAgOSAgMTBcclxuICAvLyBBIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBCIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBDIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBEIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBFIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBGIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBHIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBIIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBJIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICAvLyBKIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC0gIC1cclxuICBpc1ZhbGlkKFt4LCB5XSwgbGVuZ3RoKSB7XHJcbiAgICBjb25zdCByZWdleCA9IC9eKFswLTldKSQvOyAvLyB1c2UgdGhpcyB0byBtYXRjaCBudW1iZXJzIDAgdGhyb3VnaCA5IHNpbmNlIGNvbnZlcnRlZCBjb29yZHMgYXJlIGluIGluZGV4IGZvcm0gc28gLTFcclxuXHJcbiAgICAvL3Rlc3RzIGNvb3JkaW5hdGVzXHJcbiAgICBpZiAocmVnZXgudGVzdCh4KSAmJiByZWdleC50ZXN0KHkpKSB7XHJcbiAgICAgIC8vY2hlY2sgaWYgY29udmVydGVkIGNvb3JkcyBmaXQgb24gMTB4MTAgYm9hcmRcclxuICAgICAgaWYgKHkgKyBsZW5ndGggPj0gMTAgfHwgeCArIGxlbmd0aCA+PSAxMCkgcmV0dXJuIGZhbHNlOyAvL3RoZW4gY2hlY2sgaWYgaXQgd2lsbCBnbyBvZmYgYm9hcmQgYm91bmRzIGJ5IGFkZGluZyB0aGUgbGVuZ3RoXHJcbiAgICAgIHJldHVybiB0cnVlOyAvL3NoaXAgZnVsZmlsbHMgYm90aCBjb25kaXRpb25zLCByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlOyAvL3NoaXAgaXMgbm90IHdpdGhpbiB0aGUgMTB4MTAgYm9hcmQgKGV4OiBBMTEpIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgdGhhdCB0aGlzIG5ldyBzaGlwIHdpbGwgbm90IG92ZXJsYXAgd2l0aCBhbiBleGlzdGluZyBzaGlwLCByZXR1cm5zIHRydWUgaWYgY29sbGlzaW9uIGlzIHByZXNlbnRcclxuICBjaGVja1NoaXBDb2xsaXNpb24oc3RhcnRYLCBzdGFydFksIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcCkge1xyXG4gICAgaWYgKHNoaXApIGxlbmd0aCA9IHNoaXAubGVuZ3RoO1xyXG5cclxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydFg7IGkgPCBzdGFydFggKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIHRoZSBjZWxscyB0aGUgc2hpcCB3b3VsZCBiZSBwbGFjZWQgb24uLi5cclxuICAgICAgICBpZiAodGhpcy5ib2FyZFtpXVtzdGFydFldID09PSBudWxsKSByZXR1cm4gZmFsc2U7IC8vaWYgdGhlIGNlbGwgaXMgbnVsbCwgdGhlbiBubyBzaGlwIGlzIHByZXNlbnQsIG5vIGNvbGxpc2lvblxyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3N0YXJ0WF1baV0ubWFya2VyID09PSBcIlNcIikgcmV0dXJuIHRydWU7IC8vXCJzXCIgbWVhbnMgc2hpcCBpcyBwcmVzZW50LCBjb2xsaXNvbiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydFk7IGkgPCBzdGFydFkgKyBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3N0YXJ0WF1baV0gPT09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFhdW2ldLm1hcmtlciA9PT0gXCJTXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL2NvbnZlcnRzIHRoaXMubWlzc2VzIGFycmF5IGludG8gbmV3IGFycmF5IGNvbnRhaW5pbmcgbWlzc2VzIGluIGxldHRlci1udW1iZXIgZm9ybWF0IGV4OiBCNVxyXG4gIGdldE1pc3NlcygpIHtcclxuICAgIGxldCBjb252ZXJ0ZWRNaXNzZXMgPSBbXTtcclxuICAgIHRoaXMubWlzc2VzLmZvckVhY2goKG1pc3MpID0+IHtcclxuICAgICAgY29uc3QgbWlzc0luZGV4T25lID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIG1pc3NbMF0pOyAvL2NvbnZlcnQgZmlyc3QgaW5kZXggb2YgbWlzcyBjb29yZGluYXRlIGJhY2sgaW50byBhIGxldHRlclxyXG4gICAgICBjb25zdCBuZXdNaXNzID0gbWlzc0luZGV4T25lICsgKG1pc3NbMV0gKyAxKTsgLy8gY29uY2F0ZW5hdGUgY29udmVydGVkIG1pc3MgdG8gcmVtb3ZlIGNvbW1hIGFuZCBhZGQgb25lIGJhY2sgdG8gc2Vjb25kIGluZGV4IGV4OiBbMSwgNF0gLT4gXCJCJVwiXHJcbiAgICAgIGNvbnZlcnRlZE1pc3Nlcy5wdXNoKG5ld01pc3MpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY29udmVydGVkTWlzc2VzO1xyXG4gIH1cclxuXHJcbiAgLy93aGVuIGNhbGxlZCwgY2hlY2tzIGlmIGFsbCBzaGlwcyBpbiB0aGlzLnNoaXBzIGhhdmUgc2hpcC5zdW5rIGVxdWFsIHRvIHRydWVcclxuICBhbGxTaGlwc1N1bmsoKSB7XHJcbiAgICBpZiAodGhpcy5zaGlwcy5zb21lKChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IGZhbHNlKSkgcmV0dXJuIHRoaXMuc2hpcHM7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9HYW1lYm9hcmRcIik7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGxheWVyVHlwZSkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZWJvYXJkKClcclxuICAgICAgICB0aGlzLnBsYXllclR5cGUgPSBwbGF5ZXJUeXBlXHJcbiAgICB9XHJcblxyXG4gICAgLy9mdW5jdGlvbnMgdGhhdCB3aWxsIHJ1biB3aXRob3V0IG5lZWRpbmcgdG8gY2FsbCB0aGlzLmJvYXJkIChleDogcGxheWVyLmJvYXJkLmdldE1pc3NlcygpIHZzIHBsYXllci5nZXRNaXNzZXMoKSlcclxuICAgIHJlY2VpdmVIaXQoW3gsIHldKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5yZWNlaXZlSGl0KFt4LCB5XSlcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0hpdChjb29yZGluYXRlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5jaGVja0hpdChjb29yZGluYXRlKVxyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlU2hpcChjb29yZGluYXRlLCBsZW5ndGggPSAnJywgaXNWZXJ0aWNhbCA9IGZhbHNlLCBzaGlwID0gJycpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLnBsYWNlU2hpcChjb29yZGluYXRlLCBsZW5ndGgsIGlzVmVydGljYWwsIHNoaXApXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TWlzc2VzKCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmQuZ2V0TWlzc2VzKClcclxuICAgIH1cclxuXHJcbiAgICBhbGxTaGlwc1N1bmsoKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5hbGxTaGlwc1N1bmsoKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJjb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9HYW1lYm9hcmRcIik7XHJcbmNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9TaGlwXCIpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9QbGF5ZXJcIik7XHJcblxyXG4vL3NldCB1cCBpbml0aWFsIFVzZXIgSW50ZXJmYWNlIERPTSBlbGVtZW50cyBzbyBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIHRvIHRoZW1cclxuXHJcbmNsYXNzIFNjcmVlbkNvbnRyb2xsZXIge1xyXG4gICAgc2V0dXBHYW1lKCkge1xyXG4gICAgICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXNldC1idXR0b25cIikgXHJcbiAgICAgICAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jb250YWluZXJcIik7XHJcbiAgICAgICAgY29uc3QgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkLWNvbnRhaW5lclwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVBsYXllckJvYXJkKHBsYXllcikge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtb25lXCIpXHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKSAgYm9hcmREaXNwbGF5LnJlbW92ZUNoaWxkKGJvYXJkRGlzcGxheS5sYXN0Q2hpbGQpO1xyXG5cclxuICAgICAgICBjb25zdCBnYW1lQm9hcmQgPSBwbGF5ZXIuYm9hcmQuYm9hcmRcclxuXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUJvYXJkKGdhbWVCb2FyZCwgYm9hcmREaXNwbGF5LCBwbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXB1dGVyQm9hcmQoY3B1KSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIik7XHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKSBib2FyZERpc3BsYXkucmVtb3ZlQ2hpbGQoYm9hcmREaXNwbGF5Lmxhc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdhbWVCb2FyZCA9IGNwdS5ib2FyZC5ib2FyZDtcclxuXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUJvYXJkKGdhbWVCb2FyZCwgYm9hcmREaXNwbGF5LCBjcHUpXHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVCb2FyZChib2FyZCwgYm9hcmREaXNwbGF5LCBwbGF5ZXIpIHtcclxuICAgICAgLy9jb3VudGVyIGZvciB4IGNvb3JkaW5hdGVcclxuICAgICAgbGV0IGkgPSAwXHJcbiAgICAgIGJvYXJkLmZvckVhY2goKGFycmF5KSA9PiB7XHJcbiAgICAgICAgLy9jb3VudGVyIGZvciB5IGNvb3JkaW5hdGUsIHJlc2V0cyBmb3IgZXZlcnkgcm93IGJ5IGluaXRpYWxpemluZyBhIG5ldyBvbmUgZm9yIGVhY2ggcm93XHJcbiAgICAgICAgbGV0IGogPSAwO1xyXG4gICAgICAgIGFycmF5LmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJib3hcIik7XHJcbiAgICAgICAgICBpZiAoY2VsbCkge1xyXG4gICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiU1wiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcclxuICAgICAgICAgICAgaWYgKGNlbGwubWFya2VyID09PSBcIk9cIikgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJYXCIpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL3NhdmUgZGF0YSBuZWVkZWQgZm9yIHJ1bm5pbmcgbWV0aG9kcyBoZXJlIGluIHRoZSBET00gZWxlbWVudCBmb3IgZWFzeSBhY2Nlc3MgbGF0ZXJcclxuICAgICAgICAgIGdyaWRFbGVtZW50LmRhdGFzZXQueCA9IGk7IC8vc2F2ZSBjZWxsIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICBncmlkRWxlbWVudC5kYXRhc2V0LnkgPSBqO1xyXG4gICAgICAgICAgZ3JpZEVsZW1lbnQuZGF0YXNldC5wbGF5ZXIgPSBwbGF5ZXIucGxheWVyVHlwZTsgLy90ZWxscyB3aGF0IHBsYXllciB0aGUgY2VsbCBiZWxvbmdzIHRvXHJcbiAgICAgICAgICBib2FyZERpc3BsYXkuYXBwZW5kQ2hpbGQoZ3JpZEVsZW1lbnQpO1xyXG4gICAgICAgICAgaisrOyAvL2luY3JlbWVudHMgYWZ0ZXIgZWFjaCBpbmRpdmlkdWFsIGNlbGwgaXMgY3JlYXRlZCBhbmQgYWRkZWRcclxuICAgICAgICB9KTtcclxuICAgICAgICBpKys7IC8vaW5jcmVtZW50cyBhZnRlciBlYWNoIHJvdyBpcyBjb21wbGV0ZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlYWxFbmRHYW1lVUkod2lubmVyKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuQ29udHJvbGxlcjsiLCJjbGFzcyBTaGlwIHtcclxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgdGhpcy5oaXRzID0gMDtcclxuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGl0KCkge1xyXG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHJldHVybjtcclxuICAgIHRoaXMuaGl0cyA9IHRoaXMuaGl0cyArPSAxO1xyXG4gICAgdGhpcy5pc1N1bmsoKVxyXG4gIH1cclxuXHJcbiAgaXNTdW5rKCkge1xyXG4gICAgdGhpcy5zdW5rID0gdGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9tb2R1bGVzL0V2ZW50SGFuZGxlci5qc1wiKTtcclxuXHJcbmNvbnN0IGdhbWVIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpXHJcbmdhbWVIYW5kbGVyLnN0YXJ0R2FtZSgpIC8vdGhpcyBmdW5jIGlzIGFsbCB0aGF0cyBuZWVkcyB0byBiZSBjYWxsZWQgdG8gcnVuIHRoZSBnYW1lICBcclxuXHJcbi8vIE1PQ0tcclxuZ2FtZUhhbmRsZXIucGxheWVyLnBsYWNlU2hpcChbMSwgMF0sIDQpXHJcbmdhbWVIYW5kbGVyLnBsYXllci5yZWNlaXZlSGl0KFsxLCAwXSlcclxuZ2FtZUhhbmRsZXIucGxheWVyLnJlY2VpdmVIaXQoWzAsIDBdKVxyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdChbMCwgMV0pO1xyXG5nYW1lSGFuZGxlci5wbGF5ZXIucmVjZWl2ZUhpdChbMCwgNl0pO1xyXG5nYW1lSGFuZGxlci5jb21wdXRlci5wbGFjZVNoaXAoWzIsIDNdLCA0KVxyXG5nYW1lSGFuZGxlci51cGRhdGVCb2FyZHMoKVxyXG4vLyBNT0NLXHJcblxyXG4iXSwibmFtZXMiOlsiVUkiLCJyZXF1aXJlIiwiUGxheWVyIiwiRXZlbnRIYW5kbGVyIiwiY29uc3RydWN0b3IiLCJ1aSIsInBsYXllciIsImNvbXB1dGVyIiwiYWN0aXZlUGxheWVyIiwiaW5hY3RpdmVQbGF5ZXIiLCJzdGFydEdhbWUiLCJzZXR1cEdhbWUiLCJjcmVhdGVQbGF5ZXJCb2FyZCIsImNyZWF0ZUNvbXB1dGVyQm9hcmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVzZXRHYW1lIiwiYWRkQm9hcmRMaXN0ZW5lcnMiLCJhZGRSZXNldExpc3RlbmVyIiwidXBkYXRlQm9hcmRzIiwicGxheWVyQm9hcmQiLCJjb21wdXRlckJvYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFja0hhbmRsZXIiLCJyZXNldCIsImNsaWNrSGFuZGxlciIsImN1cnJlbnRQbGF5ZXIiLCJlIiwidGFyZ2V0IiwiY2xhc3NMaXN0IiwidmFsdWUiLCJpbmNsdWRlcyIsImNvbnNvbGUiLCJsb2ciLCJkYXRhc2V0IiwicGxheWVyVHlwZSIsIngiLCJ5IiwiY29vcmRpbmF0ZSIsIk51bWJlciIsImJvYXJkIiwicmVjZWl2ZUhpdCIsInN3aXRjaFR1cm5zIiwibW9kdWxlIiwiZXhwb3J0cyIsIlNoaXAiLCJHYW1lYm9hcmQiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJmaWxsIiwieENvb3JkaW5hdGVzIiwieUNvb3JkaW5hdGVzIiwic2hpcHMiLCJtaXNzZXMiLCJoaXRzIiwiZ2V0Qm9hcmQiLCJwbGFjZVNoaXAiLCJfcmVmIiwic3RhcnRYIiwic3RhcnRZIiwiaXNWZXJ0aWNhbCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsInNoaXAiLCJjcmVhdGVkU2hpcCIsImlzVmFsaWQiLCJzaGlwQ29sbGlzaW9uIiwiY2hlY2tTaGlwQ29sbGlzaW9uIiwicHVzaCIsIm1hcmtlciIsIl9yZWYyIiwiZ2V0U2hpcCIsImhpdCIsImNoZWNrSGl0IiwiX3JlZjMiLCJjaGVja0Nvb3JkaW5hdGUiLCJfcmVmNCIsIl9yZWY1IiwiX3JlZjYiLCJyZWdleCIsInRlc3QiLCJpIiwiZ2V0TWlzc2VzIiwiY29udmVydGVkTWlzc2VzIiwiZm9yRWFjaCIsIm1pc3MiLCJtaXNzSW5kZXhPbmUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJuZXdNaXNzIiwiYWxsU2hpcHNTdW5rIiwic29tZSIsInN1bmsiLCJTY3JlZW5Db250cm9sbGVyIiwiZ2FtZUNvbnRhaW5lciIsImJvYXJkQ29udGFpbmVyIiwiYm9hcmREaXNwbGF5IiwibGFzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJnYW1lQm9hcmQiLCJnZW5lcmF0ZUJvYXJkIiwiY3B1IiwiYXJyYXkiLCJqIiwiY2VsbCIsImdyaWRFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImFkZCIsImFwcGVuZENoaWxkIiwicmV2ZWFsRW5kR2FtZVVJIiwid2lubmVyIiwiaXNTdW5rIiwiZ2FtZUhhbmRsZXIiXSwic291cmNlUm9vdCI6IiJ9