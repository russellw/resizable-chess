"use strict"
import assert from "assert"
// SORT
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "../rules.js"
import { decodeFEN } from "../common.js"
//

describe("decodeFEN", function () {
  it("should decode a simple FEN for a standard 8x8 chess board", function () {
    const [board, turn] = decodeFEN(8, 8, "8/8/8/8/8/8/8/8 w")

    const expectedBoard = new Int8Array(8 * 8) // Empty board
    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, 1) // White's turn
  })

  it("should decode FEN with pieces for a standard back row", function () {
    const [board, turn] = decodeFEN(8, 1, "rnbqkbnr w")

    const expectedBoard = new Int8Array(8)
    // fill expectedBoard with appropriate piece values
    expectedBoard[0] = -ROOK
    expectedBoard[1] = -KNIGHT
    expectedBoard[2] = -BISHOP
    expectedBoard[3] = -QUEEN
    expectedBoard[4] = -KING
    expectedBoard[5] = -BISHOP
    expectedBoard[6] = -KNIGHT
    expectedBoard[7] = -ROOK

    // check if board matches expected layout
    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, 1) // White's turn
  })

  it("should decode FEN with black to move", function () {
    const [board, turn] = decodeFEN(8, 8, "8/8/8/8/8/8/8/8 b")

    const expectedBoard = new Int8Array(8 * 8) // Empty board
    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, -1) // Black's turn
  })

  it("should throw an error for invalid turn character", function () {
    assert.throws(() => {
      decodeFEN(8, 8, "8/8/8/8/8/8/8/8 x")
    }, Error)
  })
})
