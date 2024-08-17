const Ship = require("./Ship");

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    //key for coordinate conversion, not needed anymore
    this.xCoordinates = "ABCDEFGHIJ";
    this.yCoordinates = "12345678910";
    this.ships = [];
    this.misses = [];
    this.hits = [];
  }

  // Place the 5 different ships of Battleship randomly across the board
  generateRandomBoard() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const destroyer = new Ship(3);
    const submarine = new Ship(3);
    const patrolBoat = new Ship(2);

    const ships = [];

    ships.push(carrier, battleship, destroyer, submarine, patrolBoat);

    // loop through each ship to generate new coordinates and orientation until valid ships are placed
    ships.forEach((ship) => {
      while (true) {
        const startX = Math.floor(Math.random() * 10);
        const startY = Math.floor(Math.random() * 10);
        const isVertical = Math.random() < 0.5;
        if (this.placeShip([startX, startY], "", isVertical, ship)) {
          break;
        }
      }
      return true;
    });
  }

  getBoard() {
    return this.board;
  }

  placeShip([startX, startY], length, isVertical = false, ship) {
    let createdShip;

    // Loop until the ship is placed successfully
    while (true) {
      // Check if the coordinates + length are within valid bounds
      if (!this.isValid([startX, startY], length, ship)) {
        // If not valid, return false
        return false;
      }

      // Check if the new ship overlaps with any existing ship
      if (this.checkShipCollision([startX, startY], length, isVertical, ship)) {
        // If there's a collision, return false and let the external function handle new coordinates
        return false;
      }

      // If no collision and the placement is valid, break out of the loop
      break;
    }

    // Create the ship if it doesn't already exist and add it to the board's ships array
    if (!ship) {
      createdShip = new Ship(length);
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
      length = ship.length;
    }
    // Place the ship on the board horizontally or vertically
    if (isVertical === false) {
      //increment the coordinate related to y-axis to mark cells vertically to make the ship 
      for (let y = startY; y < length + startY; y++) {
        this.board[startX][y] = { marker: "S", ship: ship || createdShip,};
      }
    } else {
      for (let x = startX; x < length + startX; x++) {
        this.board[x][startY] = { marker: "S", ship: ship || createdShip };
      }
    }
    
    // Return true to indicate successful placement
    return true;
  }

  receiveHit([x, y]) {
    //find and return ship class associated with the coordinate, mark as hit on board and ship itself, and add the hit to hits array if a ship is present
    if (this.board[x][y] === null) {
      this.board[x][y] = { marker: "O" };
      this.misses.push([x, y]);
      return true
    } else if (this.board[x][y].marker === "X") {
      return false;
    } else if (this.board[x][y].marker === "S") {
      const ship = this.getShip([x, y]);
      this.board[x][y] = { marker: "X" };
      this.hits.push([x, y]);
      ship.hit();
      return true
    }
  }

  checkHit([x, y]) {
    if (this.board[x][y].marker === "X") return true;
    return false;
  }

  checkCoordinate([x, y]) {
    const ship = this.getShip([x, y]);

    return {
      marker: this.board[x][y].marker,
      ship: ship,
    };
  }

  // return ship class in .ship property of board square for access
  getShip([x, y]) {
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
  isValid([x, y], length, ship) {
    if (ship) length = ship.length;

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
  checkShipCollision([startX, startY], length, isVertical, ship) {
    if (ship) length = ship.length;

    if (isVertical) {
      for (let i = startX; i < startX + length; i++) {
        //loop through the cells the ship would be placed on...
        if (this.board[i][startY] !== null) return true; //if the cell is null, then no ship is present, no collision
      }
    } else {
      for (let i = startY; i < startY + length; i++) {
        if (this.board[startX][i] !== null) return true;
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
    if (this.ships.some((ship) => ship.sunk === false)) return false
    return true;
  }
}


module.exports = Gameboard;