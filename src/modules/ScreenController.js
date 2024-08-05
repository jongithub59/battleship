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

        while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);

        const gameBoard = player.board.board

        gameBoard.forEach((array) => {
            array.forEach(() =>{
                const gridElement = document.createElement('div')
                gridElement.classList.add('box')
                boardDisplay.appendChild(gridElement)
            })
        });

        return gameBoard
        
    }

    createComputerBoard() {

    }

    playRound() {

    }

    endGame(winner) {

    }
}

module.exports = ScreenController;