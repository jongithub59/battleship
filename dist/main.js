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
  placeShip(startCoordinate, endCoordinate, ship) {
    let createdShip;
    if (!this.isValid(startCoordinate) || !this.isValid(endCoordinate)) {
      return false;
    }

    //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);
    let [endX, endY] = this.convertCoordinate(endCoordinate);

    // Ensure coordinates are in correct order for placement
    if (startX > endX || startY > endY) {
      [startX, endX] = [Math.min(startX, endX), Math.max(startX, endX)];
      [startY, endY] = [Math.min(startY, endY), Math.max(startY, endY)];
    }

    // Determine ship length if no ship class is provided
    if (!ship) {
      let length;
      if (startY === endY) {
        length = endX - startX + 1; // Horizontal ship
      } else {
        length = endY - startY + 1; // Vertical ship
      }
      createdShip = new Ship(length); //create ship object and add it to ships array
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
    }

    // Place ship on board
    if (startX === endX) {
      // Vertical ship
      for (let y = startY; y <= endY; y++) {
        this.board[startX][y] = {
          marker: "S",
          ship: ship || createdShip
        };
      }
    } else if (startY === endY) {
      // Horizontal ship
      for (let x = startX; x <= endX; x++) {
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
      const ship = this.getShip([x, y]);
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
    const ship = this.getShip([x, y], this.board);
    return {
      marker: this.board[x][y].marker,
      ship: ship
    };
  }

  // return ship class in .ship property of board square for access
  getShip(_ref) {
    let [x, y] = _ref;
    return this.board[x][y].ship;
  }
  isValid(coordinate) {
    //split coordinate
    const x = coordinate[0];
    const y = coordinate.slice(1);
    const regex = /^[A-J]+$/; //contains A-J the only valid coordinates for the x-axis
    const regex2 = /^([1-9]|10)$/; //contains 1-10 the only valid y-axis coordinates

    if (regex.test(x) && regex2.test(y)) return true; //tests both coordinates to see if both indexes pass the conditions set before
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
const ScreenController = __webpack_require__(/*! ./modules/ScreenController */ "./src/modules/ScreenController.js");
const Player = __webpack_require__(/*! ./modules/Player */ "./src/modules/Player.js");
const screenController = new ScreenController();
const player = new Player('human');
player.board.placeShip('B1', 'B4');
player.board.receiveHit("B1");
player.board.receiveHit('A1');
player.board.receiveHit("A2");
player.board.receiveHit("A7");
const cpu = new Player('cpu');
cpu.board.placeShip('C4', 'C8');
screenController.createPlayerBoard(player);
screenController.createComputerBoard(cpu);
window.screenController = screenController;
window.player = player;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUM3QmdDLE1BQU0sQ0FBQ3JFLEtBQUssQ0FBQ3FDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDN0IsTUFBTTZDLEdBQUcsR0FBRyxJQUFJdkIsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUM3QnVCLEdBQUcsQ0FBQ2xGLEtBQUssQ0FBQ29CLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQy9Ca0UsZ0JBQWdCLENBQUNsQixpQkFBaUIsQ0FBQ0MsTUFBTSxDQUFDO0FBQzFDaUIsZ0JBQWdCLENBQUNMLG1CQUFtQixDQUFDQyxHQUFHLENBQUM7QUFFekNLLE1BQU0sQ0FBQ0QsZ0JBQWdCLEdBQUdBLGdCQUFnQjtBQUMxQ0MsTUFBTSxDQUFDbEIsTUFBTSxHQUFHQSxNQUFNLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL1NjcmVlbkNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9TaGlwLmpzIiwid2VicGFjazovL3RpdGxlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RpdGxlLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9TaGlwXCIpO1xyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XHJcbiAgICAvL2tleSBmb3IgY29vcmRpbmF0ZSBjb252ZXJzaW9uXHJcbiAgICB0aGlzLnhDb29yZGluYXRlcyA9IFwiQUJDREVGR0hJSlwiO1xyXG4gICAgdGhpcy55Q29vcmRpbmF0ZXMgPSBcIjEyMzQ1Njc4OTEwXCI7XHJcbiAgICB0aGlzLnNoaXBzID0gW107XHJcbiAgICB0aGlzLm1pc3NlcyA9IFtdO1xyXG4gICAgdGhpcy5oaXRzID0gW107XHJcbiAgfVxyXG5cclxuICAvLyBjb252ZXJ0IHRha2VuIGNvb3JkaW5hdGUgKEI0KSBpbnRvIGluZGV4cyB0aGF0IHRoZSAyRCBib2FyZCBhcnJheSBjYW4gdXNlIChbMSwgM10pXHJcbiAgY29udmVydENvb3JkaW5hdGUoY29vcmRpbmF0ZSkge1xyXG4gICAgLy9zcGxpdCBjb29yZGluYXRlIGluIHR3b1xyXG4gICAgY29uc3QgeENvb3JkaW5hdGUgPSBjb29yZGluYXRlWzBdO1xyXG4gICAgY29uc3QgeUNvb3JkaW5hdGUgPSBjb29yZGluYXRlLnNsaWNlKDEpO1xyXG4gICAgLy9jb252ZXJ0IGVhY2ggaW5kZXggdG8gcmVzcGVjdGl2ZSBhcnJheSBpbmRleFxyXG4gICAgY29uc3QgeEluZGV4ID0gdGhpcy54Q29vcmRpbmF0ZXMuaW5kZXhPZih4Q29vcmRpbmF0ZSk7XHJcbiAgICBjb25zdCB5SW5kZXggPSBwYXJzZUludCh5Q29vcmRpbmF0ZSwgMTApIC0gMTtcclxuICAgIHJldHVybiBbeEluZGV4LCB5SW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm9hcmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZFxyXG4gIH1cclxuXHJcbiAgcGxhY2VTaGlwKHN0YXJ0Q29vcmRpbmF0ZSwgZW5kQ29vcmRpbmF0ZSwgc2hpcCkge1xyXG4gICAgbGV0IGNyZWF0ZWRTaGlwO1xyXG5cclxuICAgIGlmICghdGhpcy5pc1ZhbGlkKHN0YXJ0Q29vcmRpbmF0ZSkgfHwgIXRoaXMuaXNWYWxpZChlbmRDb29yZGluYXRlKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jb252ZXJ0IGNvb3JkaW5hdGVzIHRvIGFycmF5IGluZGV4IGNvb3Jkc1xyXG4gICAgbGV0IFtzdGFydFgsIHN0YXJ0WV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKHN0YXJ0Q29vcmRpbmF0ZSk7XHJcbiAgICBsZXQgW2VuZFgsIGVuZFldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShlbmRDb29yZGluYXRlKTtcclxuXHJcbiAgICAvLyBFbnN1cmUgY29vcmRpbmF0ZXMgYXJlIGluIGNvcnJlY3Qgb3JkZXIgZm9yIHBsYWNlbWVudFxyXG4gICAgaWYgKHN0YXJ0WCA+IGVuZFggfHwgc3RhcnRZID4gZW5kWSkge1xyXG4gICAgICBbc3RhcnRYLCBlbmRYXSA9IFtNYXRoLm1pbihzdGFydFgsIGVuZFgpLCBNYXRoLm1heChzdGFydFgsIGVuZFgpXTtcclxuICAgICAgW3N0YXJ0WSwgZW5kWV0gPSBbTWF0aC5taW4oc3RhcnRZLCBlbmRZKSwgTWF0aC5tYXgoc3RhcnRZLCBlbmRZKV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIHNoaXAgbGVuZ3RoIGlmIG5vIHNoaXAgY2xhc3MgaXMgcHJvdmlkZWRcclxuICAgIGlmICghc2hpcCkge1xyXG4gICAgICBsZXQgbGVuZ3RoO1xyXG4gICAgICBpZiAoc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgICAgbGVuZ3RoID0gZW5kWCAtIHN0YXJ0WCArIDE7IC8vIEhvcml6b250YWwgc2hpcFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxlbmd0aCA9IGVuZFkgLSBzdGFydFkgKyAxOyAvLyBWZXJ0aWNhbCBzaGlwXHJcbiAgICAgIH1cclxuICAgICAgY3JlYXRlZFNoaXAgPSBuZXcgU2hpcChsZW5ndGgpOyAvL2NyZWF0ZSBzaGlwIG9iamVjdCBhbmQgYWRkIGl0IHRvIHNoaXBzIGFycmF5XHJcbiAgICAgIHRoaXMuc2hpcHMucHVzaChjcmVhdGVkU2hpcCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGxhY2Ugc2hpcCBvbiBib2FyZFxyXG4gICAgaWYgKHN0YXJ0WCA9PT0gZW5kWCkge1xyXG4gICAgICAvLyBWZXJ0aWNhbCBzaGlwXHJcbiAgICAgIGZvciAobGV0IHkgPSBzdGFydFk7IHkgPD0gZW5kWTsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFtzdGFydFhdW3ldID0geyBtYXJrZXI6IFwiU1wiLCBzaGlwOiBzaGlwIHx8IGNyZWF0ZWRTaGlwIH07XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgIC8vIEhvcml6b250YWwgc2hpcFxyXG4gICAgICBmb3IgKGxldCB4ID0gc3RhcnRYOyB4IDw9IGVuZFg7IHgrKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbeF1bc3RhcnRZXSA9IHsgbWFya2VyOiBcIlNcIiwgc2hpcDogc2hpcCB8fCBjcmVhdGVkU2hpcCB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNlaXZlSGl0KGNvb3JkaW5hdGUpIHtcclxuICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuY29udmVydENvb3JkaW5hdGUoY29vcmRpbmF0ZSk7XHJcblxyXG4gICAgLy9maW5kIGFuZCByZXR1cm4gc2hpcCBjbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvb3JkaW5hdGUsIG1hcmsgYXMgaGl0IG9uIGJvYXJkIGFuZCBzaGlwIGl0c2VsZiwgYW5kIGFkZCB0aGUgaGl0IHRvIGhpdHMgYXJyYXkgaWYgYSBzaGlwIGlzIHByZXNlbnRcclxuICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldICYmIHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID09PSBcIlNcIikge1xyXG4gICAgICBjb25zdCBzaGlwID0gdGhpcy5nZXRTaGlwKFt4LCB5XSk7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID0gXCJYXCI7XHJcbiAgICAgIHRoaXMuaGl0cy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgIHNoaXAuaGl0KCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm9hcmRbeF1beV0gJiYgdGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0gPSB7IG1hcmtlcjogXCJPXCIgfTtcclxuICAgICAgdGhpcy5taXNzZXMucHVzaChbeCwgeV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tIaXQoY29vcmRpbmF0ZSkge1xyXG4gICAgY29uc3QgW3gsIHldID0gdGhpcy5jb252ZXJ0Q29vcmRpbmF0ZShjb29yZGluYXRlKTtcclxuXHJcbiAgICBpZiAodGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGNoZWNrQ29vcmRpbmF0ZShjb29yZGluYXRlKSB7XHJcbiAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmNvbnZlcnRDb29yZGluYXRlKGNvb3JkaW5hdGUpO1xyXG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuZ2V0U2hpcChbeCwgeV0sIHRoaXMuYm9hcmQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1hcmtlcjogdGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIsXHJcbiAgICAgIHNoaXA6IHNoaXAsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gcmV0dXJuIHNoaXAgY2xhc3MgaW4gLnNoaXAgcHJvcGVydHkgb2YgYm9hcmQgc3F1YXJlIGZvciBhY2Nlc3NcclxuICBnZXRTaGlwKFt4LCB5XSkge1xyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmRbeF1beV0uc2hpcDtcclxuICB9XHJcblxyXG4gIGlzVmFsaWQoY29vcmRpbmF0ZSkge1xyXG4gICAgLy9zcGxpdCBjb29yZGluYXRlXHJcbiAgICBjb25zdCB4ID0gY29vcmRpbmF0ZVswXTtcclxuICAgIGNvbnN0IHkgPSBjb29yZGluYXRlLnNsaWNlKDEpO1xyXG5cclxuICAgIGNvbnN0IHJlZ2V4ID0gL15bQS1KXSskLzsgLy9jb250YWlucyBBLUogdGhlIG9ubHkgdmFsaWQgY29vcmRpbmF0ZXMgZm9yIHRoZSB4LWF4aXNcclxuICAgIGNvbnN0IHJlZ2V4MiA9IC9eKFsxLTldfDEwKSQvOyAvL2NvbnRhaW5zIDEtMTAgdGhlIG9ubHkgdmFsaWQgeS1heGlzIGNvb3JkaW5hdGVzXHJcblxyXG4gICAgaWYgKHJlZ2V4LnRlc3QoeCkgJiYgcmVnZXgyLnRlc3QoeSkpIHJldHVybiB0cnVlOyAvL3Rlc3RzIGJvdGggY29vcmRpbmF0ZXMgdG8gc2VlIGlmIGJvdGggaW5kZXhlcyBwYXNzIHRoZSBjb25kaXRpb25zIHNldCBiZWZvcmVcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vY29udmVydHMgdGhpcy5taXNzZXMgYXJyYXkgaW50byBuZXcgYXJyYXkgY29udGFpbmluZyBtaXNzZXMgaW4gbGV0dGVyLW51bWJlciBmb3JtYXQgZXg6IEI1XHJcbiAgZ2V0TWlzc2VzKCkge1xyXG4gICAgbGV0IGNvbnZlcnRlZE1pc3NlcyA9IFtdO1xyXG4gICAgdGhpcy5taXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xyXG4gICAgICBjb25zdCBtaXNzSW5kZXhPbmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgbWlzc1swXSk7IC8vY29udmVydCBmaXJzdCBpbmRleCBvZiBtaXNzIGNvb3JkaW5hdGUgYmFjayBpbnRvIGEgbGV0dGVyXHJcbiAgICAgIGNvbnN0IG5ld01pc3MgPSBtaXNzSW5kZXhPbmUgKyAobWlzc1sxXSArIDEpOyAvLyBjb25jYXRlbmF0ZSBjb252ZXJ0ZWQgbWlzcyB0byByZW1vdmUgY29tbWEgYW5kIGFkZCBvbmUgYmFjayB0byBzZWNvbmQgaW5kZXggZXg6IFsxLCA0XSAtPiBcIkIlXCJcclxuICAgICAgY29udmVydGVkTWlzc2VzLnB1c2gobmV3TWlzcyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb252ZXJ0ZWRNaXNzZXM7XHJcbiAgfVxyXG5cclxuICAvL3doZW4gY2FsbGVkLCBjaGVja3MgaWYgYWxsIHNoaXBzIGluIHRoaXMuc2hpcHMgaGF2ZSBzaGlwLnN1bmsgZXF1YWwgdG8gdHJ1ZVxyXG4gIGFsbFNoaXBzU3VuaygpIHtcclxuICAgIGlmICh0aGlzLnNoaXBzLnNvbWUoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gZmFsc2UpKSByZXR1cm4gdGhpcy5zaGlwcztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL0dhbWVib2FyZFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQoKVxyXG4gICAgICAgIHRoaXMucGxheWVyVHlwZSA9IHBsYXllclR5cGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL0dhbWVib2FyZFwiKTtcclxuY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL1NoaXBcIik7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoXCIuL1BsYXllclwiKTtcclxuXHJcbi8vc2V0IHVwIGluaXRpYWwgVXNlciBJbnRlcmZhY2UgRE9NIGVsZW1lbnRzIHNvIGV2ZW50IGxpc3RlbmVycyBjYW4gYmUgYWRkZWQgdG8gdGhlbVxyXG5cclxuY2xhc3MgU2NyZWVuQ29udHJvbGxlciB7XHJcbiAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJ1dHRvblwiKSBcclxuICAgICAgICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLWNvbnRhaW5lclwiKTtcclxuICAgICAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtY29udGFpbmVyXCIpXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUGxheWVyQm9hcmQocGxheWVyKSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC1vbmVcIilcclxuXHJcbiAgICAgICAgd2hpbGUgKGJvYXJkRGlzcGxheS5sYXN0Q2hpbGQpIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2FtZUJvYXJkID0gcGxheWVyLmJvYXJkLmJvYXJkXHJcblxyXG4gICAgICAgIGdhbWVCb2FyZC5mb3JFYWNoKChhcnJheSkgPT4ge1xyXG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKChjZWxsKSA9PntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgICAgIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2JveCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJTXCIpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gJ08nKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9hcmREaXNwbGF5LmFwcGVuZENoaWxkKGdyaWRFbGVtZW50KVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdhbWVCb2FyZFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbXB1dGVyQm9hcmQoY3B1KSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIik7XHJcblxyXG4gICAgICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKVxyXG4gICAgICAgIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2FtZUJvYXJkID0gY3B1LmJvYXJkLmJvYXJkO1xyXG5cclxuICAgICAgICBnYW1lQm9hcmQuZm9yRWFjaCgoYXJyYXkpID0+IHtcclxuICAgICAgICBhcnJheS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJveFwiKTtcclxuICAgICAgICAgICAgaWYgKGNlbGwpIHtcclxuICAgICAgICAgICAgaWYgKGNlbGwubWFya2VyID09PSBcIlNcIikgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJPXCIpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheS5hcHBlbmRDaGlsZChncmlkRWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBnYW1lQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZWFsRW5kR2FtZVVJKHdpbm5lcikge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbkNvbnRyb2xsZXI7IiwiY2xhc3MgU2hpcCB7XHJcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIHRoaXMuaGl0cyA9IDA7XHJcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGhpdCgpIHtcclxuICAgIGlmICh0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICB0aGlzLmhpdHMgPSB0aGlzLmhpdHMgKz0gMTtcclxuICAgIHRoaXMuaXNTdW5rKClcclxuICB9XHJcblxyXG4gIGlzU3VuaygpIHtcclxuICAgIHRoaXMuc3VuayA9IHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGg7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgU2NyZWVuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9TY3JlZW5Db250cm9sbGVyJylcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vbW9kdWxlcy9QbGF5ZXJcIik7XHJcblxyXG5cclxuY29uc3Qgc2NyZWVuQ29udHJvbGxlciA9IG5ldyBTY3JlZW5Db250cm9sbGVyKClcclxuY29uc3QgcGxheWVyID0gbmV3IFBsYXllcignaHVtYW4nKVxyXG5wbGF5ZXIuYm9hcmQucGxhY2VTaGlwKCdCMScsICdCNCcpXHJcbnBsYXllci5ib2FyZC5yZWNlaXZlSGl0KFwiQjFcIik7XHJcbnBsYXllci5ib2FyZC5yZWNlaXZlSGl0KCdBMScpXHJcbnBsYXllci5ib2FyZC5yZWNlaXZlSGl0KFwiQTJcIik7XHJcbnBsYXllci5ib2FyZC5yZWNlaXZlSGl0KFwiQTdcIik7XHJcbmNvbnN0IGNwdSA9IG5ldyBQbGF5ZXIoJ2NwdScpXHJcbmNwdS5ib2FyZC5wbGFjZVNoaXAoJ0M0JywgJ0M4Jylcclxuc2NyZWVuQ29udHJvbGxlci5jcmVhdGVQbGF5ZXJCb2FyZChwbGF5ZXIpXHJcbnNjcmVlbkNvbnRyb2xsZXIuY3JlYXRlQ29tcHV0ZXJCb2FyZChjcHUpXHJcblxyXG53aW5kb3cuc2NyZWVuQ29udHJvbGxlciA9IHNjcmVlbkNvbnRyb2xsZXJcclxud2luZG93LnBsYXllciA9IHBsYXllcjtcclxuIl0sIm5hbWVzIjpbIlNoaXAiLCJyZXF1aXJlIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJib2FyZCIsIkFycmF5IiwiZnJvbSIsImxlbmd0aCIsImZpbGwiLCJ4Q29vcmRpbmF0ZXMiLCJ5Q29vcmRpbmF0ZXMiLCJzaGlwcyIsIm1pc3NlcyIsImhpdHMiLCJjb252ZXJ0Q29vcmRpbmF0ZSIsImNvb3JkaW5hdGUiLCJ4Q29vcmRpbmF0ZSIsInlDb29yZGluYXRlIiwic2xpY2UiLCJ4SW5kZXgiLCJpbmRleE9mIiwieUluZGV4IiwicGFyc2VJbnQiLCJnZXRCb2FyZCIsInBsYWNlU2hpcCIsInN0YXJ0Q29vcmRpbmF0ZSIsImVuZENvb3JkaW5hdGUiLCJzaGlwIiwiY3JlYXRlZFNoaXAiLCJpc1ZhbGlkIiwic3RhcnRYIiwic3RhcnRZIiwiZW5kWCIsImVuZFkiLCJNYXRoIiwibWluIiwibWF4IiwicHVzaCIsInkiLCJtYXJrZXIiLCJ4IiwicmVjZWl2ZUhpdCIsImdldFNoaXAiLCJoaXQiLCJjaGVja0hpdCIsImNoZWNrQ29vcmRpbmF0ZSIsIl9yZWYiLCJyZWdleCIsInJlZ2V4MiIsInRlc3QiLCJnZXRNaXNzZXMiLCJjb252ZXJ0ZWRNaXNzZXMiLCJmb3JFYWNoIiwibWlzcyIsIm1pc3NJbmRleE9uZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsIm5ld01pc3MiLCJhbGxTaGlwc1N1bmsiLCJzb21lIiwic3VuayIsIm1vZHVsZSIsImV4cG9ydHMiLCJQbGF5ZXIiLCJwbGF5ZXJUeXBlIiwiU2NyZWVuQ29udHJvbGxlciIsInNldHVwR2FtZSIsInJlc2V0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2FtZUNvbnRhaW5lciIsImJvYXJkQ29udGFpbmVyIiwiY3JlYXRlUGxheWVyQm9hcmQiLCJwbGF5ZXIiLCJib2FyZERpc3BsYXkiLCJsYXN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImdhbWVCb2FyZCIsImFycmF5IiwiY2VsbCIsImdyaWRFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImFwcGVuZENoaWxkIiwiY3JlYXRlQ29tcHV0ZXJCb2FyZCIsImNwdSIsInJldmVhbEVuZEdhbWVVSSIsIndpbm5lciIsImlzU3VuayIsInNjcmVlbkNvbnRyb2xsZXIiLCJ3aW5kb3ciXSwic291cmNlUm9vdCI6IiJ9