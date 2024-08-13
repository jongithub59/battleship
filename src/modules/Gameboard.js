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
    return this.board;
  }

  placeShip(startCoordinate, length = "", isVertical = false, ship = "") {
    let createdShip;

    if (!this.isValid(startCoordinate, length)) {
      return false;
    }

    // //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);

    //check that the ship to be placed does not overlap with an existing ship
    const shipCollision = this.checkShipCollision(
      startX,
      startY,
      length,
      isVertical,
      ship
    );

    //if a the new ship does overlap, return false
    if (shipCollision === true) {
      return false;
    }

    //crate ship class if one doesn;t exist and add ship to the board's ships array to access later
    if (!ship) {
      createdShip = new Ship(length); //create ship object and add it to ships array
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
      length = ship.length;
    }

    // Place ship on board
    if (isVertical === false) {
      for (let y = startY; y <= length + startY - 1; y++) {
        this.board[startX][y] = {};
        this.board[startX][y].marker = "S";
        this.board[startX][y].ship = ship || createdShip;
      }
    }

    if (isVertical === true) {
      for (let x = startX; x <= length + startX - 1; x++) {
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
    const ship = this.getShip(coordinate);

    return {
      marker: this.board[x][y].marker,
      ship: ship,
    };
  }

  // return ship class in .ship property of board square for access
  getShip(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);
    if (this.board[x][y] === null) return false;
    return this.board[x][y].ship;
  }

  //check that the ship to be placed is within the board and fits on the board, returns true if valid
  //the board is a standard 10x10 battleship board, so coordinates must be between A-J and 1-10, example board:
  //   1  2  3  4  5  6  7  8  9  10
  // A -  -  -  -  -  -  -  -  -  -
  // B -  -  -  -  -  -  -  -  -  -
  // C -  -  -  -  -  -  -  -  -  -
  // D -  -  -  -  -  -  -  -  -  -
  // E -  -  -  -  -  -  -  -  -  -
  // F -  -  -  -  -  -  -  -  -  -
  // G -  -  -  -  -  -  -  -  -  -
  // H -  -  -  -  -  -  -  -  -  -
  // I -  -  -  -  -  -  -  -  -  -
  // J -  -  -  -  -  -  -  -  -  -
  isValid(coordinate, length) {
    //convert coordinate
    const [x, y] = this.convertCoordinate(coordinate);

    const regex = /^([0-9])$/; // use this to match numbers 0 through 9 since converted coords are in index form so -1

    //tests coordinates
    if (regex.test(x) && regex.test(y)) {
      //check if converted coords fit on 10x10 board
      if (y + length >= 10 || x + length >= 10) return false; //then check if it will go off board bounds by adding the length
      return true; //ship fulfills both conditions, return true
    }
    return false; //ship is not within the 10x10 board (ex: A11) return false
  }

  // check that this new ship will not overlap with an existing ship, returns true if collision is present
  checkShipCollision(startX, startY, length, isVertical, ship) {
    if (ship) length = ship.length;

    if (isVertical) {
      for (let i = startX; i < startX + length; i++) {
        //loop through the cells the ship would be placed on...
        if (this.board[i][startY] === null) return false; //if the cell is null, then no ship is present, no collision
        if (this.board[startX][i].marker === "S") return true; //"s" means ship is present, collison true
      }
    } else {
      for (let i = startY; i < startY + length; i++) {
        if (this.board[startX][i] === null) return false;
        if (this.board[startX][i].marker === "S") return true;
      }
    }
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