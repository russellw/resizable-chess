"use strict"
const assert = require("assert")
const util = require("util")

const minWidth = 1
const minHeight = 2

// SORT
const BISHOP = 1
const KING = 2
const KNIGHT = 3
const PAWN = 4
const QUEEN = 5
const ROOK = 6
//

class Board {
  width = 0
  height = 0
  // SORT
  array = null
  check = false
  turn = 1
  val = 0.0
  //
  constructor(width, height) {
    this.width = width
    this.height = height
  }
  copy() {
    const board = new Board(this.width, this.height)
    board.array = new Int8Array(this.array)
    return board
  }
  at(x, y) {
    return this.array[x + y * this.width]
  }
  atBounded(x, y) {
    if (!(0 <= x && x < this.width)) return 0
    if (!(0 <= y && y < this.height)) return 0
    return this.at(x, y)
  }
  put(x, y, piece) {
    this.array[x + y * this.width] = piece
  }
}

let dent = 0

function check(board, player) {
  const width = board.width
  const height = board.height

  const king = KING * player
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (board.at(x, y) === king) return check1(board, player, x, y)
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
    let piece = board.at(x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    y1--
    if (y1 < 0) break
    let piece = board.at(x1, y1)
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
    let piece = board.at(x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1--
    if (x1 < 0) break
    let piece = board.at(x1, y1)
    if (piece === queen || piece === rook) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    x1++
    if (x1 === width) break
    let piece = board.at(x1, y1)
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
    let piece = board.at(x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  x1 = x
  y1 = y
  for (;;) {
    y1++
    if (y1 === height) break
    let piece = board.at(x1, y1)
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
    let piece = board.at(x1, y1)
    if (piece === queen || piece === bishop) return true
    if (piece !== 0) break
  }

  // Knight
  const knight = KNIGHT * opponent
  if (board.atBounded(x - 1, y - 2) === knight) return true
  if (board.atBounded(x + 1, y - 2) === knight) return true
  if (board.atBounded(x - 2, y - 1) === knight) return true
  if (board.atBounded(x + 2, y - 1) === knight) return true
  if (board.atBounded(x - 2, y + 1) === knight) return true
  if (board.atBounded(x + 2, y + 1) === knight) return true
  if (board.atBounded(x - 1, y + 2) === knight) return true
  if (board.atBounded(x + 1, y + 2) === knight) return true

  // King
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
  for (let y1 = Y1; y1 < Y2; y1++) for (let x1 = X1; x1 < X2; x1++) if (board.at(x1, y1) === king) return true

  return false
}

function dbg(a) {
  const stack = new Error().stack.split("\n")[2]
  const location = stack.trim().replace(/^at\s+/g, "")
  console.log(`${location}`)
  console.log(util.inspect(a, { showHidden: false, depth: null, colors: true }))
}

function emptyBoard(width, height) {
  assert(minWidth <= width)
  assert(minHeight <= height)
  const board = new Board(width, height)
  board.array = new Int8Array(width * height)
  return board
}

function indent() {
  for (let i = 0; i < dent; i++) process.stdout.write("  ")
}

function initialBoard(width, height) {
  const board = emptyBoard(width, height)

  // Pawns
  if (4 <= height) {
    let y = height - 2
    for (let x = 0; x < width; x++) {
      board.put(x, 1, PAWN)
      board.put(x, y, -PAWN)
    }
  }

  // Queen
  let x = (width - 1) >> 1
  board.put(x, 0, QUEEN)
  let pieces = x

  // King overwrites queen on odd width
  x = width >> 1
  board.put(x, 0, KING)

  // 4x4 should have rooks
  const rooks = Math.ceil(pieces / 3)

  // 6x6 should reduce to Los Alamos chess, which has knights
  const knights = (pieces - rooks + 1) >> 1

  // And the other pieces are bishops
  for (let x = 0; x < pieces; x++) {
    let piece = BISHOP
    if (x < rooks) piece = ROOK
    else if (x < rooks + knights) piece = KNIGHT
    board.put(x, 0, piece)
    board.put(width - 1 - x, 0, piece)
  }

  // Opponent
  let y = height - 1
  for (let x = 0; x < width; x++) board.put(x, y, -board.at(x, 0))

  return board
}

function minimax(board, depth) {
  dent = 20 - depth
  let v = moves(board)
  if (v.length === 0) {
    if (board.check) return board.turn === 1 ? -Infinity : Infinity
    return 0
  }
  if (depth === 0) return staticVal(board)
  depth--
  if (board.turn >= 0) {
    let r = -Infinity
    for (let i = 0; i < v.length; i++) r = Math.max(r, minimax(v[i], depth))
    return r
  } else {
    let r = Infinity
    for (let i = 0; i < v.length; i++) r = Math.min(r, minimax(v[i], depth))
    return r
  }
}

function move(board, x, y, x1, y1) {
  const b = board.copy()

  // The possibility of taking a king should never arise
  assert(Math.abs(b.at(x1, y1)) !== KING)

  // Put the piece in the destination square
  let piece = b.at(x, y)
  switch (piece) {
    case -PAWN:
      if (y1 === 0) piece = -QUEEN
      break
    case PAWN:
      if (y1 === b.height - 1) piece = QUEEN
      break
  }
  b.put(x1, y1, piece)

  // Clear the origin square
  b.put(x, y, 0)

  // Can't make a move that leaves you in check
  if (check(b, board.turn)) return null

  // Opponent's turn
  b.turn = -board.turn

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
    if (board.at(x1, y1) * turn > 0) return false

    // Valid move
    add1(x1, y1)
    return true
  }

  function add1(x1, y1) {
    const b = move(board, x, y, x1, y1)
    if (b === null) return
    v.push(b)
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
        if (board.at(x1, y1)) break
        if (!add(x1, y1)) break
      }

      // Capture
      y1 = y + 1
      if (y1 === height) return

      // Diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (board.at(x2, y1) < 0) add1(x2, y1)
      }

      // Diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (board.at(x2, y1) < 0) add1(x2, y1)
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
        if (board.at(x1, y1)) break
        if (!add(x1, y1)) break
      }

      // Capture
      y1 = y - 1
      if (y1 < 0) return

      // Diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (board.at(x2, y1) > 0) add1(x2, y1)
      }

      // Diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (board.at(x2, y1) > 0) add1(x2, y1)
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
      switch (board.at(x, y) * turn) {
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

function movesVals(board, depth) {
  assert(1 <= depth)
  depth--
  const v = moves(board)
  for (let i = 0; i < v.length; i++) {
    const b = v[i]
    b.val = minimax(b, depth)
  }
  v.sort((a, b) => b.val - a.val)
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
  indent()
  for (let x = 0; x < board.width; x++) process.stdout.write("--")
  process.stdout.write("\n")

  // Board
  for (let y = board.height; y--; ) {
    indent()
    for (let x = 0; x < board.width; x++) {
      process.stdout.write(pieceChar(board.at(x, y)))
      if (x < board.width - 1) process.stdout.write(" ")
    }
    if ((board.turn === -1 && y === board.height - 1) || (board.turn === 1 && y === 0)) process.stdout.write("*")
    process.stdout.write("\n")
  }
}

function staticVal(board) {
  const width = board.width
  const height = board.height

  let r = 0.0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) r += pieceVal(board, board.at(x, y))
  return r
}

function valid(board) {
  const width = board.width
  const height = board.height
  // SORT
  const array = board.array
  const turn = board.turn
  //

  // Board size
  if (width < minWidth) return false
  if (height < minHeight) return false
  if (array.length !== width * height) return false

  // Every square is empty or contains a valid piece
  for (let i = 0; i < array.length; i++) {
    const piece = array[i]
    if (!(-6 <= piece && piece <= 6)) return false
  }

  // Each player has exactly one king
  let blackKings = 0
  let whiteKings = 0
  for (let i = 0; i < array.length; i++)
    switch (array[i]) {
      case -KING:
        blackKings++
        break
      case KING:
        whiteKings++
        break
    }
  if (blackKings !== 1) return false
  if (whiteKings !== 1) return false

  // No pawns in first or last rows
  for (let x = 0; x < width; x++) if (Math.abs(board.at(x, 0)) === PAWN || Math.abs(board.at(x, height - 1)) === PAWN) return

  // Current turn must be one player or the other
  if (!(turn === 1 || turn === -1)) return false

  // Accurate indicator of whether the current player is in check
  if (board.check !== check(board, turn)) return false

  // The other player can't be in check
  if (check(board, -turn)) return false

  return true
}

module.exports = {
  // SORT
  BISHOP,
  Board,
  KING,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  check,
  dbg,
  emptyBoard,
  initialBoard,
  minimax,
  moves,
  movesVals,
  printBoard,
  staticVal,
  valid,
  //
}
