const UI = require("./ScreenController");
const Player = require("./Player");
//Use UI elements from ScreenController to add event listeners using UI loading funcs

class EventHandler {
   constructor() {
      this.ui = new UI()
      this.player = new Player("human");
      this.computer = new Player("cpu");
      this.currentPlayer = this.player // the player who is the "active player"
    }
   startGame() { //run setup funcs from ScreenController.js here since index.js will only import this file
      this.ui.setupGame()
      this.ui.createPlayerBoard(this.player)
      this.ui.createComputerBoard(this.computer)

      document.querySelector('.reset-button').removeEventListener('click', this.resetGame)
      this.addBoardListeners()
      this.addResetListener()
   }

   updateBoards() {// this will update the boards at anytime with their new inputs
      this.ui.createPlayerBoard(this.player);
      this.ui.createComputerBoard(this.computer);
   }

   //funcs for running the game off event listeners here
   addBoardListeners() {
      const playerBoard = document.querySelector('#board-one')
      const computerBoard = document.querySelector("#board-two");

      playerBoard.addEventListener('click', this.clickHandler)
      computerBoard.addEventListener('click', this.clickHandler)
   }

   addResetListener() {
      const reset = document.querySelector('.reset-button')
      reset.addEventListener('click', this.resetGame)
   }

   resetGame = () => {
      document.querySelector("#board-one").removeEventListener("click", this.clickHandler);
      document.querySelector("#board-two").removeEventListener("click", this.clickHandler);
      this.player = new Player("human");
      this.computer = new Player("cpu");
      this.currentPlayer = this.player;
      this.startGame()
   }

   clickHandler(e) {
      const clickedCell = e.target
      return console.log(clickedCell)
   }
}

module.exports = EventHandler