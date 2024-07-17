const Gameboard = require("../Gameboard");
const Player = require("../Player");

describe("test Player", () => {
  let realPlayer;
  let cpuPlayer;

  beforeEach(() => {
    realPlayer = Player()
    cpuPlayer = Player()
  });

  it("create a real player class", () => {
    realPlayer.initHuman()
    expect(realPlayer).toEqual({
      'playerType': 'human',
    });
  });

  it("create a computer player class", () => {
    cpuPlayer.initHuman();
    expect(cpuPlayer).toEqual({
      'playerType': 'cpu',
    });
  });

  it("check that player class has a gameboard", () => {
    expect(cpuPlayer.board).toEqual([
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    ]);
  });

  it("test that Gameboard funcs like placeShip() are accessible from the Player class", () => {
    realPlayer.board.placeShip('B1', 'B4')
    const result = realPlayer.board.checkCoordinate("B2");
    expect(result["marker"]).toBe("s");
  });

});