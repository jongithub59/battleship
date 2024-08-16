const Gameboard = require('../Gameboard')
const Ship = require('../Ship')

describe("test Gameboard", () => {
  let testBoard;    
  let testShip;
  let invalidShip;

  beforeEach(() => {
    testBoard = new Gameboard
    testShip = new Ship(4)
    invalidShip = new Ship(11)
  });

  //test for class initialization
  it("initialize Gameboard class and check the 2D array created", () => {
    expect(testBoard.board.length).toBe(10);

    testBoard.board.forEach(innerArray => {
      expect(innerArray.length).toBe(10)
    })

    testBoard.board.forEach((innerArray) => {
      innerArray .forEach(cell => {
        expect(cell).toEqual(null);
      })
    });
  });

  it("this is what the board should look like visually", () => {
    expect(testBoard.board).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  //tests for coordinates
  it("create placeShip() func that places a ship on coordinates", () => {
    testBoard.placeShip([0, 5], 3);
    expect(testBoard.board[0][5].marker).toBe('S');
    expect(testBoard.board[0][6].marker).toBe("S");
    expect(testBoard.board[0][7].marker).toBe("S");
  });

  it("create placeShip() func that places a ship on coordinates vertically", () => {
    testBoard.placeShip([2, 5], 3, true);
    expect(testBoard.board[2][5].marker).toBe("S");
    expect(testBoard.board[3][5].marker).toBe("S");
    expect(testBoard.board[4][5].marker).toBe("S");
  });

  it("test placeShip() func that places a ship on coords with a ship class", () => {
    testBoard.placeShip([0, 5], "", false, testShip);
    expect(testBoard.board[0][6].marker).toBe("S");
  });

  it("test generateRandomBoard to place ships randomly, if successful, all ship will be on this.ships", () => {
    testBoard.generateRandomBoard();
    expect(testBoard.ships.length).toBe(5);
  });

  it("create receiveHit() func that places a hit on coordinates", () => {
    testBoard.receiveHit([0, 3]);
    expect(testBoard.board[0][3].marker).toBe('O');
  });

  it("check that all boxes in a certain row are not marked when one is hit", () => {
    testBoard.placeShip([1, 0], 4);
    testBoard.receiveHit([1, 4]);
    expect(testBoard.board[1][7]).toBe(null);
  });

  it("create checkCoordinate() func that checks for a ship on coordinates", () => {
    testBoard.placeShip([1, 0], 4);
    testBoard.receiveHit([1, 3]);
    const result = testBoard.checkCoordinate([1, 1]);
    expect(result['marker'] === 'S' || result['marker'] === 'X' ).toBe(true);
  });

  it("create checkCoordinate() func that checks for a ship on coordinates and returns it", () => {
    testBoard.placeShip([0, 1], 5);
    const result = testBoard.checkCoordinate([0, 3]);
    expect(result['ship']).toEqual({
      'hits': 0,
      'length': 5,
      'sunk': false
    });
  });

   it("create getShip() func that returns a ship object on a given coordinate", () => {
     testBoard.placeShip([0, 0], "", false, testShip);
     expect(testBoard.getShip([0, 0])).toBe(testShip);
   });

  it("create isValid() func that checks if coordinate fits on the board", () => {
    expect(testBoard.isValid([0, 2])).toBe(true);
  });

  it("create isValid() func that checks if coordinate fits on the board", () => {
    expect(testBoard.isValid([0, 11])).toBe(false);
  });

  it("create isValid() func that checks if ship will fit on board", () => {
    expect(testBoard.isValid([0, 0], 11)).toBe(false);
  });

   it("create isValid() func that checks if ship object will fit on board", () => {
    expect(testBoard.isValid([0, 0], '', invalidShip)).toBe(false);
   });

  it("test checkShipCollision() func to see if it checks for existing ship on coordinate", () => {
    testBoard.placeShip([0, 1], 5);
    expect(testBoard.checkShipCollision([0, 1], 5, false)).toBe(true);
  });

  it("test checkShipCollision() func to see if ship was not placed when a collision was found", () => {
    testBoard.placeShip([0, 1], 2);
    testBoard.placeShip([0, 2], 4);
    expect(testBoard.board[0][3]).toBe(null);
  });

    it("test checkShipCollision() func to see if vertical ship was not placed when a collision was found", () => {
      testBoard.placeShip([1, 0], 4);
      testBoard.placeShip([0, 0], 5, true);
      expect(testBoard.board[2][0]).toBe(null);
    });

  it("test checkShipCollision() func to see if ship was not placed when a collision was found", () => {
    testBoard.placeShip([0, 1], '', false, testShip);
    testBoard.placeShip([0, 4], 4);
    expect(testBoard.board[0][1].marker).toBe('S');
    expect(testBoard.board[0][2].marker).toBe("S");
    expect(testBoard.board[0][3].marker).toBe("S");
    expect(testBoard.board[0][4].marker).toBe("S");
    expect(testBoard.getShip([0, 5])).toBe(false);
    expect(testBoard.getShip([0, 6])).toBe(false);
    expect(testBoard.getShip([0, 7])).toBe(false);
    expect(testBoard.getShip([0, 8])).toBe(false);
  });

  it("test placeShip to return if ship placement is expected to go out of bounds", () => {
    testBoard.placeShip([0, 5], 5);
    expect(testBoard.board[0][5]).toEqual(null);
    expect(testBoard.board[0][6]).toEqual(null);
    expect(testBoard.board[0][7]).toEqual(null);
    expect(testBoard.board[0][8]).toEqual(null);
    expect(testBoard.board[0][9]).toEqual(null);
  });

  it("test that this.misses returns all misses on the board", () => {
    testBoard.receiveHit([4, 2]);
    testBoard.receiveHit([4, 6]);
    const misses = testBoard.misses
    expect(misses[0]).toEqual([4, 2]);
    expect(misses[1]).toEqual([4, 6]);
  });

  it("test that this.hits returns all misses on the board", () => {
    testBoard.placeShip([4, 2], 5)
    testBoard.receiveHit([4, 2]);
    testBoard.receiveHit([4, 6]);
    const hits = testBoard.hits;
    expect(hits[0]).toEqual([4, 2]);
    expect(hits[1]).toEqual([4, 6]);
  });

   it("test that this.ships returns all ships on the board", () => {
     testBoard.placeShip([4, 2], 5);
     testBoard.placeShip([1, 3], 3);
     testBoard.placeShip([5, 2], 2);
     const ships = testBoard.ships;
     expect(ships[0]).toEqual({
       hits: 0,
       length: 5,
       sunk: false,
     });
     expect(ships[1]).toEqual({
       hits: 0,
       length: 3,
       sunk: false,
     });
     expect(ships[2]).toEqual({
       hits: 0,
       length: 2,
       sunk: false,
     });
   });

  it("create allShipsSunk() func that checks if all ships are sunk", () => {
    testBoard.placeShip([1, 0], 4);
    testBoard.receiveHit([1, 0]);
    testBoard.receiveHit([1, 1]);
    testBoard.receiveHit([1, 2]);
    testBoard.receiveHit([1, 3]);
    expect(testBoard.allShipsSunk()).toBe(true);
  });

});