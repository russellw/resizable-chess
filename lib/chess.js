const KING = 1;
const QUEEN = 2;
const ROOK = 3;
const BISHOP = 4;
const KNIGHT = 5;
const PAWN = 6;

function pack(x, y, x1, y1) {
  return x << 24 | y << 16 | x1 << 8 | y1;
}

function validMoves(board) {
  var width = board.width
  var height = board.height
  var x
  var y
  var v = []
  return v
}

function blankBoard(width, height) {
  if (!(0 < width && width < 256)) {
    throw new Error()
  }
  if (!(0 < height && height < 256)) {
    throw new Error()
  }
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
    put(board, x, y, -PAWN)
  }

  // Queen
  x = Math.floor((width - 1) / 2)
  put(board, x, 0, QUEEN)
  pieces = x

  // King overwrites queen on odd width
  x = Math.ceil((width - 1) / 2)
  put(board, x, 0, KING)

  // Pieces
  var rooks = Math.ceil(pieces / 3)
  var knights = Math.ceil((pieces - rooks) / 2)
  for (var x = 0; x < pieces; x++) {
    var piece
    if (x < rooks) {
      piece = ROOK
    } else if (x < rooks + knights) {
      piece = KNIGHT
    } else {
      piece = BISHOP
    }
    put(board, x, 0, piece)
    put(board, width - 1 - x, 0, piece)
  }

  // Opponent
  y = height - 1
  for (var x = 0; x < width; x++) {
    put(board, x, y, -get(board, x, 0))
  }

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
  for (var x = 0; x < board.width; x++) {
    process.stdout.write('--')
  }
  process.stdout.write('\n')

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
  validMoves,
};
