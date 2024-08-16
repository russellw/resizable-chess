const KING = 1;
const QUEEN = 2;
const ROOK = 3;
const BISHOP = 4;
const KNIGHT = 5;
const PAWN = 6;

function blankBoard(width , height) {
  board= new Uint8Array(width * height)
  board.width=width
  return board
}

function initialBoard(width , height) {
  var board = blankBoard(width , height)
  return board
}

module.exports = {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
  initialBoard
};
