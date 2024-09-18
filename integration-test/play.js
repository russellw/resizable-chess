"use strict"
const assert = require("assert")
Object.assign(global, require("../lib"))

let a = initialBoard(5, 5)
for (let i = 1; ; i++) {
  printBoard(a)
  const start = Date.now()
  const b = bestMove(a, 8)
  if (b === null) {
    const color = a.turn < 0 ? "white" : "black"
    console.log(`${color} wins`)
    break
  }
  a = b
  const t = (Date.now() - start) / 1000
  const n = getNodes()
  console.log(i)
  console.log(n)
  console.log(t)
  console.log(n / t)
  console.log(a.val)
}
