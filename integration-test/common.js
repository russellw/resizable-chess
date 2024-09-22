"use strict"
import chalk from "chalk"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK, Engine,initialBoard } from "../lib/engine.js"


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

function printBoard(board) {
  // the move that was made
  if (board.piece) {
    printCoordinates(board.x, board.y)
    process.stdout.write("-")
    printCoordinates(board.x1, board.y1)
    process.stdout.write(" ")
    process.stdout.write(pieceChar(board.piece))
    if (board.target) {
      process.stdout.write("x")
      process.stdout.write(pieceChar(board.target))
    }
    if (board.piece !== board.at(board.x1, board.y1)) {
      process.stdout.write("=")
      process.stdout.write(pieceChar(board.at(board.x1, board.y1)))
    }
    process.stdout.write("\n")
  }

  // position
  for (let y = board.height; y--; ) {
    for (let x = 0; x < board.width; x++) {
      process.stdout.write(pieceChar(board.at(x, y)))
      if (x < board.width - 1) process.stdout.write(" ")
    }
    process.stdout.write("\n")
  }
}

