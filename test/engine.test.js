"use strict"
import assert from "assert"
// SORT
import * as engine from "../engine.js"
import { initialBoard } from "../rules.js"
//

describe("engine", function () {
  it("null board is a loss for white", function () {
    const width = 0
    const height = 0
    const board = initialBoard(width, height)
    engine.init(width, height, board, 1)
    const move = engine.makeMove()
    assert.strictEqual(move, null)
  })
})
