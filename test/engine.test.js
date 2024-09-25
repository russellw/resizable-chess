"use strict"
import assert from "assert"
// SORT
import * as engine from "../engine.js"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK, initialBoard } from "../rules.js"
//

describe("engine", function () {
  it("0x0 board is a loss for white", function () {
    const width = 0
    const height = 0
    const board = initialBoard(width, height)
    engine.init(width, height, board, 1)
    const move = engine.makeMove()
    assert.strictEqual(move, null)
  })

  it("1x1 board is a loss for white", function () {
    const width = 1
    const height = 1

    let board = new Int8Array([0])
    engine.init(width, height, board, 1)
    assert.strictEqual(engine.makeMove(), null)

    board = new Int8Array([KING])
    engine.init(width, height, board, 1)
    assert.strictEqual(engine.makeMove(), null)
  })
})
