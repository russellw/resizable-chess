"use strict"
import assert from "assert"
import util from "util"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./rules.js"

let width = 0
let height = 0
let board = null
let color = 0

export function init(w, h, b, c) {
  width = w
  height = h
  board = b
  color = c
}

let nodes = 0

function at(x, y) {
  return board[x + y * width]
}

function dbg(a) {
  const stack = new Error().stack.split("\n")[2]
  console.log(stack.trim().replace(/^at\s+/g, ""))
  // https://nodejs.org/api/util.html#utilinspectobject-options
  console.log(util.inspect(a))
}

export function makeMove() {
  nodes = 0
  const v = movesVals(5)
  if (v.length === 0) return null
  if (board.turn === 1) v.sort((a, b) => b.val - a.val)
  else v.sort((a, b) => a.val - b.val)
  const b = v[0]
  return b
}

function minimax(depth, alpha, beta) {
  nodes++
  if (depth === 0) return staticVal()
  depth--
  const v = moves()
  if (board.turn >= 0) {
    let val = -Infinity
    for (let i = 0; i < v.length; i++) {
      val = Math.max(val, minimax(v[i], depth, alpha, beta))
      if (beta <= val) break
      alpha = Math.max(alpha, val)
    }
    return val
  } else {
    let val = Infinity
    for (let i = 0; i < v.length; i++) {
      val = Math.min(val, minimax(v[i], depth, alpha, beta))
      if (val <= alpha) break
      beta = Math.min(beta, val)
    }
    return val
  }
}

// make a single move, and return the resulting board
// or null if the move is invalid due to repetition
// that is the only validity check performed here
function move(x, y, x1, y1) {
  const array = board.array
  board = new Board(board.width, board.height, -board.turn)
  board.array = new Int8Array(array)

  board.x = x
  board.y = y
  board.x1 = x1
  board.y1 = y1
  let piece = at(x, y)
  board.piece = piece
  board.target = at(x1, y1)

  // put the piece in the destination square
  switch (piece) {
    case -PAWN:
      if (y1 === 0) piece = -QUEEN
      break
    case PAWN:
      if (y1 === board.height - 1) piece = QUEEN
      break
  }
  put(x1, y1, piece)

  // clear the origin square
  put(x, y, 0)

  // superko
  for (let b = board.prev; b !== null; b = b.prev) if (b.eq(board)) return null
  return board
}

// calculate the moves the current player can make from a position
// return a list of resulting boards
// or the empty list if no moves are possible
function moves(turn) {
  const v = []

  // make a proposed move and add to the list of possible moves
  // unless it is invalid due to bad destination/target or repetition
  // return whether a long-range piece can keep going this direction
  function add(x1, y1) {
    // outside the board
    if (!(0 <= x1 && x1 < width)) return false
    if (!(0 <= y1 && y1 < height)) return false

    // onto own piece (including null move)
    const target = at(x1, y1)
    if (target * turn > 0) return false

    // valid move
    add1(x1, y1)

    // a long-range piece can move onto an opponent piece
    // but can only move through empty space
    return target === 0
  }

  // make a proposed move and add to the list of possible moves
  // unless it is invalid due to repetition
  function add1(x1, y1) {
    const b = move(x, y, x1, y1)
    if (b === null) return
    v.push(b)
  }

  function bishop() {
    // southwest
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      y1--
      if (!add(x1, y1)) break
    }

    // southeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1--
      if (!add(x1, y1)) break
    }

    // northwest
    x1 = x
    y1 = y
    for (;;) {
      x1--
      y1++
      if (!add(x1, y1)) break
    }

    // northeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1++
      if (!add(x1, y1)) break
    }
  }

  function pawn() {
    let y1 = y
    if (turn >= 0) {
      // usually pawns can only move one square
      let limit = y1 + 1

      // initial extra move
      // cannot reach center row on odd board
      // jit compiler might or might not optimize divide to bit shift
      // to be on the safe side, performance-critical code should do it by hand
      if (y === 1) limit = Math.max(limit, (height >> 1) - 1)

      // move
      for (;;) {
        y1++
        if (limit < y1) break
        if (at(x, y1)) break
        if (!add(x, y1)) break
      }

      // capture
      y1 = y + 1
      if (y1 === height) return

      // diagonal west
      let x1 = x - 1
      if (0 <= x1) {
        if (at(x1, y1) < 0) add1(x1, y1)
      }

      // diagonal east
      x1 = x + 1
      if (x1 < width) {
        if (at(x1, y1) < 0) add1(x1, y1)
      }
    } else {
      // usually pawns can only move one square
      let limit = y1 - 1

      // initial extra move
      // cannot reach center row on odd board
      if (y === height - 2) limit = Math.min(limit, (height + 1) >> 1)

      // move
      for (;;) {
        y1--
        if (y1 < limit) break
        if (at(x, y1)) break
        if (!add(x, y1)) break
      }

      // capture
      y1 = y - 1
      if (y1 < 0) return

      // diagonal west
      let x1 = x - 1
      if (0 <= x1) {
        if (at(x1, y1) > 0) add1(x1, y1)
      }

      // diagonal east
      x1 = x + 1
      if (x1 < width) {
        if (at(x1, y1) > 0) add1(x1, y1)
      }
    }
  }

  function rook() {
    // west
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      if (!add(x1, y1)) break
    }

    // east
    x1 = x
    y1 = y
    for (;;) {
      x1++
      if (!add(x1, y1)) break
    }

    // south
    x1 = x
    y1 = y
    for (;;) {
      y1--
      if (!add(x1, y1)) break
    }

    // north
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
      switch (at(x, y) * turn) {
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

function movesVals(depth) {
  assert(1 <= depth)
  depth--
  const v = moves()
  for (let i = 0; i < v.length; i++) {
    const b = v[i]
    b.val = minimax(b, depth, -Infinity, Infinity)
  }
  return v
}

function pieceVal(piece) {
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

function put(x, y, piece) {
  board[x + y * width] = piece
}

function staticVal() {
  let val = 0.0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) val += pieceVal(at(x, y))
  return val
}
