const Gameboard = require("./Gameboard");
const Ship = require("./Ship");
const Player = require("./Player");

//set up initial User Interface DOM elements so event listeners can be added to them

class ScreenController {
    setupGame() {
        const reset = document.querySelector(".reset-button") 
        const gameContainer = document.querySelector(".game-container");
        const boardContainer = document.querySelector(".board-container")
    }

    createPlayerBoard(player) {
        const boardDisplay = document.querySelector("#board-one")

        while (boardDisplay.lastChild)  boardDisplay.removeChild(boardDisplay.lastChild);

        const gameBoard = player.board.board

        this.generateBoard(gameBoard, boardDisplay);
    }

    createComputerBoard(cpu) {
        const boardDisplay = document.querySelector("#board-two");

        while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);

        const gameBoard = cpu.board.board;

        this.generateBoard(gameBoard, boardDisplay)
    }

    generateBoard(board, boardDisplay) {
      //counter vars for making coordinates in each cell to access for oher methods
      let i = 0
      board.forEach((array) => {
          let j = 0
          array.forEach((cell) => {
            const gridElement = document.createElement("div");
            gridElement.classList.add("box");
            if (cell) {
              if (cell.marker === "S") gridElement.classList.add("ship");
              if (cell.marker === "O") gridElement.classList.add("miss");
              if (cell.marker === "X") gridElement.classList.add("hit");
            }
            gridElement.dataset.x = i
            gridElement.dataset.y = j
            boardDisplay.appendChild(gridElement);
            j++
          });
          i++
        });
    }

    revealEndGameUI(winner) {
        
    }
}

module.exports = ScreenController;