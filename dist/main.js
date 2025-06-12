/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/GameHandler.js":
/*!************************************!*\
  !*** ./src/modules/GameHandler.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const UI = __webpack_require__(/*! ./ScreenController */ "./src/modules/ScreenController.js");
const Ship = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");
const Player = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");
//Use UI elements from ScreenController to add event listeners using UI loading funcs

class GameHandler {
  constructor() {
    this.ui = new UI();
    this.player = new Player("Player");
    this.computer = new Player("CPU");
    this.currentShipIndex = 0; // Tracks the current ship being placed
    this.isVertical = false; // Tracks orientation of the ship
    this.activePlayer = this.player; // the player whose turn it is, making their move
    this.inactivePlayer = this.computer; //player who is having a move made on them
  }
  startGame() {
    //run setup funcs from ScreenController.js here since index.js will only import this file
    this.computer.board.generateRandomBoard();
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
    this.ui.updatePlacementDisplay(this.currentShipIndex);
    this.ui.updateTurnDisplay(this.activePlayer);
    document.querySelector(".reset-button").removeEventListener("click", this.resetGame);
    this.addShipPlacementListeners();
    this.addResetListener();
    this.addOrientationListener();
  }
  updateBoards() {
    // this will update the boards at anytime with their new inputs
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
  }

  //initialize listeners for ship placement
  addShipPlacementListeners() {
    const playerBoard = document.querySelector("#board-one");
    playerBoard.addEventListener("mouseover", this.placementHandler); //runs preview funcs when hovering over a board cell
    playerBoard.addEventListener("mouseout", this.removePreview); //runs preview removal funcs when mouse leaves a board cell
    playerBoard.addEventListener("click", this.placeShipHandler); //runs ship placement func when clicking on board cell
  }

  //add listeners for board attacking
  addBoardListeners() {
    const playerBoard = document.querySelector("#board-one");
    const computerBoard = document.querySelector("#board-two");
    playerBoard.addEventListener("click", this.attackHandler);
    computerBoard.addEventListener("click", this.attackHandler);
  }
  addResetListener() {
    const reset = document.querySelector(".reset-button");
    reset.addEventListener("click", this.resetGame);
  }

  //reset game by assigning new players to create fresh boards and resetting the turn
  resetGame = () => {
    document.querySelector("#board-one").removeEventListener("click", this.attackHandler);
    document.querySelector("#board-two").removeEventListener("click", this.attackHandler);
    this.ui.verticalButton.removeEventListener('click', this.changeVertical); //remove orientation changing event listener on reset to prevent weird behavior
    this.player = new Player("Player");
    this.computer = new Player("CPU");
    this.activePlayer = this.player;
    this.inactivePlayer = this.computer;
    this.currentShipIndex = 0;
    this.isVertical = false;
    this.ui.turnDisplay.classList.add("hidden");
    this.ui.endScreen.classList.add("hidden"); //hide the endgame UI
    this.startGame();
  };

  //adds listener to allow ship orientation to be changed
  addOrientationListener() {
    this.ui.verticalButton.addEventListener("click", this.changeVertical);
  }
  changeVertical = () => {
    this.isVertical = !this.isVertical;
  };

  //collect needed info from DOM board datasets and run preview funcs with that info
  placementHandler = e => {
    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const coordinate = [x, y];
    const ship = this.player.board.ships[this.currentShipIndex]; // Select the correct ship based on the current placement sequence
    const isVertical = this.isVertical; // Or true, depending on your orientation handling

    // Determine if the ship can be placed on coordinate to display proper color
    const validPlacement = this.shipHoverHandler(e.target, coordinate, ship, isVertical);

    //run ship placement preview funcs with validity known
    if (validPlacement) {
      this.highlightPlacement(coordinate, ship.length, isVertical, "valid");
    } else {
      this.highlightPlacement(coordinate, ship.length, isVertical, "invalid");
    }
  };

  //access cells that ship will occupy to add the css and color create the preview
  highlightPlacement(coordinate, length, isVertical, status) {
    const [x, y] = coordinate;
    for (let i = 0; i < length; i++) {
      let cell;
      if (isVertical) {
        cell = document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`);
      } else {
        cell = document.querySelector(`[data-x="${x}"][data-y="${y + i}"]`);
      }

      //add css to the cell and replace old css to prevent inconsistincies
      if (cell) {
        if (status === "valid") {
          cell.classList.add("valid");
          cell.classList.remove("invalid");
        } else {
          cell.classList.add("invalid");
          cell.classList.remove("valid");
        }
      }
    }
  }

  //removes css from cells after mouse leaves potential ship placement location
  removePreview = () => {
    this.ui.clearShipPreview();
  };

  //runs checks necessary to see if current hovered location is a valid ship placement
  shipHoverHandler(cell, coordinate, ship, isVertical) {
    if (cell === undefined || !cell.classList.value.includes("box")) return false;
    let valid = true;

    // Check bounds for horizontal and vertical placement, return false if out of bounds
    if (!this.player.board.isValid(coordinate, ship.length, isVertical)) return valid = false;

    // Check for collisions with existing ships
    if (this.player.board.checkShipCollision(coordinate, ship.length, isVertical)) return valid = false;
    return valid; //passed checks returns true
  }

  //places ships on mouse click on board cell, will also do checks as hover previews are done separate
  placeShipHandler = e => {
    if (e.target === undefined || !e.target.classList.value.includes("box")) return false;
    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const ship = this.player.board.ships[this.currentShipIndex];
    if (!ship) return;
    if (this.player.board.placeShip([x, y], "", this.isVertical, ship)) {
      //executes folloing code if placement is successful
      this.ui.createPlayerBoard(this.player); // Refresh the board to show the placed ship
      this.currentShipIndex++; // increment so next ship to be placed will be the next ship in ship array
      this.ui.updatePlacementDisplay(this.currentShipIndex);
      if (this.currentShipIndex === this.player.board.ships.length) {
        //prevent placement by removing listener when 5 placements are done
        this.ui.hidePlacementDisplay();
        this.ui.turnDisplay.classList.remove('hidden');
        this.removePlacementListeners();
        this.addBoardListeners(); //add board listeners now that player ships have been placed
        this.ui.updateTurnDisplay(this.activePlayer);
      }
    }
  };

  //remove placement listeners, preventing hover previews and ship placement from occuring
  removePlacementListeners() {
    const playerBoard = document.querySelector("#board-one");
    playerBoard.removeEventListener("mouseover", this.placementHandler);
    playerBoard.removeEventListener("mouseout", this.removePreview);
    playerBoard.removeEventListener("click", this.placeShipHandler);
  }
  attackHandler = e => {
    if (!e.target.classList.value.includes("box")) return; //return if a valid cell is not clicked
    if (e.target.dataset.player === this.activePlayer.playerType) return; //return if a player clicks on their own board
    // use stored data to make a usable coordinate for receiveHit() and identify valid hit locations
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    console.log([x, y]);
    const marker = e.target.dataset.marker;
    if (marker === "X" || marker === "O") return; //if a hit location is clicked, return to allow new attempt
    const coordinate = [Number(x), Number(y)]; //create the coordinate, forcing them to be numbers
    this.inactivePlayer.board.receiveHit(coordinate);
    //if allShipsSunk() returns true then the active player wins so begin the endgame funcs
    if (this.inactivePlayer.board.allShipsSunk()) {
      const winner = this.activePlayer.playerType;
      this.endGame(winner);
      return;
    }
    this.updateBoards();
    this.switchTurns();
    //add a short delay before the computer attacks so it looks like the computing is thinking
    setTimeout(() => {
      this.computerAttack();
    }, 1000);
  };

  // run a random computer attack after the player's turn
  computerAttack() {
    if (this.activePlayer.playerType === "CPU") {
      while (true) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        //loop until the computer successfully lands a hit, to make sure attacks aren't wasted on already hit boxes
        if (this.player.board.receiveHit([x, y]) === true) {
          break;
        }
      }
      if (this.player.board.allShipsSunk()) {
        const winner = this.computer.playerType;
        this.endGame(winner);
        return;
      }
      this.updateBoards();
      this.switchTurns();
      return true;
    }
  }

  // advance to the next turn by swapping the active player and display the turn
  switchTurns() {
    if (this.activePlayer.playerType === "Player") {
      this.activePlayer = this.computer;
      this.inactivePlayer = this.player;
    } else {
      this.activePlayer = this.player;
      this.inactivePlayer = this.computer;
    }
    this.ui.updateTurnDisplay(this.activePlayer);
  }
  endGame(winner) {
    //update boards one last time and remove event listeners to prevent clicking after the game is over
    this.updateBoards();
    document.querySelector("#board-one").removeEventListener("click", this.attackHandler);
    document.querySelector("#board-two").removeEventListener("click", this.attackHandler);
    console.log(winner);
    // send the winner to end game ui handler to display the winner in the UI
    this.ui.revealEndGameUI(winner);
  }
}
module.exports = GameHandler;

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
    this.initShips();
  }

  // create and append the 5 battleship ship to the ships array
  initShips() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const destroyer = new Ship(3);
    const submarine = new Ship(3);
    const patrolBoat = new Ship(2);
    this.ships.push(carrier, battleship, destroyer, submarine, patrolBoat);
  }

  // Place the 5 different ships of Battleship randomly across the board
  generateRandomBoard() {
    // loop through each ship to generate new coordinates and orientation until valid ships are placed
    this.ships.forEach(ship => {
      while (true) {
        const startX = Math.floor(Math.random() * 10);
        const startY = Math.floor(Math.random() * 10);
        const isVertical = Math.random() < 0.5;
        if (this.placeShip([startX, startY], "", isVertical, ship)) {
          break;
        }
      }
      return true;
    });
  }
  getBoard() {
    return this.board;
  }
  placeShip([startX, startY], length, isVertical = false, ship) {
    let createdShip;

    // Loop until the ship is placed successfully
    while (true) {
      // Check if the coordinates + length are within valid bounds
      if (!this.isValid([startX, startY], length, isVertical, ship)) {
        // If not valid, return false
        return false;
      }

      // Check if the new ship overlaps with any existing ship
      if (this.checkShipCollision([startX, startY], length, isVertical, ship)) {
        // If there's a collision, return false and let the external function handle new coordinates
        return false;
      }

      // If no collision and the placement is valid, break out of the loop
      break;
    }

    // Create the ship if it doesn't already exist and add it to the board's ships array
    if (!ship) {
      createdShip = new Ship(length);
      this.ships.push(createdShip);
    } else {
      length = ship.length;
    }
    // Place the ship on the board horizontally or vertically
    if (isVertical === false) {
      //increment the coordinate related to y-axis to mark cells vertically to make the ship
      for (let y = startY; y < length + startY; y++) {
        this.board[startX][y] = {
          marker: "S",
          ship: ship || createdShip
        };
      }
    } else {
      for (let x = startX; x < length + startX; x++) {
        this.board[x][startY] = {
          marker: "S",
          ship: ship || createdShip
        };
      }
    }

    // Return true to indicate successful placement
    return true;
  }
  receiveHit([x, y]) {
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
  checkHit([x, y]) {
    if (this.board[x][y].marker === "X") return true;
    return false;
  }
  checkCoordinate([x, y]) {
    const ship = this.getShip([x, y]);
    return {
      marker: this.board[x][y].marker,
      ship: ship
    };
  }

  // return ship class in .ship property of board square for access
  getShip([x, y]) {
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
  isValid([x, y], length, isVertical, ship) {
    if (ship) length = ship.length;
    const regex = /^([0-9])$/; // use this to match numbers 0 through 9 since converted coords are in index form so -1

    //check if converted coords fit on 10x10 board
    if (regex.test(x) && regex.test(y)) {
      //then check if it will go off board bounds by adding the length
      if (isVertical) {
        //needs to be 10 since length starts at the coordinate, not after ex: A9(0, 8) with len 2 covers both A9 and A10
        if (x + length > 10) return false;
      } else {
        if (y + length > 10) return false;
      }
      return true; //ship fulfills both conditions, return true
    }
    return false; //ship is not within the 10x10 board (ex: A11) return false
  }

  // check that this new ship will not overlap with an existing ship, returns true if collision is present
  checkShipCollision([startX, startY], length, isVertical, ship) {
    if (ship) length = ship.length;
    if (isVertical) {
      for (let i = startX; i < startX + length; i++) {
        //loop through the cells the ship would be placed on...
        if (this.board[i][startY] !== null) return true; //if the cell is null, then no ship is present, no collision
      }
    } else {
      for (let i = startY; i < startY + length; i++) {
        if (this.board[startX][i] !== null) return true;
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
    if (this.ships.some(ship => ship.sunk === false)) return false;
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
  receiveHit([x, y]) {
    this.board.receiveHit([x, y]);
  }
  checkHit(coordinate) {
    this.board.checkHit(coordinate);
  }
  placeShip(coordinate, length = '', isVertical = false, ship = '') {
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
/***/ ((module) => {

//set up initial User Interface DOM elements so event listeners can be added to them
class ScreenController {
  constructor() {
    this.placementDisplay = document.querySelector(".placement-container");
    this.verticalButton = document.querySelector(".vertical-button");
    this.endScreen = document.querySelector(".winner-container");
    this.turnDisplay = document.querySelector(".turn-container");
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
        if (player.playerType === 'CPU') gridElement.classList.add('box-hover');
        if (cell) {
          if (cell.marker === "S") {
            // Only adds ship class to player's board to keep computers board hidden to the player
            if (player.playerType === "Player") gridElement.classList.add("ship");
          }
          if (cell.marker === "O") gridElement.classList.add("miss");
          if (cell.marker === "X") gridElement.classList.add("hit");
          gridElement.dataset.marker = cell.marker; //needs to be here since in error will occur if null is read
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

  //remove css from all cells that have had them added after mouse leaves the cell
  clearShipPreview() {
    const highlightedCells = document.querySelectorAll(".valid, .invalid");
    highlightedCells.forEach(cell => {
      cell.classList.remove("valid", "invalid");
    });
  }

  // tells the player what ship they will be placing through text based on the ships array index
  updatePlacementDisplay(shipIndex) {
    if (this.placementDisplay.classList.contains('hidden'))
      //ensures ship palcement UI appears after reset
      this.placementDisplay.classList.remove('hidden');
    this.verticalButton.classList.remove("hidden");
    switch (shipIndex) {
      case 0:
        this.placementDisplay.textContent = `Place your Carrier`;
        break;
      case 1:
        this.placementDisplay.textContent = `Place your Battleship`;
        break;
      case 2:
        this.placementDisplay.textContent = `Place your Destroyer`;
        break;
      case 3:
        this.placementDisplay.textContent = `Place your Submarine`;
        break;
      case 4:
        this.placementDisplay.textContent = `Place your Patrol Boat`;
        break;
    }
  }

  //hides the placement related UI, used when placemnet is done
  hidePlacementDisplay() {
    this.placementDisplay.classList.add('hidden');
    this.verticalButton.classList.add('hidden');
  }
  updateTurnDisplay(activePlayer) {
    if (activePlayer.playerType === "CPU") return this.turnDisplay.textContent = `Computer attacking...`;
    this.turnDisplay.textContent = `It's the ${activePlayer.playerType}'s turn`;
  }
  revealEndGameUI(winner) {
    this.endScreen.textContent = `The ${winner} wins!`;
    this.endScreen.classList.remove("hidden");
  }
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const GameHandler = __webpack_require__(/*! ./modules/GameHandler.js */ "./src/modules/GameHandler.js");
const gameHandler = new GameHandler();
gameHandler.startGame(); //this func is all thats needs to be called to run the game
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qy9CLElBQUksQ0FBQ3VDLElBQUksR0FBRyxJQUFJLENBQUNBLElBQUksSUFBSSxDQUFDO0lBQzFCLElBQUksQ0FBQzhDLE1BQU0sQ0FBQyxDQUFDO0VBQ2Y7RUFFQUEsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxDQUFDbkIsSUFBSSxHQUFHLElBQUksQ0FBQzNCLElBQUksS0FBSyxJQUFJLENBQUN2QyxNQUFNO0VBQ3ZDO0FBQ0Y7QUFFQThCLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHcEYsSUFBSTs7Ozs7O1VDbEJyQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7OztBQ3RCQSxNQUFNRSxXQUFXLEdBQUdILG1CQUFPLENBQUMsOERBQTBCLENBQUM7QUFFdkQsTUFBTTRJLFdBQVcsR0FBRyxJQUFJekksV0FBVyxDQUFDLENBQUM7QUFDckN5SSxXQUFXLENBQUNoSSxTQUFTLENBQUMsQ0FBQyxFQUFDLDJEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9HYW1lSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL0dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly90aXRsZS8uL3NyYy9tb2R1bGVzL1NjcmVlbkNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdGl0bGUvLi9zcmMvbW9kdWxlcy9TaGlwLmpzIiwid2VicGFjazovL3RpdGxlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RpdGxlLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFVJID0gcmVxdWlyZShcIi4vU2NyZWVuQ29udHJvbGxlclwiKTtcclxuY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL1NoaXBcIilcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyXCIpO1xyXG4vL1VzZSBVSSBlbGVtZW50cyBmcm9tIFNjcmVlbkNvbnRyb2xsZXIgdG8gYWRkIGV2ZW50IGxpc3RlbmVycyB1c2luZyBVSSBsb2FkaW5nIGZ1bmNzXHJcblxyXG5jbGFzcyBHYW1lSGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVpID0gbmV3IFVJKCk7XHJcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoXCJQbGF5ZXJcIik7XHJcbiAgICB0aGlzLmNvbXB1dGVyID0gbmV3IFBsYXllcihcIkNQVVwiKTtcclxuICAgIHRoaXMuY3VycmVudFNoaXBJbmRleCA9IDA7IC8vIFRyYWNrcyB0aGUgY3VycmVudCBzaGlwIGJlaW5nIHBsYWNlZFxyXG4gICAgdGhpcy5pc1ZlcnRpY2FsID0gZmFsc2U7IC8vIFRyYWNrcyBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcFxyXG4gICAgdGhpcy5hY3RpdmVQbGF5ZXIgPSB0aGlzLnBsYXllcjsgLy8gdGhlIHBsYXllciB3aG9zZSB0dXJuIGl0IGlzLCBtYWtpbmcgdGhlaXIgbW92ZVxyXG4gICAgdGhpcy5pbmFjdGl2ZVBsYXllciA9IHRoaXMuY29tcHV0ZXI7IC8vcGxheWVyIHdobyBpcyBoYXZpbmcgYSBtb3ZlIG1hZGUgb24gdGhlbVxyXG4gIH1cclxuICBzdGFydEdhbWUoKSB7XHJcbiAgICAvL3J1biBzZXR1cCBmdW5jcyBmcm9tIFNjcmVlbkNvbnRyb2xsZXIuanMgaGVyZSBzaW5jZSBpbmRleC5qcyB3aWxsIG9ubHkgaW1wb3J0IHRoaXMgZmlsZVxyXG4gICAgdGhpcy5jb21wdXRlci5ib2FyZC5nZW5lcmF0ZVJhbmRvbUJvYXJkKCk7XHJcbiAgICB0aGlzLnVpLmNyZWF0ZVBsYXllckJvYXJkKHRoaXMucGxheWVyKTtcclxuICAgIHRoaXMudWkuY3JlYXRlQ29tcHV0ZXJCb2FyZCh0aGlzLmNvbXB1dGVyKTtcclxuICAgIHRoaXMudWkudXBkYXRlUGxhY2VtZW50RGlzcGxheSh0aGlzLmN1cnJlbnRTaGlwSW5kZXgpXHJcbiAgICB0aGlzLnVpLnVwZGF0ZVR1cm5EaXNwbGF5KHRoaXMuYWN0aXZlUGxheWVyKTtcclxuXHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihcIi5yZXNldC1idXR0b25cIilcclxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnJlc2V0R2FtZSk7XHJcbiAgICB0aGlzLmFkZFNoaXBQbGFjZW1lbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuYWRkUmVzZXRMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5hZGRPcmllbnRhdGlvbkxpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCb2FyZHMoKSB7XHJcbiAgICAvLyB0aGlzIHdpbGwgdXBkYXRlIHRoZSBib2FyZHMgYXQgYW55dGltZSB3aXRoIHRoZWlyIG5ldyBpbnB1dHNcclxuICAgIHRoaXMudWkuY3JlYXRlUGxheWVyQm9hcmQodGhpcy5wbGF5ZXIpO1xyXG4gICAgdGhpcy51aS5jcmVhdGVDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXIpO1xyXG4gIH1cclxuXHJcbiAgLy9pbml0aWFsaXplIGxpc3RlbmVycyBmb3Igc2hpcCBwbGFjZW1lbnRcclxuICBhZGRTaGlwUGxhY2VtZW50TGlzdGVuZXJzKCkge1xyXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvYXJkLW9uZVwiKTtcclxuXHJcbiAgICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIHRoaXMucGxhY2VtZW50SGFuZGxlcik7IC8vcnVucyBwcmV2aWV3IGZ1bmNzIHdoZW4gaG92ZXJpbmcgb3ZlciBhIGJvYXJkIGNlbGxcclxuICAgIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLnJlbW92ZVByZXZpZXcpOyAvL3J1bnMgcHJldmlldyByZW1vdmFsIGZ1bmNzIHdoZW4gbW91c2UgbGVhdmVzIGEgYm9hcmQgY2VsbFxyXG4gICAgcGxheWVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMucGxhY2VTaGlwSGFuZGxlcik7IC8vcnVucyBzaGlwIHBsYWNlbWVudCBmdW5jIHdoZW4gY2xpY2tpbmcgb24gYm9hcmQgY2VsbFxyXG4gIH1cclxuXHJcbiAgLy9hZGQgbGlzdGVuZXJzIGZvciBib2FyZCBhdHRhY2tpbmdcclxuICBhZGRCb2FyZExpc3RlbmVycygpe1xyXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvYXJkLW9uZVwiKTtcclxuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvYXJkLXR3b1wiKTtcclxuXHJcbiAgICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5hdHRhY2tIYW5kbGVyKTtcclxuICAgIGNvbXB1dGVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuYXR0YWNrSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICBhZGRSZXNldExpc3RlbmVyKCkge1xyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWJ1dHRvblwiKTtcclxuICAgIHJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnJlc2V0R2FtZSk7XHJcbiAgfVxyXG5cclxuICAvL3Jlc2V0IGdhbWUgYnkgYXNzaWduaW5nIG5ldyBwbGF5ZXJzIHRvIGNyZWF0ZSBmcmVzaCBib2FyZHMgYW5kIHJlc2V0dGluZyB0aGUgdHVyblxyXG4gIHJlc2V0R2FtZSA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2JvYXJkLW9uZVwiKVxyXG4gICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuYXR0YWNrSGFuZGxlcik7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihcIiNib2FyZC10d29cIilcclxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmF0dGFja0hhbmRsZXIpO1xyXG4gICAgdGhpcy51aS52ZXJ0aWNhbEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2hhbmdlVmVydGljYWwpIC8vcmVtb3ZlIG9yaWVudGF0aW9uIGNoYW5naW5nIGV2ZW50IGxpc3RlbmVyIG9uIHJlc2V0IHRvIHByZXZlbnQgd2VpcmQgYmVoYXZpb3JcclxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcihcIlBsYXllclwiKTtcclxuICAgIHRoaXMuY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiQ1BVXCIpO1xyXG4gICAgdGhpcy5hY3RpdmVQbGF5ZXIgPSB0aGlzLnBsYXllcjtcclxuICAgIHRoaXMuaW5hY3RpdmVQbGF5ZXIgPSB0aGlzLmNvbXB1dGVyO1xyXG4gICAgdGhpcy5jdXJyZW50U2hpcEluZGV4ID0gMFxyXG4gICAgdGhpcy5pc1ZlcnRpY2FsID0gZmFsc2VcclxuICAgIHRoaXMudWkudHVybkRpc3BsYXkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIHRoaXMudWkuZW5kU2NyZWVuLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7IC8vaGlkZSB0aGUgZW5kZ2FtZSBVSVxyXG4gICAgdGhpcy5zdGFydEdhbWUoKTtcclxuICB9O1xyXG5cclxuICAvL2FkZHMgbGlzdGVuZXIgdG8gYWxsb3cgc2hpcCBvcmllbnRhdGlvbiB0byBiZSBjaGFuZ2VkXHJcbiAgYWRkT3JpZW50YXRpb25MaXN0ZW5lcigpIHtcclxuICAgIHRoaXMudWkudmVydGljYWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2hhbmdlVmVydGljYWwpO1xyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZlcnRpY2FsID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmlzVmVydGljYWwgPSAhdGhpcy5pc1ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgLy9jb2xsZWN0IG5lZWRlZCBpbmZvIGZyb20gRE9NIGJvYXJkIGRhdGFzZXRzIGFuZCBydW4gcHJldmlldyBmdW5jcyB3aXRoIHRoYXQgaW5mb1xyXG4gIHBsYWNlbWVudEhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgY29uc3QgeCA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LngpO1xyXG4gICAgY29uc3QgeSA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LnkpO1xyXG4gICAgY29uc3QgY29vcmRpbmF0ZSA9IFt4LCB5XTtcclxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLnBsYXllci5ib2FyZC5zaGlwc1t0aGlzLmN1cnJlbnRTaGlwSW5kZXhdOyAvLyBTZWxlY3QgdGhlIGNvcnJlY3Qgc2hpcCBiYXNlZCBvbiB0aGUgY3VycmVudCBwbGFjZW1lbnQgc2VxdWVuY2VcclxuICAgIGNvbnN0IGlzVmVydGljYWwgPSB0aGlzLmlzVmVydGljYWw7IC8vIE9yIHRydWUsIGRlcGVuZGluZyBvbiB5b3VyIG9yaWVudGF0aW9uIGhhbmRsaW5nXHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQgb24gY29vcmRpbmF0ZSB0byBkaXNwbGF5IHByb3BlciBjb2xvclxyXG4gICAgY29uc3QgdmFsaWRQbGFjZW1lbnQgPSB0aGlzLnNoaXBIb3ZlckhhbmRsZXIoXHJcbiAgICAgIGUudGFyZ2V0LFxyXG4gICAgICBjb29yZGluYXRlLFxyXG4gICAgICBzaGlwLFxyXG4gICAgICBpc1ZlcnRpY2FsXHJcbiAgICApO1xyXG5cclxuICAgIC8vcnVuIHNoaXAgcGxhY2VtZW50IHByZXZpZXcgZnVuY3Mgd2l0aCB2YWxpZGl0eSBrbm93blxyXG4gICAgaWYgKHZhbGlkUGxhY2VtZW50KSB7XHJcbiAgICAgIHRoaXMuaGlnaGxpZ2h0UGxhY2VtZW50KGNvb3JkaW5hdGUsIHNoaXAubGVuZ3RoLCBpc1ZlcnRpY2FsLCBcInZhbGlkXCIpOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlnaGxpZ2h0UGxhY2VtZW50KGNvb3JkaW5hdGUsIHNoaXAubGVuZ3RoLCBpc1ZlcnRpY2FsLCBcImludmFsaWRcIik7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy9hY2Nlc3MgY2VsbHMgdGhhdCBzaGlwIHdpbGwgb2NjdXB5IHRvIGFkZCB0aGUgY3NzIGFuZCBjb2xvciBjcmVhdGUgdGhlIHByZXZpZXdcclxuICBoaWdobGlnaHRQbGFjZW1lbnQoY29vcmRpbmF0ZSwgbGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGF0dXMpIHtcclxuICAgIGNvbnN0IFt4LCB5XSA9IGNvb3JkaW5hdGU7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY2VsbDtcclxuICAgICAgaWYgKGlzVmVydGljYWwpIHtcclxuICAgICAgICBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eCArIGl9XCJdW2RhdGEteT1cIiR7eX1cIl1gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5ICsgaX1cIl1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9hZGQgY3NzIHRvIHRoZSBjZWxsIGFuZCByZXBsYWNlIG9sZCBjc3MgdG8gcHJldmVudCBpbmNvbnNpc3RpbmNpZXNcclxuICAgICAgaWYgKGNlbGwpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09PSBcInZhbGlkXCIpIHtcclxuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInZhbGlkXCIpO1xyXG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52YWxpZFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaW52YWxpZFwiKTtcclxuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcInZhbGlkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvL3JlbW92ZXMgY3NzIGZyb20gY2VsbHMgYWZ0ZXIgbW91c2UgbGVhdmVzIHBvdGVudGlhbCBzaGlwIHBsYWNlbWVudCBsb2NhdGlvblxyXG4gIHJlbW92ZVByZXZpZXcgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnVpLmNsZWFyU2hpcFByZXZpZXcoKTtcclxuICB9O1xyXG5cclxuICAvL3J1bnMgY2hlY2tzIG5lY2Vzc2FyeSB0byBzZWUgaWYgY3VycmVudCBob3ZlcmVkIGxvY2F0aW9uIGlzIGEgdmFsaWQgc2hpcCBwbGFjZW1lbnRcclxuICBzaGlwSG92ZXJIYW5kbGVyKGNlbGwsIGNvb3JkaW5hdGUsIHNoaXAsIGlzVmVydGljYWwpIHtcclxuICAgIGlmIChjZWxsID09PSB1bmRlZmluZWQgfHwgIWNlbGwuY2xhc3NMaXN0LnZhbHVlLmluY2x1ZGVzKFwiYm94XCIpKVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBDaGVjayBib3VuZHMgZm9yIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBsYWNlbWVudCwgcmV0dXJuIGZhbHNlIGlmIG91dCBvZiBib3VuZHNcclxuICAgIGlmKCF0aGlzLnBsYXllci5ib2FyZC5pc1ZhbGlkKGNvb3JkaW5hdGUsIHNoaXAubGVuZ3RoLCBpc1ZlcnRpY2FsKSkgcmV0dXJuIHZhbGlkID0gZmFsc2VcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIGV4aXN0aW5nIHNoaXBzXHJcbiAgICBpZiAodGhpcy5wbGF5ZXIuYm9hcmQuY2hlY2tTaGlwQ29sbGlzaW9uKGNvb3JkaW5hdGUsIHNoaXAubGVuZ3RoLCBpc1ZlcnRpY2FsKSkgcmV0dXJuIHZhbGlkID0gZmFsc2VcclxuICAgIHJldHVybiB2YWxpZCAvL3Bhc3NlZCBjaGVja3MgcmV0dXJucyB0cnVlXHJcbiAgfVxyXG5cclxuICAvL3BsYWNlcyBzaGlwcyBvbiBtb3VzZSBjbGljayBvbiBib2FyZCBjZWxsLCB3aWxsIGFsc28gZG8gY2hlY2tzIGFzIGhvdmVyIHByZXZpZXdzIGFyZSBkb25lIHNlcGFyYXRlXHJcbiAgcGxhY2VTaGlwSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICBpZiAoZS50YXJnZXQgPT09IHVuZGVmaW5lZCB8fCAhZS50YXJnZXQuY2xhc3NMaXN0LnZhbHVlLmluY2x1ZGVzKFwiYm94XCIpKVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgY29uc3QgeCA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LngpO1xyXG4gICAgY29uc3QgeSA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LnkpO1xyXG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxheWVyLmJvYXJkLnNoaXBzW3RoaXMuY3VycmVudFNoaXBJbmRleF07XHJcbiAgICBpZiAoIXNoaXApIHJldHVybjtcclxuXHJcbiAgICBpZiAodGhpcy5wbGF5ZXIuYm9hcmQucGxhY2VTaGlwKFt4LCB5XSwgXCJcIiwgdGhpcy5pc1ZlcnRpY2FsLCBzaGlwKSkgeyAvL2V4ZWN1dGVzIGZvbGxvaW5nIGNvZGUgaWYgcGxhY2VtZW50IGlzIHN1Y2Nlc3NmdWxcclxuICAgICAgdGhpcy51aS5jcmVhdGVQbGF5ZXJCb2FyZCh0aGlzLnBsYXllcik7IC8vIFJlZnJlc2ggdGhlIGJvYXJkIHRvIHNob3cgdGhlIHBsYWNlZCBzaGlwXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2hpcEluZGV4Kys7IC8vIGluY3JlbWVudCBzbyBuZXh0IHNoaXAgdG8gYmUgcGxhY2VkIHdpbGwgYmUgdGhlIG5leHQgc2hpcCBpbiBzaGlwIGFycmF5XHJcbiAgICAgICAgdGhpcy51aS51cGRhdGVQbGFjZW1lbnREaXNwbGF5KHRoaXMuY3VycmVudFNoaXBJbmRleClcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2hpcEluZGV4ID09PSB0aGlzLnBsYXllci5ib2FyZC5zaGlwcy5sZW5ndGgpIHsgLy9wcmV2ZW50IHBsYWNlbWVudCBieSByZW1vdmluZyBsaXN0ZW5lciB3aGVuIDUgcGxhY2VtZW50cyBhcmUgZG9uZVxyXG4gICAgICAgICAgdGhpcy51aS5oaWRlUGxhY2VtZW50RGlzcGxheSgpXHJcbiAgICAgICAgICB0aGlzLnVpLnR1cm5EaXNwbGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZVBsYWNlbWVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgdGhpcy5hZGRCb2FyZExpc3RlbmVycygpIC8vYWRkIGJvYXJkIGxpc3RlbmVycyBub3cgdGhhdCBwbGF5ZXIgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZFxyXG4gICAgICAgICAgdGhpcy51aS51cGRhdGVUdXJuRGlzcGxheSh0aGlzLmFjdGl2ZVBsYXllcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vcmVtb3ZlIHBsYWNlbWVudCBsaXN0ZW5lcnMsIHByZXZlbnRpbmcgaG92ZXIgcHJldmlld3MgYW5kIHNoaXAgcGxhY2VtZW50IGZyb20gb2NjdXJpbmdcclxuICByZW1vdmVQbGFjZW1lbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtb25lXCIpO1xyXG4gICAgcGxheWVyQm9hcmQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCB0aGlzLnBsYWNlbWVudEhhbmRsZXIpO1xyXG4gICAgcGxheWVyQm9hcmQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMucmVtb3ZlUHJldmlldyk7XHJcbiAgICBwbGF5ZXJCb2FyZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5wbGFjZVNoaXBIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIGF0dGFja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QudmFsdWUuaW5jbHVkZXMoXCJib3hcIikpIHJldHVybjsgLy9yZXR1cm4gaWYgYSB2YWxpZCBjZWxsIGlzIG5vdCBjbGlja2VkXHJcbiAgICBpZiAoZS50YXJnZXQuZGF0YXNldC5wbGF5ZXIgPT09IHRoaXMuYWN0aXZlUGxheWVyLnBsYXllclR5cGUpIHJldHVybjsgLy9yZXR1cm4gaWYgYSBwbGF5ZXIgY2xpY2tzIG9uIHRoZWlyIG93biBib2FyZFxyXG4gICAgLy8gdXNlIHN0b3JlZCBkYXRhIHRvIG1ha2UgYSB1c2FibGUgY29vcmRpbmF0ZSBmb3IgcmVjZWl2ZUhpdCgpIGFuZCBpZGVudGlmeSB2YWxpZCBoaXQgbG9jYXRpb25zXHJcbiAgICBjb25zdCB4ID0gZS50YXJnZXQuZGF0YXNldC54O1xyXG4gICAgY29uc3QgeSA9IGUudGFyZ2V0LmRhdGFzZXQueTtcclxuICAgIGNvbnNvbGUubG9nKFt4LCB5XSk7XHJcbiAgICBjb25zdCBtYXJrZXIgPSBlLnRhcmdldC5kYXRhc2V0Lm1hcmtlcjtcclxuICAgIGlmIChtYXJrZXIgPT09IFwiWFwiIHx8IG1hcmtlciA9PT0gXCJPXCIpIHJldHVybjsgLy9pZiBhIGhpdCBsb2NhdGlvbiBpcyBjbGlja2VkLCByZXR1cm4gdG8gYWxsb3cgbmV3IGF0dGVtcHRcclxuICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBbTnVtYmVyKHgpLCBOdW1iZXIoeSldOyAvL2NyZWF0ZSB0aGUgY29vcmRpbmF0ZSwgZm9yY2luZyB0aGVtIHRvIGJlIG51bWJlcnNcclxuICAgIHRoaXMuaW5hY3RpdmVQbGF5ZXIuYm9hcmQucmVjZWl2ZUhpdChjb29yZGluYXRlKTtcclxuICAgIC8vaWYgYWxsU2hpcHNTdW5rKCkgcmV0dXJucyB0cnVlIHRoZW4gdGhlIGFjdGl2ZSBwbGF5ZXIgd2lucyBzbyBiZWdpbiB0aGUgZW5kZ2FtZSBmdW5jc1xyXG4gICAgaWYgKHRoaXMuaW5hY3RpdmVQbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCkpIHtcclxuICAgICAgY29uc3Qgd2lubmVyID0gdGhpcy5hY3RpdmVQbGF5ZXIucGxheWVyVHlwZTtcclxuICAgICAgdGhpcy5lbmRHYW1lKHdpbm5lcik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQm9hcmRzKCk7XHJcbiAgICB0aGlzLnN3aXRjaFR1cm5zKCk7XHJcbiAgICAvL2FkZCBhIHNob3J0IGRlbGF5IGJlZm9yZSB0aGUgY29tcHV0ZXIgYXR0YWNrcyBzbyBpdCBsb29rcyBsaWtlIHRoZSBjb21wdXRpbmcgaXMgdGhpbmtpbmdcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNvbXB1dGVyQXR0YWNrKCk7XHJcbiAgICB9LCAxMDAwKTtcclxuICB9O1xyXG5cclxuICAvLyBydW4gYSByYW5kb20gY29tcHV0ZXIgYXR0YWNrIGFmdGVyIHRoZSBwbGF5ZXIncyB0dXJuXHJcbiAgY29tcHV0ZXJBdHRhY2soKSB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmVQbGF5ZXIucGxheWVyVHlwZSA9PT0gXCJDUFVcIikge1xyXG4gICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgICAgICAvL2xvb3AgdW50aWwgdGhlIGNvbXB1dGVyIHN1Y2Nlc3NmdWxseSBsYW5kcyBhIGhpdCwgdG8gbWFrZSBzdXJlIGF0dGFja3MgYXJlbid0IHdhc3RlZCBvbiBhbHJlYWR5IGhpdCBib3hlc1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5ib2FyZC5yZWNlaXZlSGl0KFt4LCB5XSkgPT09IHRydWUpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5wbGF5ZXIuYm9hcmQuYWxsU2hpcHNTdW5rKCkpIHtcclxuICAgICAgICBjb25zdCB3aW5uZXIgPSB0aGlzLmNvbXB1dGVyLnBsYXllclR5cGU7XHJcbiAgICAgICAgdGhpcy5lbmRHYW1lKHdpbm5lcik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlQm9hcmRzKCk7XHJcbiAgICAgIHRoaXMuc3dpdGNoVHVybnMoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBhZHZhbmNlIHRvIHRoZSBuZXh0IHR1cm4gYnkgc3dhcHBpbmcgdGhlIGFjdGl2ZSBwbGF5ZXIgYW5kIGRpc3BsYXkgdGhlIHR1cm5cclxuICBzd2l0Y2hUdXJucygpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZVBsYXllci5wbGF5ZXJUeXBlID09PSBcIlBsYXllclwiKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlUGxheWVyID0gdGhpcy5jb21wdXRlcjtcclxuICAgICAgdGhpcy5pbmFjdGl2ZVBsYXllciA9IHRoaXMucGxheWVyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hY3RpdmVQbGF5ZXIgPSB0aGlzLnBsYXllcjtcclxuICAgICAgdGhpcy5pbmFjdGl2ZVBsYXllciA9IHRoaXMuY29tcHV0ZXI7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVpLnVwZGF0ZVR1cm5EaXNwbGF5KHRoaXMuYWN0aXZlUGxheWVyKTtcclxuICB9XHJcblxyXG4gIGVuZEdhbWUod2lubmVyKSB7XHJcbiAgICAvL3VwZGF0ZSBib2FyZHMgb25lIGxhc3QgdGltZSBhbmQgcmVtb3ZlIGV2ZW50IGxpc3RlbmVycyB0byBwcmV2ZW50IGNsaWNraW5nIGFmdGVyIHRoZSBnYW1lIGlzIG92ZXJcclxuICAgIHRoaXMudXBkYXRlQm9hcmRzKCk7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihcIiNib2FyZC1vbmVcIilcclxuICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmF0dGFja0hhbmRsZXIpO1xyXG4gICAgZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtdHdvXCIpXHJcbiAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5hdHRhY2tIYW5kbGVyKTtcclxuICAgIGNvbnNvbGUubG9nKHdpbm5lcik7XHJcbiAgICAvLyBzZW5kIHRoZSB3aW5uZXIgdG8gZW5kIGdhbWUgdWkgaGFuZGxlciB0byBkaXNwbGF5IHRoZSB3aW5uZXIgaW4gdGhlIFVJXHJcbiAgICB0aGlzLnVpLnJldmVhbEVuZEdhbWVVSSh3aW5uZXIpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lSGFuZGxlciIsImNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9TaGlwXCIpO1xyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XHJcbiAgICAvL2tleSBmb3IgY29vcmRpbmF0ZSBjb252ZXJzaW9uLCBub3QgbmVlZGVkIGFueW1vcmVcclxuICAgIHRoaXMueENvb3JkaW5hdGVzID0gXCJBQkNERUZHSElKXCI7XHJcbiAgICB0aGlzLnlDb29yZGluYXRlcyA9IFwiMTIzNDU2Nzg5MTBcIjtcclxuICAgIHRoaXMuc2hpcHMgPSBbXTtcclxuICAgIHRoaXMubWlzc2VzID0gW107XHJcbiAgICB0aGlzLmhpdHMgPSBbXTtcclxuICAgIHRoaXMuaW5pdFNoaXBzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGUgYW5kIGFwcGVuZCB0aGUgNSBiYXR0bGVzaGlwIHNoaXAgdG8gdGhlIHNoaXBzIGFycmF5XHJcbiAgaW5pdFNoaXBzKCkge1xyXG4gICAgY29uc3QgY2FycmllciA9IG5ldyBTaGlwKDUpO1xyXG4gICAgY29uc3QgYmF0dGxlc2hpcCA9IG5ldyBTaGlwKDQpO1xyXG4gICAgY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoMyk7XHJcbiAgICBjb25zdCBzdWJtYXJpbmUgPSBuZXcgU2hpcCgzKTtcclxuICAgIGNvbnN0IHBhdHJvbEJvYXQgPSBuZXcgU2hpcCgyKTtcclxuXHJcbiAgICB0aGlzLnNoaXBzLnB1c2goY2FycmllciwgYmF0dGxlc2hpcCwgZGVzdHJveWVyLCBzdWJtYXJpbmUsIHBhdHJvbEJvYXQpO1xyXG4gIH1cclxuXHJcbiAgLy8gUGxhY2UgdGhlIDUgZGlmZmVyZW50IHNoaXBzIG9mIEJhdHRsZXNoaXAgcmFuZG9tbHkgYWNyb3NzIHRoZSBib2FyZFxyXG4gIGdlbmVyYXRlUmFuZG9tQm9hcmQoKSB7XHJcbiAgICAvLyBsb29wIHRocm91Z2ggZWFjaCBzaGlwIHRvIGdlbmVyYXRlIG5ldyBjb29yZGluYXRlcyBhbmQgb3JpZW50YXRpb24gdW50aWwgdmFsaWQgc2hpcHMgYXJlIHBsYWNlZFxyXG4gICAgdGhpcy5zaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRYID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcclxuICAgICAgICBpZiAodGhpcy5wbGFjZVNoaXAoW3N0YXJ0WCwgc3RhcnRZXSwgXCJcIiwgaXNWZXJ0aWNhbCwgc2hpcCkpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Qm9hcmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZDtcclxuICB9XHJcblxyXG4gIHBsYWNlU2hpcChbc3RhcnRYLCBzdGFydFldLCBsZW5ndGgsIGlzVmVydGljYWwgPSBmYWxzZSwgc2hpcCkge1xyXG4gICAgbGV0IGNyZWF0ZWRTaGlwO1xyXG5cclxuICAgIC8vIExvb3AgdW50aWwgdGhlIHNoaXAgaXMgcGxhY2VkIHN1Y2Nlc3NmdWxseVxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvb3JkaW5hdGVzICsgbGVuZ3RoIGFyZSB3aXRoaW4gdmFsaWQgYm91bmRzXHJcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkKFtzdGFydFgsIHN0YXJ0WV0sIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcCkpIHtcclxuICAgICAgICAvLyBJZiBub3QgdmFsaWQsIHJldHVybiBmYWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIG5ldyBzaGlwIG92ZXJsYXBzIHdpdGggYW55IGV4aXN0aW5nIHNoaXBcclxuICAgICAgaWYgKHRoaXMuY2hlY2tTaGlwQ29sbGlzaW9uKFtzdGFydFgsIHN0YXJ0WV0sIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcCkpIHtcclxuICAgICAgICAvLyBJZiB0aGVyZSdzIGEgY29sbGlzaW9uLCByZXR1cm4gZmFsc2UgYW5kIGxldCB0aGUgZXh0ZXJuYWwgZnVuY3Rpb24gaGFuZGxlIG5ldyBjb29yZGluYXRlc1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgbm8gY29sbGlzaW9uIGFuZCB0aGUgcGxhY2VtZW50IGlzIHZhbGlkLCBicmVhayBvdXQgb2YgdGhlIGxvb3BcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzaGlwIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdCBhbmQgYWRkIGl0IHRvIHRoZSBib2FyZCdzIHNoaXBzIGFycmF5XHJcbiAgICBpZiAoIXNoaXApIHtcclxuICAgICAgY3JlYXRlZFNoaXAgPSBuZXcgU2hpcChsZW5ndGgpO1xyXG4gICAgICB0aGlzLnNoaXBzLnB1c2goY3JlYXRlZFNoaXApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGVuZ3RoID0gc2hpcC5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvLyBQbGFjZSB0aGUgc2hpcCBvbiB0aGUgYm9hcmQgaG9yaXpvbnRhbGx5IG9yIHZlcnRpY2FsbHlcclxuICAgIGlmIChpc1ZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAvL2luY3JlbWVudCB0aGUgY29vcmRpbmF0ZSByZWxhdGVkIHRvIHktYXhpcyB0byBtYXJrIGNlbGxzIHZlcnRpY2FsbHkgdG8gbWFrZSB0aGUgc2hpcFxyXG4gICAgICBmb3IgKGxldCB5ID0gc3RhcnRZOyB5IDwgbGVuZ3RoICsgc3RhcnRZOyB5KyspIHtcclxuICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0WF1beV0gPSB7IG1hcmtlcjogXCJTXCIsIHNoaXA6IHNoaXAgfHwgY3JlYXRlZFNoaXAgfTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0WDsgeCA8IGxlbmd0aCArIHN0YXJ0WDsgeCsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFt4XVtzdGFydFldID0geyBtYXJrZXI6IFwiU1wiLCBzaGlwOiBzaGlwIHx8IGNyZWF0ZWRTaGlwIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSBzdWNjZXNzZnVsIHBsYWNlbWVudFxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICByZWNlaXZlSGl0KFt4LCB5XSkge1xyXG4gICAgLy9maW5kIGFuZCByZXR1cm4gc2hpcCBjbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvb3JkaW5hdGUsIG1hcmsgYXMgaGl0IG9uIGJvYXJkIGFuZCBzaGlwIGl0c2VsZiwgYW5kIGFkZCB0aGUgaGl0IHRvIGhpdHMgYXJyYXkgaWYgYSBzaGlwIGlzIHByZXNlbnRcclxuICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuYm9hcmRbeF1beV0gPSB7IG1hcmtlcjogXCJPXCIgfTtcclxuICAgICAgdGhpcy5taXNzZXMucHVzaChbeCwgeV0pO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiWFwiKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5ib2FyZFt4XVt5XS5tYXJrZXIgPT09IFwiU1wiKSB7XHJcbiAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLmdldFNoaXAoW3gsIHldKTtcclxuICAgICAgdGhpcy5ib2FyZFt4XVt5XSA9IHsgbWFya2VyOiBcIlhcIiB9O1xyXG4gICAgICB0aGlzLmhpdHMucHVzaChbeCwgeV0pO1xyXG4gICAgICBzaGlwLmhpdCgpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrSGl0KFt4LCB5XSkge1xyXG4gICAgaWYgKHRoaXMuYm9hcmRbeF1beV0ubWFya2VyID09PSBcIlhcIikgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjaGVja0Nvb3JkaW5hdGUoW3gsIHldKSB7XHJcbiAgICBjb25zdCBzaGlwID0gdGhpcy5nZXRTaGlwKFt4LCB5XSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWFya2VyOiB0aGlzLmJvYXJkW3hdW3ldLm1hcmtlcixcclxuICAgICAgc2hpcDogc2hpcCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gc2hpcCBjbGFzcyBpbiAuc2hpcCBwcm9wZXJ0eSBvZiBib2FyZCBzcXVhcmUgZm9yIGFjY2Vzc1xyXG4gIGdldFNoaXAoW3gsIHldKSB7XHJcbiAgICBpZiAodGhpcy5ib2FyZFt4XVt5XSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmRbeF1beV0uc2hpcDtcclxuICB9XHJcblxyXG4gIC8vY2hlY2sgdGhhdCB0aGUgc2hpcCB0byBiZSBwbGFjZWQgaXMgd2l0aGluIHRoZSBib2FyZCBhbmQgZml0cyBvbiB0aGUgYm9hcmQsIHJldHVybnMgdHJ1ZSBpZiB2YWxpZFxyXG4gIC8vdGhlIGJvYXJkIGlzIGEgc3RhbmRhcmQgMTB4MTAgYmF0dGxlc2hpcCBib2FyZCwgc28gY29vcmRpbmF0ZXMgbXVzdCBiZSBiZXR3ZWVuIEEtSiBhbmQgMS0xMCwgZXhhbXBsZSBib2FyZDpcclxuICAvLyAgIDEgIDIgIDMgIDQgIDUgIDYgIDcgIDggIDkgIDEwXHJcbiAgLy8gQSAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gQiAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gQyAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gRCAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gRSAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gRiAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gRyAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gSCAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gSSAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgLy8gSiAtICAtICAtICAtICAtICAtICAtICAtICAtICAtXHJcbiAgaXNWYWxpZChbeCwgeV0sIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcCkge1xyXG4gICAgaWYgKHNoaXApIGxlbmd0aCA9IHNoaXAubGVuZ3RoO1xyXG5cclxuICAgIGNvbnN0IHJlZ2V4ID0gL14oWzAtOV0pJC87IC8vIHVzZSB0aGlzIHRvIG1hdGNoIG51bWJlcnMgMCB0aHJvdWdoIDkgc2luY2UgY29udmVydGVkIGNvb3JkcyBhcmUgaW4gaW5kZXggZm9ybSBzbyAtMVxyXG5cclxuICAgIC8vY2hlY2sgaWYgY29udmVydGVkIGNvb3JkcyBmaXQgb24gMTB4MTAgYm9hcmRcclxuICAgIGlmIChyZWdleC50ZXN0KHgpICYmIHJlZ2V4LnRlc3QoeSkpIHtcclxuICAgICAgLy90aGVuIGNoZWNrIGlmIGl0IHdpbGwgZ28gb2ZmIGJvYXJkIGJvdW5kcyBieSBhZGRpbmcgdGhlIGxlbmd0aFxyXG4gICAgICBpZiAoaXNWZXJ0aWNhbCkge1xyXG4gICAgICAgIC8vbmVlZHMgdG8gYmUgMTAgc2luY2UgbGVuZ3RoIHN0YXJ0cyBhdCB0aGUgY29vcmRpbmF0ZSwgbm90IGFmdGVyIGV4OiBBOSgwLCA4KSB3aXRoIGxlbiAyIGNvdmVycyBib3RoIEE5IGFuZCBBMTBcclxuICAgICAgICBpZiAoeCArIGxlbmd0aCA+IDEwKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHkgKyBsZW5ndGggPiAxMCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7IC8vc2hpcCBmdWxmaWxscyBib3RoIGNvbmRpdGlvbnMsIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7IC8vc2hpcCBpcyBub3Qgd2l0aGluIHRoZSAxMHgxMCBib2FyZCAoZXg6IEExMSkgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayB0aGF0IHRoaXMgbmV3IHNoaXAgd2lsbCBub3Qgb3ZlcmxhcCB3aXRoIGFuIGV4aXN0aW5nIHNoaXAsIHJldHVybnMgdHJ1ZSBpZiBjb2xsaXNpb24gaXMgcHJlc2VudFxyXG4gIGNoZWNrU2hpcENvbGxpc2lvbihbc3RhcnRYLCBzdGFydFldLCBsZW5ndGgsIGlzVmVydGljYWwsIHNoaXApIHtcclxuICAgIGlmIChzaGlwKSBsZW5ndGggPSBzaGlwLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRYOyBpIDwgc3RhcnRYICsgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCB0aGUgY2VsbHMgdGhlIHNoaXAgd291bGQgYmUgcGxhY2VkIG9uLi4uXHJcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bc3RhcnRZXSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7IC8vaWYgdGhlIGNlbGwgaXMgbnVsbCwgdGhlbiBubyBzaGlwIGlzIHByZXNlbnQsIG5vIGNvbGxpc2lvblxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRZOyBpIDwgc3RhcnRZICsgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5ib2FyZFtzdGFydFhdW2ldICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9jb252ZXJ0cyB0aGlzLm1pc3NlcyBhcnJheSBpbnRvIG5ldyBhcnJheSBjb250YWluaW5nIG1pc3NlcyBpbiBsZXR0ZXItbnVtYmVyIGZvcm1hdCBleDogQjVcclxuICBnZXRNaXNzZXMoKSB7XHJcbiAgICBsZXQgY29udmVydGVkTWlzc2VzID0gW107XHJcbiAgICB0aGlzLm1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1pc3NJbmRleE9uZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBtaXNzWzBdKTsgLy9jb252ZXJ0IGZpcnN0IGluZGV4IG9mIG1pc3MgY29vcmRpbmF0ZSBiYWNrIGludG8gYSBsZXR0ZXJcclxuICAgICAgY29uc3QgbmV3TWlzcyA9IG1pc3NJbmRleE9uZSArIChtaXNzWzFdICsgMSk7IC8vIGNvbmNhdGVuYXRlIGNvbnZlcnRlZCBtaXNzIHRvIHJlbW92ZSBjb21tYSBhbmQgYWRkIG9uZSBiYWNrIHRvIHNlY29uZCBpbmRleCBleDogWzEsIDRdIC0+IFwiQiVcIlxyXG4gICAgICBjb252ZXJ0ZWRNaXNzZXMucHVzaChuZXdNaXNzKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNvbnZlcnRlZE1pc3NlcztcclxuICB9XHJcblxyXG4gIC8vd2hlbiBjYWxsZWQsIGNoZWNrcyBpZiBhbGwgc2hpcHMgaW4gdGhpcy5zaGlwcyBoYXZlIHNoaXAuc3VuayBlcXVhbCB0byB0cnVlXHJcbiAgYWxsU2hpcHNTdW5rKCkge1xyXG4gICAgaWYgKHRoaXMuc2hpcHMuc29tZSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSBmYWxzZSkpIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkOyIsImNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL0dhbWVib2FyZFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lYm9hcmQoKVxyXG4gICAgICAgIHRoaXMucGxheWVyVHlwZSA9IHBsYXllclR5cGVcclxuICAgIH1cclxuXHJcbiAgICAvL2Z1bmN0aW9ucyB0aGF0IHdpbGwgcnVuIHdpdGhvdXQgbmVlZGluZyB0byBjYWxsIHRoaXMuYm9hcmQgKGV4OiBwbGF5ZXIuYm9hcmQuZ2V0TWlzc2VzKCkgdnMgcGxheWVyLmdldE1pc3NlcygpKVxyXG4gICAgcmVjZWl2ZUhpdChbeCwgeV0pIHtcclxuICAgICAgICB0aGlzLmJvYXJkLnJlY2VpdmVIaXQoW3gsIHldKVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSGl0KGNvb3JkaW5hdGUpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmNoZWNrSGl0KGNvb3JkaW5hdGUpXHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VTaGlwKGNvb3JkaW5hdGUsIGxlbmd0aCA9ICcnLCBpc1ZlcnRpY2FsID0gZmFsc2UsIHNoaXAgPSAnJykge1xyXG4gICAgICAgIHRoaXMuYm9hcmQucGxhY2VTaGlwKGNvb3JkaW5hdGUsIGxlbmd0aCwgaXNWZXJ0aWNhbCwgc2hpcClcclxuICAgIH1cclxuXHJcbiAgICBnZXRNaXNzZXMoKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZC5nZXRNaXNzZXMoKVxyXG4gICAgfVxyXG5cclxuICAgIGFsbFNoaXBzU3VuaygpIHtcclxuICAgICAgICB0aGlzLmJvYXJkLmFsbFNoaXBzU3VuaygpXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyIsIlxyXG4vL3NldCB1cCBpbml0aWFsIFVzZXIgSW50ZXJmYWNlIERPTSBlbGVtZW50cyBzbyBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIHRvIHRoZW1cclxuY2xhc3MgU2NyZWVuQ29udHJvbGxlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnBsYWNlbWVudERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1jb250YWluZXJcIilcclxuICAgIHRoaXMudmVydGljYWxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnZlcnRpY2FsLWJ1dHRvblwiKVxyXG4gICAgdGhpcy5lbmRTY3JlZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbm5lci1jb250YWluZXJcIik7XHJcbiAgICB0aGlzLnR1cm5EaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50dXJuLWNvbnRhaW5lclwiKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVBsYXllckJvYXJkKHBsYXllcikge1xyXG4gICAgY29uc3QgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2FyZC1vbmVcIik7XHJcblxyXG4gICAgd2hpbGUgKGJvYXJkRGlzcGxheS5sYXN0Q2hpbGQpXHJcbiAgICAgIGJvYXJkRGlzcGxheS5yZW1vdmVDaGlsZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuXHJcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBwbGF5ZXIuYm9hcmQuYm9hcmQ7XHJcblxyXG4gICAgdGhpcy5nZW5lcmF0ZUJvYXJkKGdhbWVCb2FyZCwgYm9hcmREaXNwbGF5LCBwbGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29tcHV0ZXJCb2FyZChjcHUpIHtcclxuICAgIGNvbnN0IGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9hcmQtdHdvXCIpO1xyXG5cclxuICAgIHdoaWxlIChib2FyZERpc3BsYXkubGFzdENoaWxkKVxyXG4gICAgICBib2FyZERpc3BsYXkucmVtb3ZlQ2hpbGQoYm9hcmREaXNwbGF5Lmxhc3RDaGlsZCk7XHJcblxyXG4gICAgY29uc3QgZ2FtZUJvYXJkID0gY3B1LmJvYXJkLmJvYXJkO1xyXG5cclxuICAgIHRoaXMuZ2VuZXJhdGVCb2FyZChnYW1lQm9hcmQsIGJvYXJkRGlzcGxheSwgY3B1KTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlQm9hcmQoYm9hcmQsIGJvYXJkRGlzcGxheSwgcGxheWVyKSB7XHJcbiAgICAvL2NvdW50ZXIgZm9yIHggY29vcmRpbmF0ZVxyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgYm9hcmQuZm9yRWFjaCgoYXJyYXkpID0+IHtcclxuICAgICAgLy9jb3VudGVyIGZvciB5IGNvb3JkaW5hdGUsIHJlc2V0cyBmb3IgZXZlcnkgcm93IGJ5IGluaXRpYWxpemluZyBhIG5ldyBvbmUgZm9yIGVhY2ggcm93XHJcbiAgICAgIGxldCBqID0gMDtcclxuICAgICAgYXJyYXkuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGdyaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYm94XCIpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIucGxheWVyVHlwZSA9PT0gJ0NQVScpIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2JveC1ob3ZlcicpXHJcbiAgICAgICAgaWYgKGNlbGwpIHtcclxuICAgICAgICAgIGlmIChjZWxsLm1hcmtlciA9PT0gXCJTXCIpIHtcclxuICAgICAgICAgICAgLy8gT25seSBhZGRzIHNoaXAgY2xhc3MgdG8gcGxheWVyJ3MgYm9hcmQgdG8ga2VlcCBjb21wdXRlcnMgYm9hcmQgaGlkZGVuIHRvIHRoZSBwbGF5ZXJcclxuICAgICAgICAgICAgaWYgKHBsYXllci5wbGF5ZXJUeXBlID09PSBcIlBsYXllclwiKVxyXG4gICAgICAgICAgICAgIGdyaWRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGNlbGwubWFya2VyID09PSBcIk9cIikgZ3JpZEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgICAgICBpZiAoY2VsbC5tYXJrZXIgPT09IFwiWFwiKSBncmlkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgZ3JpZEVsZW1lbnQuZGF0YXNldC5tYXJrZXIgPSBjZWxsLm1hcmtlcjsgLy9uZWVkcyB0byBiZSBoZXJlIHNpbmNlIGluIGVycm9yIHdpbGwgb2NjdXIgaWYgbnVsbCBpcyByZWFkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc2F2ZSBkYXRhIG5lZWRlZCBmb3IgcnVubmluZyBtZXRob2RzIGhlcmUgaW4gdGhlIERPTSBlbGVtZW50IGZvciBlYXN5IGFjY2VzcyBsYXRlclxyXG4gICAgICAgIGdyaWRFbGVtZW50LmRhdGFzZXQueCA9IGk7IC8vc2F2ZSBjZWxsIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgZ3JpZEVsZW1lbnQuZGF0YXNldC55ID0gajtcclxuICAgICAgICBncmlkRWxlbWVudC5kYXRhc2V0LnBsYXllciA9IHBsYXllci5wbGF5ZXJUeXBlOyAvL3RlbGxzIHdoYXQgcGxheWVyIHRoZSBjZWxsIGJlbG9uZ3MgdG9cclxuICAgICAgICBib2FyZERpc3BsYXkuYXBwZW5kQ2hpbGQoZ3JpZEVsZW1lbnQpO1xyXG4gICAgICAgIGorKzsgLy9pbmNyZW1lbnRzIGFmdGVyIGVhY2ggaW5kaXZpZHVhbCBjZWxsIGlzIGNyZWF0ZWQgYW5kIGFkZGVkXHJcbiAgICAgIH0pO1xyXG4gICAgICBpKys7IC8vaW5jcmVtZW50cyBhZnRlciBlYWNoIHJvdyBpcyBjb21wbGV0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL3JlbW92ZSBjc3MgZnJvbSBhbGwgY2VsbHMgdGhhdCBoYXZlIGhhZCB0aGVtIGFkZGVkIGFmdGVyIG1vdXNlIGxlYXZlcyB0aGUgY2VsbFxyXG4gIGNsZWFyU2hpcFByZXZpZXcoKSB7XHJcbiAgICBjb25zdCBoaWdobGlnaHRlZENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52YWxpZCwgLmludmFsaWRcIik7XHJcbiAgICBoaWdobGlnaHRlZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwidmFsaWRcIiwgXCJpbnZhbGlkXCIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyB0ZWxscyB0aGUgcGxheWVyIHdoYXQgc2hpcCB0aGV5IHdpbGwgYmUgcGxhY2luZyB0aHJvdWdoIHRleHQgYmFzZWQgb24gdGhlIHNoaXBzIGFycmF5IGluZGV4XHJcbiAgdXBkYXRlUGxhY2VtZW50RGlzcGxheShzaGlwSW5kZXgpIHtcclxuICAgIGlmICh0aGlzLnBsYWNlbWVudERpc3BsYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkgLy9lbnN1cmVzIHNoaXAgcGFsY2VtZW50IFVJIGFwcGVhcnMgYWZ0ZXIgcmVzZXRcclxuICAgICAgdGhpcy5wbGFjZW1lbnREaXNwbGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbiAgICAgIHRoaXMudmVydGljYWxCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgIHN3aXRjaCAoc2hpcEluZGV4KSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICB0aGlzLnBsYWNlbWVudERpc3BsYXkudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciBDYXJyaWVyYDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHRoaXMucGxhY2VtZW50RGlzcGxheS50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyIEJhdHRsZXNoaXBgO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdGhpcy5wbGFjZW1lbnREaXNwbGF5LnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgRGVzdHJveWVyYDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHRoaXMucGxhY2VtZW50RGlzcGxheS50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyIFN1Ym1hcmluZWA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDpcclxuICAgICAgICB0aGlzLnBsYWNlbWVudERpc3BsYXkudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciBQYXRyb2wgQm9hdGA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIC8vaGlkZXMgdGhlIHBsYWNlbWVudCByZWxhdGVkIFVJLCB1c2VkIHdoZW4gcGxhY2VtbmV0IGlzIGRvbmVcclxuICBoaWRlUGxhY2VtZW50RGlzcGxheSgpIHtcclxuICAgIHRoaXMucGxhY2VtZW50RGlzcGxheS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gICAgdGhpcy52ZXJ0aWNhbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVHVybkRpc3BsYXkoYWN0aXZlUGxheWVyKSB7XHJcbiAgICBpZiAoYWN0aXZlUGxheWVyLnBsYXllclR5cGUgPT09IFwiQ1BVXCIpXHJcbiAgICAgIHJldHVybiAodGhpcy50dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IGBDb21wdXRlciBhdHRhY2tpbmcuLi5gKTtcclxuICAgIHRoaXMudHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBgSXQncyB0aGUgJHthY3RpdmVQbGF5ZXIucGxheWVyVHlwZX0ncyB0dXJuYDtcclxuICB9XHJcblxyXG4gIHJldmVhbEVuZEdhbWVVSSh3aW5uZXIpIHtcclxuICAgIHRoaXMuZW5kU2NyZWVuLnRleHRDb250ZW50ID0gYFRoZSAke3dpbm5lcn0gd2lucyFgO1xyXG4gICAgdGhpcy5lbmRTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuQ29udHJvbGxlcjsiLCJjbGFzcyBTaGlwIHtcclxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgdGhpcy5oaXRzID0gMDtcclxuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaGl0KCkge1xyXG4gICAgaWYgKHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGgpIHJldHVybjtcclxuICAgIHRoaXMuaGl0cyA9IHRoaXMuaGl0cyArPSAxO1xyXG4gICAgdGhpcy5pc1N1bmsoKVxyXG4gIH1cclxuXHJcbiAgaXNTdW5rKCkge1xyXG4gICAgdGhpcy5zdW5rID0gdGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hpcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lSGFuZGxlciA9IHJlcXVpcmUoXCIuL21vZHVsZXMvR2FtZUhhbmRsZXIuanNcIik7XHJcblxyXG5jb25zdCBnYW1lSGFuZGxlciA9IG5ldyBHYW1lSGFuZGxlcigpXHJcbmdhbWVIYW5kbGVyLnN0YXJ0R2FtZSgpIC8vdGhpcyBmdW5jIGlzIGFsbCB0aGF0cyBuZWVkcyB0byBiZSBjYWxsZWQgdG8gcnVuIHRoZSBnYW1lICBcclxuXHJcbiJdLCJuYW1lcyI6WyJVSSIsInJlcXVpcmUiLCJTaGlwIiwiUGxheWVyIiwiR2FtZUhhbmRsZXIiLCJjb25zdHJ1Y3RvciIsInVpIiwicGxheWVyIiwiY29tcHV0ZXIiLCJjdXJyZW50U2hpcEluZGV4IiwiaXNWZXJ0aWNhbCIsImFjdGl2ZVBsYXllciIsImluYWN0aXZlUGxheWVyIiwic3RhcnRHYW1lIiwiYm9hcmQiLCJnZW5lcmF0ZVJhbmRvbUJvYXJkIiwiY3JlYXRlUGxheWVyQm9hcmQiLCJjcmVhdGVDb21wdXRlckJvYXJkIiwidXBkYXRlUGxhY2VtZW50RGlzcGxheSIsInVwZGF0ZVR1cm5EaXNwbGF5IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlc2V0R2FtZSIsImFkZFNoaXBQbGFjZW1lbnRMaXN0ZW5lcnMiLCJhZGRSZXNldExpc3RlbmVyIiwiYWRkT3JpZW50YXRpb25MaXN0ZW5lciIsInVwZGF0ZUJvYXJkcyIsInBsYXllckJvYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInBsYWNlbWVudEhhbmRsZXIiLCJyZW1vdmVQcmV2aWV3IiwicGxhY2VTaGlwSGFuZGxlciIsImFkZEJvYXJkTGlzdGVuZXJzIiwiY29tcHV0ZXJCb2FyZCIsImF0dGFja0hhbmRsZXIiLCJyZXNldCIsInZlcnRpY2FsQnV0dG9uIiwiY2hhbmdlVmVydGljYWwiLCJ0dXJuRGlzcGxheSIsImNsYXNzTGlzdCIsImFkZCIsImVuZFNjcmVlbiIsImUiLCJ4IiwiTnVtYmVyIiwidGFyZ2V0IiwiZGF0YXNldCIsInkiLCJjb29yZGluYXRlIiwic2hpcCIsInNoaXBzIiwidmFsaWRQbGFjZW1lbnQiLCJzaGlwSG92ZXJIYW5kbGVyIiwiaGlnaGxpZ2h0UGxhY2VtZW50IiwibGVuZ3RoIiwic3RhdHVzIiwiaSIsImNlbGwiLCJyZW1vdmUiLCJjbGVhclNoaXBQcmV2aWV3IiwidW5kZWZpbmVkIiwidmFsdWUiLCJpbmNsdWRlcyIsInZhbGlkIiwiaXNWYWxpZCIsImNoZWNrU2hpcENvbGxpc2lvbiIsInBsYWNlU2hpcCIsImhpZGVQbGFjZW1lbnREaXNwbGF5IiwicmVtb3ZlUGxhY2VtZW50TGlzdGVuZXJzIiwicGxheWVyVHlwZSIsImNvbnNvbGUiLCJsb2ciLCJtYXJrZXIiLCJyZWNlaXZlSGl0IiwiYWxsU2hpcHNTdW5rIiwid2lubmVyIiwiZW5kR2FtZSIsInN3aXRjaFR1cm5zIiwic2V0VGltZW91dCIsImNvbXB1dGVyQXR0YWNrIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicmV2ZWFsRW5kR2FtZVVJIiwibW9kdWxlIiwiZXhwb3J0cyIsIkdhbWVib2FyZCIsIkFycmF5IiwiZnJvbSIsImZpbGwiLCJ4Q29vcmRpbmF0ZXMiLCJ5Q29vcmRpbmF0ZXMiLCJtaXNzZXMiLCJoaXRzIiwiaW5pdFNoaXBzIiwiY2FycmllciIsImJhdHRsZXNoaXAiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJwYXRyb2xCb2F0IiwicHVzaCIsImZvckVhY2giLCJzdGFydFgiLCJzdGFydFkiLCJnZXRCb2FyZCIsImNyZWF0ZWRTaGlwIiwiZ2V0U2hpcCIsImhpdCIsImNoZWNrSGl0IiwiY2hlY2tDb29yZGluYXRlIiwicmVnZXgiLCJ0ZXN0IiwiZ2V0TWlzc2VzIiwiY29udmVydGVkTWlzc2VzIiwibWlzcyIsIm1pc3NJbmRleE9uZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsIm5ld01pc3MiLCJzb21lIiwic3VuayIsIlNjcmVlbkNvbnRyb2xsZXIiLCJwbGFjZW1lbnREaXNwbGF5IiwiYm9hcmREaXNwbGF5IiwibGFzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJnYW1lQm9hcmQiLCJnZW5lcmF0ZUJvYXJkIiwiY3B1IiwiYXJyYXkiLCJqIiwiZ3JpZEVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJoaWdobGlnaHRlZENlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsInNoaXBJbmRleCIsImNvbnRhaW5zIiwidGV4dENvbnRlbnQiLCJpc1N1bmsiLCJnYW1lSGFuZGxlciJdLCJzb3VyY2VSb290IjoiIn0=