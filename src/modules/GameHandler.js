const UI = require("./ScreenController");
const Ship = require("./Ship")
const Player = require("./Player");
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
    // this.player.board.generateRandomBoard();
    this.computer.board.generateRandomBoard();
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
    this.ui.updateTurnDisplay(this.activePlayer);

    document
      .querySelector(".reset-button")
      .removeEventListener("click", this.resetGame);
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
  addBoardListeners(){
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
    document
      .querySelector("#board-one")
      .removeEventListener("click", this.attackHandler);
    document
      .querySelector("#board-two")
      .removeEventListener("click", this.attackHandler);
    document.removeEventListener('keydown', this.changeVertical) //remove orientation changing event listener on reset to prevent weird behavior
    this.player = new Player("Player");
    this.computer = new Player("CPU");
    this.activePlayer = this.player;
    this.inactivePlayer = this.computer;
    this.currentShipIndex = 0
    this.isVertical = false
    this.ui.endScreen.classList.add("hidden"); //hide the endgame UI
    this.startGame();
  };

  //adds listener to allow ship orientation to be changed
  addOrientationListener() {
    document.addEventListener("keydown", this.changeVertical);
  }


  changeVertical = (e) => {
    if (e.key === "r") {
      this.isVertical = !this.isVertical;
    }
  }

  //collect needed info from DOM board datasets and run preview funcs with that info
  placementHandler = (e) => {
    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const coordinate = [x, y];
    const ship = this.player.board.ships[this.currentShipIndex]; // Select the correct ship based on the current placement sequence
    const isVertical = this.isVertical; // Or true, depending on your orientation handling

    // Determine if the ship can be placed on coordinate to display proper color
    const validPlacement = this.shipHoverHandler(
      e.target,
      coordinate,
      ship,
      isVertical
    );

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
    if (cell === undefined || !cell.classList.value.includes("box"))
      return false;

    let valid = true;

    // Check bounds for horizontal and vertical placement, return false if out of bounds
    if(!this.player.board.isValid(coordinate, ship.length, isVertical)) return valid = false

    // Check for collisions with existing ships
    if (this.player.board.checkShipCollision(coordinate, ship.length, isVertical)) return valid = false
    return valid //passed checks returns true
  }

  //places ships on mouse click on board cell, will also do checks as hover previews are done separate
  placeShipHandler = (e) => {
    if (e.target === undefined || !e.target.classList.value.includes("box"))
      return false;

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const ship = this.player.board.ships[this.currentShipIndex];
    if (!ship) return;

    if (this.player.board.placeShip([x, y], "", this.isVertical, ship)) { //executes folloing code if placement is successful
      this.ui.createPlayerBoard(this.player); // Refresh the board to show the placed ship
        this.currentShipIndex++; // increment so next ship to be placed will be the next ship in ship array
        if (this.currentShipIndex === this.player.board.ships.length) { //prevent placement by removeing listener when 5 placements are done
          this.removePlacementListeners();
          this.addBoardListeners() //add board listeners now that player ships have been placed
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

  attackHandler = (e) => {
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
    document
      .querySelector("#board-one")
      .removeEventListener("click", this.attackHandler);
    document
      .querySelector("#board-two")
      .removeEventListener("click", this.attackHandler);
    console.log(winner);
    // send the winner to end game ui handler to display the winner in the UI
    this.ui.revealEndGameUI(winner);
  }
}

module.exports = GameHandler