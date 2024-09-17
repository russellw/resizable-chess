"use strict"
const assert = require("assert")
const util = require("util")

// SORT
const BISHOP = 1
const KING = 2
const KNIGHT = 3
const PAWN = 4
const QUEEN = 5
const ROOK = 6
//

const charPiece = new Map([
  // SORT
  [".", 0],
  ["B", BISHOP],
  ["K", KING],
  ["N", KNIGHT],
  ["P", PAWN],
  ["Q", QUEEN],
  ["R", ROOK],
  ["b", -BISHOP],
  ["k", -KING],
  ["n", -KNIGHT],
  ["p", -PAWN],
  ["q", -QUEEN],
  ["r", -ROOK],
  //
])

class Board {
  // Primary fields
  prev = null

  width = 0
  height = 0
  array = null

  turn = 1

  // Secondary fields
  val = 0.0

  constructor(prev, width, height, turn) {
    this.prev = prev
    this.width = width
    this.height = height
    this.turn = turn
  }
  at(x, y) {
    return this.array[x + y * this.width]
  }
}

let dent = 0

function bestMove(board, depth) {
  const v = movesVals(board, depth)
  if (v.length === 0) return null
  return v[0]
}

function dbg(a) {
  const stack = new Error().stack.split("\n")[2]
  const location = stack.trim().replace(/^at\s+/g, "")
  console.log(`${location}`)
  console.log(util.inspect(a, { showHidden: false, depth: null, colors: true }))
}

function decodeFEN(width, height, fen) {
  const [position, turn] = fen.split(" ")
  const rows = position.split("/")
  let board = emptyBoard(width, height)

  let y = height - 1
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    let x = 0
    for (let j = 0; j < row.length; j++) {
      const c = row[j]
      if ("0" <= c && c <= "9") {
        x += c.charCodeAt(0) - 48
        continue
      }
      putErrorCheck(board, x, y, charPiece.get(c))
      x++
    }
    y--
  }

  switch (turn) {
    case "b":
      board.turn = -1
      break
    case "w":
      board.turn = 1
      break
    default:
      throw new Error(turn)
  }

  return board
}

function emptyBoard(width, height) {
  const board = new Board(null, width, height, 1)
  board.array = new Int8Array(width * height)
  return board
}

function eq(a, b) {
  if (a.turn !== b.turn) return false
  assert(a.array.length === b.array.length)
  for (let i = 0; i < a.array.length; i++) if (a.array[i] !== b.array[i]) return false
  return true
}

function indent() {
  for (let i = 0; i < dent; i++) process.stdout.write("  ")
}

function initialBoard(width, height) {
  assert(2 <= height)
  const board = emptyBoard(width, height)

  // Pawns
  if (4 <= height) {
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

  // 4x4 should have rooks
  const rooks = Math.ceil(pieces / 3)

  // 6x6 should reduce to Los Alamos chess, which has knights
  const knights = (pieces - rooks + 1) >> 1

  // And the other pieces are bishops
  for (let x = 0; x < pieces; x++) {
    let piece = BISHOP
    if (x < rooks) piece = ROOK
    else if (x < rooks + knights) piece = KNIGHT
    put(board, x, 0, piece)
    put(board, width - 1 - x, 0, piece)
  }

  // Opponent
  let y = height - 1
  for (let x = 0; x < width; x++) put(board, x, y, -board.at(x, 0))

  return board
}

function minimax(board, depth) {
  dent = 20 - depth
  if (depth-- === 0) return staticVal(board)
  const v = moves(board)
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
  const array = board.array
  board = new Board(board, board.width, board.height, -board.turn)
  board.array = new Int8Array(array)

  // Put the piece in the destination square
  let piece = board.at(x, y)
  switch (piece) {
    case -PAWN:
      if (y1 === 0) piece = -QUEEN
      break
    case PAWN:
      if (y1 === board.height - 1) piece = QUEEN
      break
  }
  put(board, x1, y1, piece)

  // Clear the origin square
  put(board, x, y, 0)

  // Situational superko
  for (let b = board.prev; b !== null; b = b.prev) if (eq(b, board)) return null

  return board
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

  let kingExists = false
  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++)
      switch (board.at(x, y) * turn) {
        case BISHOP:
          bishop()
          break
        case KING:
          kingExists = true
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
  if (kingExists) return v
  return []
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
  switch (piece) {
    case -BISHOP:
      return "b"
    case -KING:
      return "k"
    case -KNIGHT:
      return "n"
    case -PAWN:
      return "p"
    case -QUEEN:
      return "q"
    case -ROOK:
      return "r"
    case 0:
      return "."
    case BISHOP:
      return "B"
    case KING:
      return "K"
    case KNIGHT:
      return "N"
    case PAWN:
      return "P"
    case QUEEN:
      return "Q"
    case ROOK:
      return "R"
  }
  throw new Error(piece)
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
      r = 4.0
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

function put(board, x, y, piece) {
  board.array[x + y * board.width] = piece
}

function putErrorCheck(board, x, y, piece) {
  assert(0 <= x && x < board.width)
  assert(0 <= y && y < board.height)
  assert(-6 <= piece && piece <= 6)
  put(board, x, y, piece)
}

function staticVal(board) {
  const width = board.width
  const height = board.height

  let r = 0.0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) r += pieceVal(board, board.at(x, y))
  return r
}

module.exports = {
  // SORT
  BISHOP,
  KING,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  bestMove,
  dbg,
  decodeFEN,
  initialBoard,
  minimax,
  move,
  moves,
  printBoard,
  //
}
