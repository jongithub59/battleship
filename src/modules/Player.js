const Gameboard = require("./Gameboard");

class Player {
    constructor(playerType) {
        this.board = new Gameboard()
        this.playerType = playerType
    }

    //functions that will run without needing to call this.board (ex: player.board.getMisses() vs player.getMisses())
    receiveHit(coordinate) {
        this.board.receiveHit(coordinate)
    }

    checkHit(coordinate) {
        this.board.checkHit(coordinate)
    }

    placeShip(startCoordinate, length = '', isVertical = false, ship = '') {
        this.board.placeShip(startCoordinate, length, isVertical, ship)
    }

    getMisses() {
        this.board.getMisses()
    }

    allShipsSunk() {
        this.board.allShipsSunk()
    }
}

module.exports = Player;