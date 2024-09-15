"use strict"
const assert = require("assert")
Object.assign(global, require("../lib"))

let board = initialBoard(1, 5)
for (let depth = 1; depth <= 10; depth++) {
  const start = Date.now()
  const v = movesVals(board, depth)
  assert(v.length === 1)
  const t = Date.now() - start
  console.log(`${depth}\t${t / 1000}`)
}
