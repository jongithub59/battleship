const EventHandler = require("./modules/EventHandler.js");

const gameHandler = new EventHandler()
gameHandler.startGame() //this func is all thats needs to be called to run the game  

// MOCK
gameHandler.player.placeShip('B1', 4)
gameHandler.player.receiveHit('B1')
gameHandler.player.receiveHit('A1')
gameHandler.player.receiveHit("A2");
gameHandler.player.receiveHit("A7");
gameHandler.computer.placeShip('C4', 4)
gameHandler.updateBoards()
// MOCK

