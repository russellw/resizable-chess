"use strict"
const assert = require("assert")
Object.assign(global, require("../lib"))

let board = emptyBoard(5, 5)
board.put(2, 4, -KING)
board.put(2, 0, KING)
for (let depth = 1; depth <= 7; depth++) {
  const start = Date.now()
  const v = movesVals(board, depth)
  assert(v.length === 5)
  const t = Date.now() - start
  console.log(`${depth}\t${t / 1000}`)
}
