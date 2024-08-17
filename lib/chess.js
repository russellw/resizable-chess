const KING = 1;
const QUEEN = 2;
const ROOK = 3;
const BISHOP = 4;
const KNIGHT = 5;
const PAWN = 6;

function blankBoard(width, height) {
  board = new Int8Array(width * height)
  board.width = width
  board.height = height
  return board
}

function get(board, x, y) {
  return board[x + y * board.width]
}

function initialBoard(width, height) {
  if (width < 1) {
    throw new Error()
  }
  if (height < 4) {
    throw new Error()
  }
  var board = blankBoard(width, height)

  // Pawns
  var y = height - 2
  for (var x = 0; x < width; x++) {
    put(board, x, 1, PAWN)
  }
  for (var x = 0; x < width; x++) {
    put(board, x, y, -PAWN)
  }

  // Rooks
  x = width - 1
  y = height - 1
  put(board, 0, 0, ROOK)
  put(board, x, 0, ROOK)
  put(board, 0, y, -ROOK)
  put(board, x, y, -ROOK)

  // Queens
  x = Math.floor((width - 1) / 2)
  put(board, x, 0, QUEEN)
  put(board, x, y, -QUEEN)

  // Kings
  x = Math.ceil((width - 1) / 2)
  put(board, x, 0, KING)
  put(board, x, y, -KING)

  return board
}

function pieceChar(piece) {
  var minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }
  var c = '.'
  switch (piece) {
    case KING:
      c = 'K'
      break
    case QUEEN:
      c = 'Q'
      break
    case ROOK:
      c = 'R'
      break
    case BISHOP:
      c = 'B'
      break
    case KNIGHT:
      c = 'N'
      break
    case PAWN:
      c = 'P'
      break
  }
  if (minus) {
    c = c.toLowerCase()
  }
  return c
}

function printBoard(board) {
  for (var y = board.height; y--;) {
    for (var x = 0; x < board.width; x++) {
      process.stdout.write(' ')
      process.stdout.write(pieceChar(get(board, x, y)))
    }
    process.stdout.write('\n')
  }
}

function put(board, x, y, piece) {
  board[x + y * board.width] = piece
}

module.exports = {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
  blankBoard,
  get,
  initialBoard,
  printBoard,
  put,
};
