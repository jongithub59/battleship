const Gameboard = require("../Gameboard");
const Player = require("../Player");

describe("test Player", () => {
  let realPlayer;
  let cpuPlayer;

  beforeEach(() => {
    realPlayer = new Player('human')
    cpuPlayer = new Player('cpu')
  });

  it("create a real player class", () => {
    expect(realPlayer.playerType).toEqual('human');
  });

  it("create a computer player class", () => {
    expect(cpuPlayer.playerType).toEqual('cpu');
  });

  it("check that player class has a gameboard", () => {
    expect(cpuPlayer.board.board).toEqual([
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

  it("test that Gameboard funcs like placeShip() are accessible from the Player class", () => {
    realPlayer.board.placeShip('B1', 'B4')
    const result = realPlayer.board.checkCoordinate("B2");
    expect(result["marker"]).toBe("s");
  });

});