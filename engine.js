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

class Move {
  // from
  x = 0
  y = 0

  // to
  x1 = 0
  y1 = 0

  // need to remember the pieces
  // to retract moves when backtracking in the search tree
  piece = 0
  target = 0

  constructor(x, y, x1, y1) {
    this.x = x
    this.y = y
    this.x1 = x1
    this.y1 = y1
  }
}

let nodes = 0

function apply(move) {
  const x = move.x
  const y = move.y
  const x1 = move.x1
  const y1 = move.y1

  // from
  let piece = at(x, y)
  put(x, y, 0)
  move.piece = piece

  // to
  move.target = at(x1, y1)
  switch (piece) {
    case -PAWN:
      if (y1 === 0) piece = -QUEEN
      break
    case PAWN:
      if (y1 === board.height - 1) piece = QUEEN
      break
  }
  put(x1, y1, piece)

  verifyMove(move)
}

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
  if (color === 1) v.sort((a, b) => b.val - a.val)
  else v.sort((a, b) => a.val - b.val)
  const move = v[0]
  apply(move)
  return move
}

function minimax(turn, depth, alpha, beta) {
  nodes++
  if (depth === 0) return staticVal()
  depth--
  const v = moves(turn)
  if (turn >= 0) {
    turn = -turn
    let val = -Infinity
    for (let i = 0; i < v.length; i++) {
      const move = v[i]
      apply(move)
      val = Math.max(val, minimax(turn, depth, alpha, beta))
      retract(move)
      if (beta <= val) break
      alpha = Math.max(alpha, val)
    }
    return val
  } else {
    turn = -turn
    let val = Infinity
    for (let i = 0; i < v.length; i++) {
      const move = v[i]
      apply(move)
      val = Math.min(val, minimax(turn, depth, alpha, beta))
      retract(move)
      if (val <= alpha) break
      beta = Math.min(beta, val)
    }
    return val
  }
}

function moves(turn) {
  const v = []

  // make a proposed move and add to the list of possible moves
  // unless it is invalid due to bad destination/target
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
  function add1(x1, y1) {
    v.push(new Move(x, y, x1, y1))
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

  let kingFound = false
  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++)
      switch (at(x, y) * turn) {
        case BISHOP:
          bishop()
          break
        case KING:
          kingFound = true
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
  if (kingFound) return v
  return []
}

function movesVals(depth) {
  assert(1 <= depth)
  depth--
  const v = moves(color)
  for (let i = 0; i < v.length; i++) {
    const move = v[i]
    apply(move)
    move.val = minimax(-color, depth, -Infinity, Infinity)
    retract(move)
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

function retract(move) {
  verifyMove(move)
  put(move.x1, move.y1, move.target)
  put(move.x, move.y, move.piece)
}

function staticVal() {
  let val = 0.0
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) val += pieceVal(at(x, y))
  return val
}

function verifyMove(move) {
  const x = move.x
  const y = move.y
  const x1 = move.x1
  const y1 = move.y1
  const piece = move.piece
  const target = move.target

  // coordinates in bounds
  assert(0 <= x && x < width)
  assert(0 <= y && y < height)
  assert(0 <= x1 && x1 < width)
  assert(0 <= y1 && y1 < height)

  // moved an actual piece
  assert(piece !== 0)

  // did not take a piece of the same color
  assert(Math.sign(piece) !== Math.sign(target))

  // origin square is now vacant
  assert(at(x, y) === 0)

  // destination square is now occupied by the piece
  if (at(x1, y1) === piece) return

  // or there was a promotion
  switch (piece) {
    case -PAWN:
      assert(y1 === 0)
      assert(at(x1, y1) === -QUEEN)
      break
    case PAWN:
      assert(y1 === board.height - 1)
      assert(at(x1, y1) === QUEEN)
      break
    default:
      throw new Error(piece)
  }
}
