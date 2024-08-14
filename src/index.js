const EventHandler = require("./modules/EventHandler.js");

const gameHandler = new EventHandler()
gameHandler.startGame() //this func is all thats needs to be called to run the game  

// MOCK
gameHandler.player.placeShip([1, 0], 4)
gameHandler.player.receiveHit([1, 0])
gameHandler.player.receiveHit([0, 0])
gameHandler.player.receiveHit([0, 1]);
gameHandler.player.receiveHit([0, 6]);
gameHandler.computer.placeShip([2, 3], 4)
gameHandler.updateBoards()
// MOCK

