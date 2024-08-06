const Gameboard = require('../Gameboard')
const Ship = require('../Ship')

describe("test Gameboard", () => {
  let testBoard;    
  let testShip;

  beforeEach(() => {
    testBoard = new Gameboard
    testShip = new Ship(4);
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
    testBoard.placeShip("A4", 'A6');
    expect(testBoard.board[0][3].marker).toBe('S');
  });

  it("create receiveHit() func that places a hit on coordinates", () => {
      testBoard.receiveHit("A4");
      expect(testBoard.board[0][3].marker).toBe('O');
  });

  it("check that all boxes in a certain row are not marked when one is hit", () => {
      //  testBoard.placeShip("B1", "B4");
       testBoard.receiveHit("B4");
    expect(testBoard.board[1][7]).toBe(null);
  });

  it("create checkCoordinate() func that checks for a ship on coordinates", () => {
    testBoard.placeShip('B1', 'B4');
    testBoard.receiveHit('B4')
    const result = testBoard.checkCoordinate('B2')
    expect(result['marker'] === 'S' || result['marker'] === 'X' ).toBe(true);
  });

  it("create checkCoordinate() func that checks for a ship on coordinates and returns it", () => {
    testBoard.placeShip("A1", "A5");
    const result = testBoard.checkCoordinate("A2");
    expect(result['ship']).toEqual({
      'hits': 0,
      'length': 5,
      'sunk': false
    });
  });

  it("test checkCoordinate() func for when coordinates are received backwards", () => {
    testBoard.placeShip("B4", "B1");
    const result = testBoard.checkCoordinate("B2");
    expect(result['marker']).toBe("S");
  });

   it("create getShip() func that returns a ship object on a given coordinate", () => {
     testBoard.placeShip("A1", "A4", testShip);
     expect(testBoard.getShip([0, 0])).toBe(testShip);
   });

  it("create isValid() func that checks if coordinate fits on the board", () => {
    expect(testBoard.isValid('A3')).toBe(true)
  });

  it("create isValid() func that checks if coordinate fits on the board", () => {
    expect(testBoard.isValid("A12")).toBe(false);
  });

  it("create getMisses() func that returns all misses on the board", () => {
    testBoard.receiveHit("E3");
    testBoard.receiveHit("E7");
    const ConvertedMisses = testBoard.getMisses()
    expect(ConvertedMisses[0]).toBe("E3");
    expect(ConvertedMisses[1]).toBe("E7");
  });

  it("create allShipsSunk() func that checks if all ships are sunk", () => {
    testBoard.placeShip("B1", "B4");
    testBoard.receiveHit('B1');
    testBoard.receiveHit("B3");
    testBoard.receiveHit("B2");
    testBoard.receiveHit("B4");
    expect(testBoard.allShipsSunk()).toBe(true);
  });

});