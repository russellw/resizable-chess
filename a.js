"use strict"
import chalk from "chalk"
import * as engine from "./lib/engine.js"
import * as old from "./lib/engine.js"

export function initialBoard(width, height) {
  assert(2 <= height)
  const board = new Int8Array(width * height)

  function put(x, y, piece) {
    board[x + y * width] = piece
  }

  // pawns
  if (4 <= height) {
    let y = height - 2
    for (let x = 0; x < width; x++) {
      put(x, 1, PAWN)
      put(x, y, -PAWN)
    }
  }

  // queen
  let x = (width - 1) >> 1
  put(x, 0, QUEEN)
  let pieces = x

  // king overwrites queen on odd width
  x = width >> 1
  put(x, 0, KING)

  // 4x4 should have rooks
  const rooks = Math.ceil(pieces / 3)

  // 6x6 should reduce to Los Alamos chess, which has knights
  const knights = (pieces - rooks + 1) >> 1

  // and the other pieces are bishops
  for (let x = 0; x < pieces; x++) {
    let piece = BISHOP
    if (x < rooks) piece = ROOK
    else if (x < rooks + knights) piece = KNIGHT
    put(x, 0, piece)
    put(width - 1 - x, 0, piece)
  }

  // opponent
  let y = height - 1
  for (let x = 0; x < width; x++) put(x, y, -board.at(x, 0))

  return board
}

engine.initBoard()
console.log(engine.board)

function takeTurn(name, makeMove, notifyMove, board) {
  console.log(name)
  let start = Date.now()
  let move = makeMove()
  let t = (Date.now() - start) / 1000
  console.log(t)
  if (move === null) return false
  notifyMove(move)
  printBoard(move, board)
  return true
}

for (let i = 1; ; i++) {
  console.log(i)
  if (!takeTurn("white", engine.makeMove, old.notifyMove, engine.board)) break
  if (!takeTurn("black", old.makeMove, engine.notifyMove, engine.board)) break
}
