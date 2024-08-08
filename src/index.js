const ScreenController = require('./modules/ScreenController')
const Player = require("./modules/Player");


const screenController = new ScreenController()
const player = new Player('human')
player.board.placeShip('B1', 4)
player.board.receiveHit("B1");
player.board.receiveHit('A1')
player.board.receiveHit("A2");
player.board.receiveHit("A7");
const cpu = new Player('cpu')
cpu.board.placeShip('C4', 4)
screenController.createPlayerBoard(player)
screenController.createComputerBoard(cpu)

window.screenController = screenController
window.player = player;
