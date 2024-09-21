"use strict"
const assert = require("assert")
const old = require("./old")
Object.assign(global, require("../lib"))

let a = initialBoard(6, 6)

function playMove(name, bestMove) {
  console.log(name)
  let start = Date.now()
  a = bestMove(a, 8)
  let t = (Date.now() - start) / 1000
  const n = getNodes()
  console.log(n)
  console.log(t)
  console.log(n / t)
  if (a === null) {
    console.log("loses")
    process.exit(0)
  }
  printBoard(a)
  console.log(a.val)
  console.log()
}

for (let i = 1; ; i++) {
  console.log(i)
  console.log()
  playMove("new (white)", bestMove)
  playMove("old (black)", old.bestMove)
}
