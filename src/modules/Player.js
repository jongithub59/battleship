const Gameboard = require("./Gameboard");

class Player {
    constructor(playerType) {
        this.board = new Gameboard()
        this.playerType = playerType
    }

}

module.exports = Player;