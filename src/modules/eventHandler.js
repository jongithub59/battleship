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

      //need funcs for adding eventlisteners to run the other funcs that run the game here, meaning startGame() is the only func that needs to run
   }

   updateBoards() {// this will update the boards at anytime with their new inputs
      this.ui.createPlayerBoard(this.player);
      this.ui.createComputerBoard(this.computer);
   }

   //funcs for running the game off event listeners here
}

module.exports = EventHandler