"use strict"
import chalk from "chalk"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./rules.js"

function charPiece(c) {
  switch (c) {
    case ".":
      return 0
    case "B":
      return BISHOP
    case "K":
      return KING
    case "N":
      return KNIGHT
    case "P":
      return PAWN
    case "Q":
      return QUEEN
    case "R":
      return ROOK
    case "b":
      return -BISHOP
    case "k":
      return -KING
    case "n":
      return -KNIGHT
    case "p":
      return -PAWN
    case "q":
      return -QUEEN
    case "r":
      return -ROOK
  }
  throw new Error(c)
}

export function decodeFEN(width, height, fen) {
  const [position, turn] = fen.split(" ")

  // board
  const board = new Int8Array(width * height)

  function put(board, x, y, piece) {
    assert(0 <= x && x < width)
    assert(0 <= y && y < height)
    assert(-6 <= piece && piece <= 6)
    board[x + y * width] = piece
  }

  // decode position
  const v = position.split("/")
  let y = height - 1
  for (let i = 0; i < v.length; i++) {
    const row = v[i]
    let x = 0
    for (let j = 0; j < row.length; ) {
      const c = row[j]
      if (isDigit(c)) {
        let k = j
        for (; k < row.length && isDigit(row[k]); k++) {}
        x += parseInt(row.substring(j, k))
        j = k
        continue
      }
      j++
      put(x, y, charPiece(c))
      x++
    }
    y--
  }

  // decode turn
  switch (turn) {
    case "b":
      turn = -1
      break
    case "w":
      turn = 1
      break
    default:
      throw new Error(turn)
  }

  return [board, turn]
}

function isDigit(c) {
  return "0" <= c && c <= "9"
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
