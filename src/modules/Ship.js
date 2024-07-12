class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.hits === this.length) return;
    this.hits = this.hits += 1;
    this.isSunk()
  }

  isSunk() {
    this.sunk = this.hits === this.length;
  }
}

module.exports = Ship