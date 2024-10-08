"use strict"
import assert from "assert"
// SORT
import * as engine from "../lib/engine.js"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK, initialBoard } from "../lib/rules.js"
import { decodeArray } from "../lib/common.js"
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

    board = new Int8Array([-KING])
    engine.init(width, height, board, 1)
    assert.strictEqual(engine.makeMove(), null)
  })

  it("1x2 board is a win for white", function () {
    const width = 1
    const height = 2
    let v = []
    v.push("k")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, -KING)
  })

  it("1x3 board is a win for black", function () {
    const width = 1
    const height = 3
    let v = []
    v.push("k")
    v.push(".")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, -Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, 0)
  })

  it("1x4 pawnless is a win for white", function () {
    const width = 1
    const height = 4
    let v = []
    v.push("k")
    v.push(".")
    v.push(".")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, 0)
  })

  it("1x4 pawnful is a loss for white", function () {
    const width = 1
    const height = 4
    let v = []
    v.push("k")
    v.push("p")
    v.push("P")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move, null)
  })

  it("1x5 pawnless is a win for black", function () {
    const width = 1
    const height = 5
    let v = []
    v.push("k")
    v.push(".")
    v.push(".")
    v.push(".")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, -Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, 0)
  })

  it("1x5 pawnful is a loss for black", function () {
    const width = 1
    const height = 5
    let v = []
    v.push("k")
    v.push("p")
    v.push(".")
    v.push("P")
    v.push("K")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 1)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 2)
    assert.strictEqual(move.piece, PAWN)
    assert.strictEqual(move.target, 0)
  })

  it("2x2 board is a win for white", function () {
    const width = 2
    const height = 2

    let v = []
    v.push("k.")
    v.push("K.")
    let board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    let move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 0)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, -KING)

    v = []
    v.push(".k")
    v.push(".K")
    board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 1)
    assert.strictEqual(move.y, 0)
    assert.strictEqual(move.x1, 1)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, -KING)

    v = []
    v.push(".K")
    v.push(".k")
    board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x, 1)
    assert.strictEqual(move.y, 1)
    assert.strictEqual(move.x1, 1)
    assert.strictEqual(move.y1, 0)
    assert.strictEqual(move.piece, KING)
    assert.strictEqual(move.target, -KING)

    v = []
    v.push("kq")
    v.push("KQ")
    board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x1, 0)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.target, -KING)

    v = []
    v.push("qk")
    v.push("QK")
    board = decodeArray(width, height, v)
    engine.init(width, height, board, 1)
    move = engine.makeMove()
    assert.strictEqual(move.val, Infinity)
    assert.strictEqual(move.x1, 1)
    assert.strictEqual(move.y1, 1)
    assert.strictEqual(move.target, -KING)
  })
})
