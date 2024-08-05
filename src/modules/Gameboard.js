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

  placeShip(startCoordinate, endCoordinate, ship) {
    let createdShip;

    if (!this.isValid(startCoordinate) || !this.isValid(endCoordinate)) {
      return false;
    }

    //convert coordinates to array index coords
    let [startX, startY] = this.convertCoordinate(startCoordinate);
    let [endX, endY] = this.convertCoordinate(endCoordinate);

    // Ensure coordinates are in correct order for placement
    if (startX > endX || startY > endY) {
      [startX, endX] = [Math.min(startX, endX), Math.max(startX, endX)];
      [startY, endY] = [Math.min(startY, endY), Math.max(startY, endY)];
    }

    // Determine ship length if no ship class is provided
    if (!ship) {
      let length;
      if (startY === endY) {
        length = endX - startX + 1; // Horizontal ship
      } else {
        length = endY - startY + 1; // Vertical ship
      }
      createdShip = new Ship(length); //create ship object and add it to ships array
      this.ships.push(createdShip);
    } else {
      this.ships.push(ship);
    }

    // Place ship on board
    if (startX === endX) {
      // Vertical ship
      for (let y = startY; y <= endY; y++) {
        this.board[startX][y] = { marker: "s", ship: ship || createdShip };
      }
    } else if (startY === endY) {
      // Horizontal ship
      for (let x = startX; x <= endX; x++) {
        this.board[x][startY] = { marker: "s", ship: ship || createdShip };
      }
    }
  }

  receiveHit(coordinate) {
    const [x, y] = this.convertCoordinate(coordinate);

    //find and return ship class associated with the coordinate, mark as hit on board and ship itself, and add the hit to hits array if a ship is present
    if (this.board[x][y] && this.board[x][y].marker === "s") {
      const ship = this.getShip([x, y]);
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
    const ship = this.getShip([x, y], this.board);

    return {
      marker: this.board[x][y].marker,
      ship: ship,
    };
  }

  // return ship class in .ship property of board square for access
  getShip([x, y]) {
    return this.board[x][y].ship;
  }

  isValid(coordinate) {
    //split coordinate
    const x = coordinate[0];
    const y = coordinate.slice(1);

    const regex = /^[A-J]+$/; //contains A-J the only valid coordinates for the x-axis
    const regex2 = /^([1-9]|10)$/; //contains 1-10 the only valid y-axis coordinates

    if (regex.test(x) && regex2.test(y)) return true; //tests both coordinates to see if both indexes pass the conditions set before
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