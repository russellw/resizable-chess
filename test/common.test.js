"use strict"
import assert from "assert"
// SORT
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "../rules.js"
import { decodeFEN, decodeArray } from "../common.js"
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

describe("decodeFEN - smaller boards", function () {
  it("should decode a 4x4 board with pieces and white to move", function () {
    const [board, turn] = decodeFEN(4, 4, "r3/3p/2P1/2k1 w")

    const expectedBoard = new Int8Array(4 * 4)
    expectedBoard[12] = -ROOK // r
    expectedBoard[11] = -PAWN // p
    expectedBoard[6] = PAWN // P
    expectedBoard[2] = -KING // k

    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, 1) // White's turn
  })

  it("should decode a 4x4 board with pieces and black to move", function () {
    const [board, turn] = decodeFEN(4, 4, "4/2n1/1P2/2K1 b")

    const expectedBoard = new Int8Array(4 * 4)
    expectedBoard[10] = -KNIGHT // n
    expectedBoard[5] = PAWN // P
    expectedBoard[2] = KING // K

    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, -1) // Black's turn
  })

  it("should decode a 2x2 board with pieces and white to move", function () {
    const [board, turn] = decodeFEN(2, 2, "k1/1P w")

    const expectedBoard = new Int8Array(2 * 2)
    expectedBoard[2] = -KING // k
    expectedBoard[1] = PAWN // P

    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, 1) // White's turn
  })

  it("should decode a 3x3 board with both players having pieces", function () {
    const [board, turn] = decodeFEN(3, 3, "q2/1k1/2B w")

    const expectedBoard = new Int8Array(3 * 3)
    expectedBoard[6] = -QUEEN // q
    expectedBoard[4] = -KING // k
    expectedBoard[2] = BISHOP // B

    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, 1) // White's turn
  })

  it("should decode an empty 3x3 board with black to move", function () {
    const [board, turn] = decodeFEN(3, 3, "3/3/3 b")

    const expectedBoard = new Int8Array(3 * 3) // Empty board
    assert.deepStrictEqual(board, expectedBoard)
    assert.strictEqual(turn, -1) // Black's turn
  })
})

describe("decodeArray", function () {
  it("should decode a 2x2 array into a board position", function () {
    const board = decodeArray(["k1", "1P"])

    const expectedBoard = new Int8Array(2 * 2)
    expectedBoard[2] = -KING // k at the bottom left
    expectedBoard[1] = PAWN // P at the top right

    assert.deepStrictEqual(board, expectedBoard)
  })

  it("should decode a 3x3 array into a board position", function () {
    const board = decodeArray(["q..", "1k1", "2B"])

    const expectedBoard = new Int8Array(3 * 3)
    expectedBoard[6] = -QUEEN // q at the top left
    expectedBoard[4] = -KING // k in the middle
    expectedBoard[2] = BISHOP // B at the bottom right

    assert.deepStrictEqual(board, expectedBoard)
  })

  it("should decode a 4x4 array with mixed pieces", function () {
    const board = decodeArray(["r...", "3p", "2P1", "2k1"])

    const expectedBoard = new Int8Array(4 * 4)
    expectedBoard[12] = -ROOK // r at top left
    expectedBoard[11] = -PAWN // p at second row, last position
    expectedBoard[6] = PAWN // P at third row, third position
    expectedBoard[2] = -KING // k at fourth row, third position

    assert.deepStrictEqual(board, expectedBoard)
  })

  it("should decode an empty 3x3 array into a board position", function () {
    const board = decodeArray(["...", "...", "..."])

    const expectedBoard = new Int8Array(3 * 3) // Empty board
    assert.deepStrictEqual(board, expectedBoard)
  })

  it("should decode a 4x4 array with only kings", function () {
    const board = decodeArray(["2k1", "....", "1K2", "4"])

    const expectedBoard = new Int8Array(4 * 4)
    expectedBoard[14] = -KING // k at the top row, third column
    expectedBoard[5] = KING // K at third row, second column

    assert.deepStrictEqual(board, expectedBoard)
  })
})
