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
  var v = []

  function add(x1, y1) {
    // outside the board
    if (!(0 <= x1 && x1 < width && 0 <= y1 && y1 < height)) {
      return false
    }

    // onto own piece (including null move)
    if (get(board, x1, y1) > 0) {
      return false
    }

    // valid move
    v.push(pack(x, y, x1, y1))
    return true
  }

  function pawn() {
    var x1 = x
    var y1 = y

    //Extra move cannot reach center row on odd board
    var limit = y1 == 1 ? 2 : Math.floor(height / 2)

    //move
    for (;;) {
      y1++
      if (y1 > limit) {
        break
      }
      if (get(board, x1, y1)) {
        break
      }
      if (!add(x1, y1)) {
        break
      }
    }

    //capture
    y1 = y + 1
    if (x1 && get(board, x1 - 1, y1) < 0) {
      add(x1 - 1, y1)
    }
    if (x1 + 1 < width && get(board, x1 + 1, y1) < 0) {
      add(x1 + 1, y1)
    }
  }

  function rook() {
    //west
    var x1 = x
    var y1 = y
    for (;;) {
      x1--
      if (!add(x1, y1)) {
        break
      }
    }

    //east
    var x1 = x
    var y1 = y
    for (;;) {
      x1++
      if (!add(x1, y1)) {
        break
      }
    }

    // south
    var x1 = x
    var y1 = y
    for (;;) {
      y1--
      if (!add(x1, y1)) {
        break
      }
    }

    // north
    var x1 = x
    var y1 = y
    for (;;) {
      y1++
      if (!add(x1, y1)) {
        break
      }
    }
  }

  function bishop() {
    // southwest
    var x1 = x
    var y1 = y
    for (;;) {
      x1--
      y1--
      if (!add(x1, y1)) {
        break
      }
    }

    // southeast
    var x1 = x
    var y1 = y
    for (;;) {
      x1++
      y1--
      if (!add(x1, y1)) {
        break
      }
    }

    // northwest
    var x1 = x
    var y1 = y
    for (;;) {
      x1--
      y1++
      if (!add(x1, y1)) {
        break
      }
    }

    // northeast
    var x1 = x
    var y1 = y
    for (;;) {
      x1++
      y1++
      if (!add(x1, y1)) {
        break
      }
    }
  }

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      switch (get(board, x, y)) {
        case PAWN:
          pawn()
          break
        case ROOK:
          rook()
          break
        case BISHOP:
          bishop()
          break
        case QUEEN:
          bishop()
          rook()
          break
        case KNIGHT:
          add(x - 1, y - 2)
          add(x + 1, y - 2)
          add(x - 2, y - 1)
          add(x + 2, y - 1)
          add(x - 2, y + 1)
          add(x + 2, y + 1)
          add(x - 1, y + 2)
          add(x + 1, y + 2)
          break
        case KING:
          add(x - 1, y - 1)
          add(x, y - 1)
          add(x + 1, y - 1)
          add(x - 1, y)
          add(x + 1, y)
          add(x - 1, y + 1)
          add(x, y + 1)
          add(x + 1, y + 1)
          break
      }
    }
  }
  return v
}

function staticVal(board) {
  var width = board.width
  var height = board.height
  var r = 0.0
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      r += pieceVal(board, get(board, x, y))
    }
  }
  return r
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

function pieceVal(board, piece) {
  var minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }
  var r = 0.0
  switch (piece) {
    case KING:
      r = 1e12
      break
    case QUEEN:
      r = 9.0
      break
    case ROOK:
      r = 5.0
      break
    case BISHOP:
      r = 3.1
      break
    case KNIGHT:
      r = 3.0
      break
    case PAWN:
      r = 1.0
      break
  }
  if (minus) {
    r = -r
  }
  return r
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
  staticVal,
};
