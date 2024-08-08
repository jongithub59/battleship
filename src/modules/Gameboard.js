const Ship = require("./Ship");

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    //key for coordinate conversion
    this.xCoordinates = "ABCDEFGHIJ";
    this.yCoordinates = "12345678910";
    this.ships = [];
    this.misses = [];
    this.hits = [];
  }

  // convert taken coordinate (B4) into indexs that the 2D board array can use ([1, 3])
  convertCoordinate(coordinate) {
    //split coordinate in two
    const xCoordinate = coordinate[0];
    const yCoordinate = coordinate.slice(1);
    //convert each index to respective array index
    const xIndex = this.xCoordinates.indexOf(xCoordinate);
    const yIndex = parseInt(yCoordinate, 10) - 1;
    return [xIndex, yIndex];
  }

  getBoard() {
    return this.board
  }

  placeShip(startCoordinate, length = '', isVertical = false, ship = '') {
    let createdShip;

    if (!this.isValid(startCoordinate, length)) {
      return false;
    }

    // //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);

    
    //crate ship class if one doesn;t exist and add ship to the board's ships array to access later
    if (!ship) {
      createdShip = new Ship(length); //create ship object and add it to ships array
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
      length = ship.length
    }
    
    // Place ship on board
    if (isVertical === false) {
      for (let y = startY; y <= (length + startY) -1; y++) {
        this.board[startX][y] = { marker: "S", ship: ship || createdShip };
      }
    }

    if (isVertical === true) {
      for (let x = startX; x <= (length + startX) - 1; x++) {
        this.board[x][startY] = { marker: "S", ship: ship || createdShip };
      }
    }

  }

  receiveHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);

    //find and return ship class associated with the coordinate, mark as hit on board and ship itself, and add the hit to hits array if a ship is present
    if (this.board[x][y] && this.board[x][y].marker === "S") {
      const ship = this.getShip(coordinate);
      this.board[x][y].marker = "X";
      this.hits.push([x, y]);
      ship.hit();
    } else if (this.board[x][y] && this.board[x][y].marker === "X") {
      return;
    } else {
      this.board[x][y] = { marker: "O" };
      this.misses.push([x, y]);
    }
  }

  checkHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);

    if (this.board[x][y].marker === "X") return true;
    return false;
  }

  checkCoordinate(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);
    const ship = this.getShip(coordinate)

    return {
      marker: this.board[x][y].marker,
      ship: ship,
    };
  }

  // return ship class in .ship property of board square for access
  getShip(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate)
    return this.board[x][y].ship;
  }

  isValid(coordinate, length) {
    //convert coordinate
    const [x, y] = this.convertCoordinate(coordinate);

    const regex = /^([0-9])$/; // use this to match numbers 0 through 9 since converted coords are in index form so -1

    //tests coordinates
    if (regex.test(x) && regex.test(y)) { //check if converted coords fit on 10x10 board
      if (y + length >= 10 || x + length >= 10) return false; //then check if it will go off board bounds by adding the length
      return true
    }
    return false;
  }

  //converts this.misses array into new array containing misses in letter-number format ex: B5
  getMisses() {
    let convertedMisses = [];
    this.misses.forEach((miss) => {
      const missIndexOne = String.fromCharCode(65 + miss[0]); //convert first index of miss coordinate back into a letter
      const newMiss = missIndexOne + (miss[1] + 1); // concatenate converted miss to remove comma and add one back to second index ex: [1, 4] -> "B%"
      convertedMisses.push(newMiss);
    });
    return convertedMisses;
  }

  //when called, checks if all ships in this.ships have ship.sunk equal to true
  allShipsSunk() {
    if (this.ships.some((ship) => ship.sunk === false)) return this.ships;
    return true;
  }
}


module.exports = Gameboard;