const Ship = require("./Ship");

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill({}));
    this.xCoordinates = "ABCDEFGHIJ";
    this.yCoordinates = "12345678910";
    this.ships = [];
    this.misses = [];
    this.hits = [];
  }

  convertCoordinate(coordinate) {
    const xCoordinate = coordinate[0];
    const yCoordinate = coordinate.slice(1);
    const xIndex = this.xCoordinates.indexOf(xCoordinate);
    const yIndex = parseInt(yCoordinate, 10) - 1;
    return [xIndex, yIndex];
  }

  receiveHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);

    if (this.board[x][y].marker === "s") {
      this.board[x][y].marker = "X";
      this.hits.push([x, y]);
      ship.hit();
    } else {
      this.board[x][y].marker = "O";
      this.misses.push([x, y]);
    }
  }

  isValid(coordinate) {
      const x = coordinate[0];
      const y = coordinate.slice(1);
  
      const regex = /^[A-J]+$/;
      const regex2 = /^([1-9]|10)$/;
  
      if (regex.test(x) && regex2.test(y)) return true;
      return false;
    }

}


module.exports = Gameboard;