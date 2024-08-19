
//set up initial User Interface DOM elements so event listeners can be added to them
class ScreenController {
    constructor () {
      this.endScreen = document.querySelector(".winner-container"); 
    }

    createPlayerBoard(player) {
        const boardDisplay = document.querySelector("#board-one")

        while (boardDisplay.lastChild)  boardDisplay.removeChild(boardDisplay.lastChild);

        const gameBoard = player.board.board

        this.generateBoard(gameBoard, boardDisplay, player);
    }

    createComputerBoard(cpu) {
        const boardDisplay = document.querySelector("#board-two");

        while (boardDisplay.lastChild) boardDisplay.removeChild(boardDisplay.lastChild);

        const gameBoard = cpu.board.board;

        this.generateBoard(gameBoard, boardDisplay, cpu)
    }

    generateBoard(board, boardDisplay, player) {
      //counter for x coordinate
      let i = 0
      board.forEach((array) => {
        //counter for y coordinate, resets for every row by initializing a new one for each row
        let j = 0;
        array.forEach((cell) => {
          const gridElement = document.createElement("div");
          gridElement.classList.add("box");
          if (cell) {
            if (cell.marker === "S") {
              // Only adds ship class to player's board to keep computers board hidden to the player
              if (player.playerType === 'Player')gridElement.classList.add("ship");
            }
            if (cell.marker === "O") gridElement.classList.add("miss");
            if (cell.marker === "X") gridElement.classList.add("hit");
            gridElement.dataset.marker = cell.marker //needs to be here since in error will occur if null is read
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

    revealEndGameUI(winner) {
      this.endScreen.textContent = `The ${winner} wins!`
      this.endScreen.classList.remove('hidden')
    }
}

module.exports = ScreenController;