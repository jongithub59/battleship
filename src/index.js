const ScreenController = require('./modules/ScreenController')
const Player = require("./modules/Player");


const screenController = new ScreenController()
const player = new Player()
player.board.receiveHit('A1')
player.board.receiveHit("A2");
screenController.createPlayerBoard(player)

window.screenController = screenController
window.player = player;
