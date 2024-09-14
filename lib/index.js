"use strict"

const minWidth = 1
const minHeight = 3

// SORT
const BISHOP = 1
const KING = 2
const KNIGHT = 3
const PAWN = 4
const QUEEN = 5
const ROOK = 6
//

function alive(board) {
  let k = false
  for (const piece of board) {
    switch (piece) {
      case -KING:
      case KING:
        if (k) return true
        k = true
        break
    }
  }
  return false
}

function at(board, x, y) {
  return board[x + y * board.width]
}

function check(board, player) {
  const width = board.width
  const height = board.height

  const king = KING * player
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (at(board, x, y) === king) return check1(board, player, x, y)
  throw new Error()
}

function check1(board, player, x, y) {
  const width = board.width
  const height = board.height

  const opponent = -player

  // Possibly-checking pieces are looked for
  // in best-guess descending order of probability
  const queen = QUEEN * opponent
  const rook = ROOK * opponent
  const bishop = BISHOP * opponent

  let x1 = x
  let y1 = y
  for (;;) {
    x1--
    if (x1 < 0) break
    y1--
    if (y1 < 0) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    y1--
    if (y1 < 0) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === rook) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1++
    if (x1 === width) break
    y1--
    if (y1 < 0) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1--
    if (x1 < 0) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === rook) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1++
    if (x1 === width) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === rook) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1--
    if (x1 < 0) break
    y1++
    if (y1 === height) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    y1++
    if (y1 === height) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === rook) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1++
    if (x1 === width) break
    y1++
    if (y1 === height) break
    let piece = at(board, x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  const knight = KNIGHT * opponent
  if (getBounded(board, x - 1, y - 2) === knight) return true
  if (getBounded(board, x + 1, y - 2) === knight) return true
  if (getBounded(board, x - 2, y - 1) === knight) return true
  if (getBounded(board, x + 2, y - 1) === knight) return true
  if (getBounded(board, x - 2, y + 1) === knight) return true
  if (getBounded(board, x + 2, y + 1) === knight) return true
  if (getBounded(board, x - 1, y + 2) === knight) return true
  if (getBounded(board, x + 1, y + 2) === knight) return true

  const king = KING * opponent
  // JIT compiler might or might not optimize Math.max/min
  // To be on the safe side, performance-critical code should do it by hand
  let X1 = x - 1
  if (X1 < 0) X1 = 0
  let X2 = x + 2
  if (X2 > width) X2 = width
  let Y1 = y - 1
  if (Y1 < 0) Y1 = 0
  let Y2 = y + 2
  if (Y2 > height) Y2 = height
  for (let y1 = Y1; y1 < Y2; y1++) for (let x1 = X1; x1 < X2; x1++) if (at(board, x1, y1) === king) return true

  return false
}

function decodeFEN(fen, width, height) {
  const [position, turn] = fen.split(" ")
  const rows = position.split("/")

  // Create an Int8Array for the board
  let board = new Int8Array(width * height)

  // Map FEN piece characters to values
  const pieceMap = {
    P: PAWN,
    N: KNIGHT,
    B: BISHOP,
    R: ROOK,
    Q: QUEEN,
    K: KING,
    p: -PAWN,
    n: -KNIGHT,
    b: -BISHOP,
    r: -ROOK,
    q: -QUEEN,
    k: -KING,
  }

  // Fill the board based on FEN notation
  let index = 0
  for (let row of rows) {
    for (let char of row) {
      if (char >= "1" && char <= "9") {
        // Handle empty squares
        index += parseInt(char, 10)
      } else {
        // Map the piece character to the board
        board[index] = pieceMap[char]
        index++
      }
    }

    // Move index to the next row, respecting the board width
    const rowIndex = Math.floor(index / width)
    const nextRowStart = rowIndex * width
    index = nextRowStart + width
  }

  // Determine whose turn it is (1 for white, -1 for black)
  const boardState = {
    board: board,
    turn: turn === "w" ? 1 : -1,
  }

  return boardState
}

function emptyBoard(width, height) {
  if (width < minWidth) throw new Error(width)
  if (height < minHeight) throw new Error(height)

  const board = new Int8Array(width * height)
  board.width = width
  board.height = height
  board.turn = 1
  board.check = false
  return board
}

function getBounded(board, x, y) {
  if (!(0 <= x && x < board.width)) return 0
  if (!(0 <= y && y < board.height)) return 0
  return at(board, x, y)
}

function initialBoard(width, height) {
  const board = emptyBoard(width, height)

  // Pawns
  if (height > 3) {
    let y = height - 2
    for (let x = 0; x < width; x++) {
      put(board, x, 1, PAWN)
      put(board, x, y, -PAWN)
    }
  }

  // Queen
  let x = (width - 1) >> 1
  put(board, x, 0, QUEEN)
  let pieces = x

  // King overwrites queen on odd width
  x = width >> 1
  put(board, x, 0, KING)

  // Pieces
  const rooks = Math.ceil(pieces / 3)
  const knights = (pieces - rooks + 1) >> 1
  for (let x = 0; x < pieces; x++) {
    let piece = BISHOP
    if (x < rooks) piece = ROOK
    else if (x < rooks + knights) piece = KNIGHT
    put(board, x, 0, piece)
    put(board, width - 1 - x, 0, piece)
  }

  // Opponent
  let y = height - 1
  for (let x = 0; x < width; x++) put(board, x, y, -at(board, x, 0))

  return board
}

function minimax(board, depth) {
  let v = moves(board)
  if (v.length === 0) {
    if (board.check) return -Infinity
    return 0
  }
  if (depth === 0) return staticVal(board)
  depth--
  if (board.turn >= 0) {
    r = -Infinity
    for (const b of v) r = Math.max(r, minimax(b, depth))
  } else {
    r = Infinity
    for (const b of v) r = Math.min(r, minimax(b, depth))
  }
  return r
}

function move(board, x, y, x1, y1) {
  const b = new Int8Array(board.length)
  b.set(board)
  b.width = board.width
  b.height = board.height
  b.turn = -board.turn

  // Put the piece in the destination square
  let piece = at(board, x, y)
  switch (piece) {
    case -PAWN:
      if (y1 === 0) piece = -QUEEN
      break
    case PAWN:
      if (y1 === board.height - 1) piece = QUEEN
      break
  }
  put(b, x1, y1, piece)

  // Clear the origin square
  put(b, x, y, 0)

  // Can't make a move that leaves you in check
  if (check(b, board.turn)) return null

  // Mark whether this has put the opponent in check
  b.check = check(b, b.turn)
  return b
}

function moves(board) {
  const width = board.width
  const height = board.height
  const turn = board.turn

  const v = []

  function add(x1, y1) {
    // Outside the board
    if (!(0 <= x1 && x1 < width && 0 <= y1 && y1 < height)) return false

    // Onto own piece (including null move)
    if (at(board, x1, y1) * turn > 0) return false

    // Valid move
    add1(x1, y1)
    return true
  }

  function add1(x1, y1) {
    const b = move(board, x, y, x1, y1)
    if (b !== null) v.push(b)
  }

  function bishop() {
    // Southwest
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      y1--
      if (!add(x1, y1)) break
    }

    // Southeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1--
      if (!add(x1, y1)) break
    }

    // Northwest
    x1 = x
    y1 = y
    for (;;) {
      x1--
      y1++
      if (!add(x1, y1)) break
    }

    // Northeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1++
      if (!add(x1, y1)) break
    }
  }

  function pawn() {
    const x1 = x
    let y1 = y
    if (turn >= 0) {
      // Usually pawns can only move one square
      let limit = y1 + 1

      // Initial extra move
      // cannot reach center row on odd board
      // JIT compiler might or might not optimize divide to bit shift
      // To be on the safe side, performance-critical code should do it by hand
      if (y === 1) limit = Math.max(limit, (height >> 1) - 1)

      // Move
      for (;;) {
        y1++
        if (y1 > limit) break
        if (at(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      // Capture
      y1 = y + 1
      if (y1 === height) return

      // Diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (at(board, x2, y1) < 0) add1(x2, y1)
      }

      // Diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (at(board, x2, y1) < 0) add1(x2, y1)
      }
    } else {
      // Usually pawns can only move one square
      let limit = y1 - 1

      // Initial extra move
      // cannot reach center row on odd board
      if (y === height - 2) limit = Math.min(limit, (height + 1) >> 1)

      // Move
      for (;;) {
        y1--
        if (y1 < limit) break
        if (at(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      // Capture
      y1 = y - 1
      if (y1 < 0) return

      // Diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (at(board, x2, y1) > 0) add1(x2, y1)
      }

      // Diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (at(board, x2, y1) > 0) add1(x2, y1)
      }
    }
  }

  function rook() {
    // West
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      if (!add(x1, y1)) break
    }

    // East
    x1 = x
    y1 = y
    for (;;) {
      x1++
      if (!add(x1, y1)) break
    }

    // South
    x1 = x
    y1 = y
    for (;;) {
      y1--
      if (!add(x1, y1)) break
    }

    // North
    x1 = x
    y1 = y
    for (;;) {
      y1++
      if (!add(x1, y1)) break
    }
  }

  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++)
      switch (at(board, x, y) * turn) {
        case BISHOP:
          bishop()
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
        case PAWN:
          pawn()
          break
        case QUEEN:
          bishop()
          rook()
          break
        case ROOK:
          rook()
          break
      }
  return v
}

function pieceChar(piece) {
  let minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }

  let c
  switch (piece) {
    case 0:
      c = "."
      break
    case BISHOP:
      c = "B"
      break
    case KING:
      c = "K"
      break
    case KNIGHT:
      c = "N"
      break
    case PAWN:
      c = "P"
      break
    case QUEEN:
      c = "Q"
      break
    case ROOK:
      c = "R"
      break
    default:
      throw new Error(piece)
  }

  if (minus) return c.toLowerCase()
  return c
}

function pieceVal(board, piece) {
  let minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }

  let r = 0.0
  switch (piece) {
    case BISHOP:
      r = 3.1
      break
    case KING:
      r = 1e12
      break
    case KNIGHT:
      r = 3.0
      break
    case PAWN:
      r = 1.0
      break
    case QUEEN:
      r = 9.0
      break
    case ROOK:
      r = 5.0
      break
  }

  if (minus) return -r
  return r
}

function printBoard(board) {
  // Separator
  for (let x = 0; x < board.width; x++) process.stdout.write("--")
  process.stdout.write("\n")

  // Board
  for (let y = board.height; y--; ) {
    for (let x = 0; x < board.width; x++) {
      process.stdout.write(" ")
      process.stdout.write(pieceChar(at(board, x, y)))
    }
    process.stdout.write("\n")
  }
}

function put(board, x, y, piece) {
  board[x + y * board.width] = piece
}

function staticVal(board) {
  const width = board.width
  const height = board.height

  let r = 0.0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) r += pieceVal(board, at(board, x, y))
  return r
}

function verify(board) {
  const width = board.width
  const height = board.height
  const turn = board.turn

  if (width < minWidth) throw new Error(width)
  if (height < minHeight) throw new Error(height)
  if (board.length !== width * height) throw new Error(board.length)

  if (!(turn === 1 || turn === -1)) throw new Error(turn)

  // Every square is empty or contains a valid piece
  for (const piece of board) pieceChar(piece)

  // Each player has exactly one king
  let kingsp = 0
  let kingsm = 0
  for (const piece of board)
    switch (piece) {
      case -KING:
        kingsm++
        break
      case KING:
        kingsp++
        break
    }
  if (kingsp !== 1) throw new Error(kingsp)
  if (kingsm !== 1) throw new Error(kingsm)

  // Pawns are where they should be
  for (let x = 0; x < width; x++)
    if (Math.abs(at(board, x, 0)) === PAWN || Math.abs(at(board, x, height - 1)) === PAWN) throw new Error(x)
}

module.exports = {
  // SORT
  BISHOP,
  KING,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  at,
  check,
  emptyBoard,
  initialBoard,
  minimax,
  moves,
  printBoard,
  put,
  staticVal,
  verify,
  //
}
