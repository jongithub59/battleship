const UI = require("./ScreenController");
const Ship = require("./Ship")
const Player = require("./Player");
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
    this.player.board.generateRandomBoard()
    this.computer.board.generateRandomBoard();
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);

    document
      .querySelector(".reset-button")
      .removeEventListener("click", this.resetGame);
    this.addBoardListeners();
    this.addResetListener();
  }

  updateBoards() {
    // this will update the boards at anytime with their new inputs
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
  }

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
    document
      .querySelector("#board-one")
      .removeEventListener("click", this.clickHandler);
    document
      .querySelector("#board-two")
      .removeEventListener("click", this.clickHandler);
    this.player = new Player("human");
    this.computer = new Player("cpu");
    this.activePlayer = this.player;
    this.inactivePlayer = this.computer;
    this.startGame();
  };

  attackHandler = (e) => {
    if (!e.target.classList.value.includes("box")) return; //return if a valid cell is not clicked
    if (e.target.dataset.player === this.activePlayer.playerType) return; //return if a player clicks on their own board
    // use stored data to make a usable coordinate for receiveHit() and identify valid hit locations
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    const marker = e.target.dataset.marker;
    if (marker === "X" || marker === "O") return; //if a hit location is clicked, return to allow new attempt
    const coordinate = [Number(x), Number(y)]; //create the coordinate, forcing them to be numbers
    this.inactivePlayer.board.receiveHit(coordinate);
    this.switchTurns();
    this.computerAttack()
    this.updateBoards();
  };

  // run a random computer attack after the player's turn
  computerAttack() {
    if (this.activePlayer.playerType === 'cpu') {
     while (true) {
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10);
      console.log([x, y])
      //loop until the computer successfully lands a hit, to make sure attacks aren't wasted on already hit boxes  
      if (this.player.board.receiveHit([x, y]) === true) {
        break
      }
    }
    this.switchTurns()
    return true
  }
  }

  // advance to the next turn by swapping the active player
  switchTurns() {
    if (this.activePlayer.playerType === "human") {
      this.activePlayer = this.computer;
      this.inactivePlayer = this.player;
    } else {
      this.activePlayer = this.player;
      this.inactivePlayer = this.computer;
    }
  }
}

module.exports = EventHandler