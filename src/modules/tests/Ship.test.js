const Ship = require('../Ship')

describe('test Ship', () => {
 
    let testShip

    beforeEach(() => {
        testShip = new Ship(4)
    })

    //test for class initialization
    it('return a Ship class with length, hits, and isSunk props', () => {
        expect(testShip).toEqual({
        length: 4,
        hits: 0,
        sunk: false
    })
    })

    //tests for hit() function
    it("add a hit() function that adds hits to the hit property", () => {
        testShip.hit()
        expect(testShip.hits).toBe(1);
    });

    it("add a hit() function that adds 3 hits to the hit property", () => {
        testShip.hit();
        testShip.hit();
        testShip.hit();
        expect(testShip.hits).toBe(3);
    });

    ///tests for isSunk() function
    it("use isSunk to calc when a ship is sunk when hits equal the length. length: 4, hits: 0", () => {
        testShip.isSunk()
        expect(testShip.sunk).toBe(false);
    });

    it("use isSunk to calc when a ship is sunk when hits equal the length", () => {
        testShip.hit();
        testShip.hit();
        testShip.hit();
        testShip.hit();
        testShip.isSunk();
        expect(testShip.sunk).toBe(true);
    });
})