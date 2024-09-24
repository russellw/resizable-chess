"use strict"
import chalk from "chalk"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./rules.js"

const charPiece = new Map([
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
])

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

export function printBoard(width, height, board) {
  function at(x, y) {
    return board[x + y * width]
  }

  for (let y = height; y--; ) {
    for (let x = 0; x < width; x++) {
      process.stdout.write(pieceChar(at(x, y)))
      if (x < width - 1) process.stdout.write(" ")
    }
    process.stdout.write("\n")
  }
}

function printCoordinates(x, y) {
  if (x <= 26) process.stdout.write(String.fromCharCode(97 + x))
  else {
    process.stdout.write((1 + x).toString())
    process.stdout.write(",")
  }
  process.stdout.write((1 + y).toString())
}

export function printMove(width, move, board) {
  const x = move.x
  const y = move.y
  const x1 = move.x1
  const y1 = move.y1
  const piece = move.piece
  const target = move.target

  function at(x, y) {
    return board[x + y * width]
  }

  printCoordinates(x, y)
  process.stdout.write("-")
  printCoordinates(x1, y1)
  process.stdout.write(" ")
  process.stdout.write(pieceChar(piece))
  if (target) {
    process.stdout.write("x")
    process.stdout.write(pieceChar(target))
  }
  if (piece !== at(x1, y1)) {
    process.stdout.write("=")
    process.stdout.write(pieceChar(at(x1, y1)))
  }
  process.stdout.write("\n")
}
