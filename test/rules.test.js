"use strict"
import assert from "assert"
import { initialBoard, PAWN, KING, QUEEN, ROOK, BISHOP, KNIGHT } from "../rules.js"

describe("initialBoard", function () {
  it("should create an empty board when height is less than 2", function () {
    const board = initialBoard(8, 1)
    assert.strictEqual(board.length, 8)
    assert.ok(board.every((v) => v === 0))
  })

  it("should place pawns in the correct positions", function () {
    const width = 8,
      height = 8
    const board = initialBoard(width, height, 1)
    for (let x = 0; x < width; x++) {
      assert.strictEqual(board[x + width], PAWN) // row 1 (pawns)
      assert.strictEqual(board[x + width * (height - 2)], -PAWN) // second-last row (opponent pawns)
    }
  })

  it("should place the queen in the middle", function () {
    const board = initialBoard(8, 8)
    const queenIndex = 3 // (8 - 1) >> 1
    assert.strictEqual(board[queenIndex], QUEEN)
  })

  it("should place the king on the central column", function () {
    const board = initialBoard(8, 8)
    const kingIndex = 4 // 8 >> 1
    assert.strictEqual(board[kingIndex], KING)
  })

  it("should place rooks, knights correctly on a 6x6 board", function () {
    const board = initialBoard(6, 6)
    // expected setup for a 6x6 (Los Alamos style): Rooks, Knights

    // rooks should be at both ends
    assert.strictEqual(board[0], ROOK)
    assert.strictEqual(board[5], ROOK)

    // knights next
    assert.strictEqual(board[1], KNIGHT)
    assert.strictEqual(board[4], KNIGHT)
  })

  it("should place mirrored pieces for the opponent", function () {
    const width = 8,
      height = 8
    const board = initialBoard(width, height)
    const lastRow = height - 1
    for (let x = 0; x < width; x++) {
      assert.strictEqual(board[x + lastRow * width], -board[x]) // mirrored opponent setup
    }
  })
})
