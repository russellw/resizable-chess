"use strict"
import assert from "assert"

export const BISHOP = 1
export const KING = 2
export const KNIGHT = 3
export const PAWN = 4
export const QUEEN = 5
export const ROOK = 6

export function initialBoard(width, height, pawns = 1) {
  const board = new Int8Array(width * height)
  if (height < 2) return board

  function put(x, y, piece) {
    board[x + y * width] = piece
  }

  // pawns
  pawns = Math.min((height >> 1) - 1, pawns)
  for (let i = 0; i < pawns; i++) {
    const y = 1 + i
    const y1 = height - 2 - i
    for (let x = 0; x < width; x++) {
      put(x, y, PAWN)
      put(x, y1, -PAWN)
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
