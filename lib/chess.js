const KING = 1;
const QUEEN = 2;
const ROOK = 3;
const BISHOP = 4;
const KNIGHT = 5;
const PAWN = 6;

const WHITE = 0
const BLACK = 8

var width = 8
var height = 8

function setSize(w, h) {
  width = w
  height = h
}

function blankBoard() {
  return new Uint8Array(width * height)
}

function initialBoard() {
  var board = blankBoard()
  return board
}

module.exports = {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN
};
