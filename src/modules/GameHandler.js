const UI = require("./ScreenController");
const Ship = require("./Ship")
const Player = require("./Player");
//Use UI elements from ScreenController to add event listeners using UI loading funcs

class EventHandler {
  constructor() {
    this.ui = new UI();
    this.player = new Player("Player");
    this.computer = new Player("CPU");
    this.activePlayer = this.player; // the player whose turn it is, making their move
    this.inactivePlayer = this.computer; //player who is having a move made on them
  }
  startGame() {
    //run setup funcs from ScreenController.js here since index.js will only import this file
    this.player.board.generateRandomBoard();
    this.computer.board.generateRandomBoard();
    this.ui.createPlayerBoard(this.player);
    this.ui.createComputerBoard(this.computer);
    this.ui.updateTurnDisplay(this.activePlayer);

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
      .removeEventListener("click", this.attackHandler);
    document
      .querySelector("#board-two")
      .removeEventListener("click", this.attackHandler);
    this.player = new Player("Player");
    this.computer = new Player("CPU");
    this.activePlayer = this.player;
    this.inactivePlayer = this.computer;
    this.ui.endScreen.classList.add('hidden') //hide the endgame UI
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
    //if allShipsSunk() returns true then the active player wins so begin the endgame funcs
    if(this.inactivePlayer.board.allShipsSunk()) {
      const winner = this.activePlayer.playerType
      this.endGame(winner)
      return
    }
    this.updateBoards()
    this.switchTurns();
    //add a short delay before the computer attacks so it looks like the computing is thinking
    setTimeout(() => {
      this.computerAttack();
    }, 1000);
  };

  // run a random computer attack after the player's turn
  computerAttack() {
    if (this.activePlayer.playerType === 'CPU') {
     while (true) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      console.log([x, y])
      //loop until the computer successfully lands a hit, to make sure attacks aren't wasted on already hit boxes  
      if (this.player.board.receiveHit([x, y]) === true) {
        break
      }
    }
    if (this.player.board.allShipsSunk()) {
      const winner = this.computer.playerType;
      this.endGame(winner);
      return;
    }
    this.updateBoards()
    this.switchTurns()
    return true
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
    this.updateBoards()
    document
      .querySelector("#board-one")
      .removeEventListener("click", this.attackHandler);
    document
      .querySelector("#board-two")
      .removeEventListener("click", this.attackHandler);
    console.log(winner);
    // send the winner to end game ui handler to display the winner in the UI
    this.ui.revealEndGameUI(winner)
  }
}

module.exports = EventHandler