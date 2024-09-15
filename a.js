"use strict"
Object.assign(global, require("./lib"))

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

function printBoard(board) {
  // Separator
  for (let x = 0; x < board.width; x++) process.stdout.write("--")
  process.stdout.write("\n")

  // Board
  for (let y = board.height; y--; ) {
    for (let x = 0; x < board.width; x++) {
      process.stdout.write(" ")
      process.stdout.write(pieceChar(board.at(x, y)))
    }
    process.stdout.write("\n")
  }
}

let b = initialBoard(8, 8)
dbg(b)
printBoard(b)
