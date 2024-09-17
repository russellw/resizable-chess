"use strict"
const assert = require("assert")
Object.assign(global, require("../lib"))

let a = initialBoard(8, 8)
const start = Date.now()
const b = bestMove(a, 5)
const t = (Date.now() - start) / 1000
const n = getNodes()
console.log(n)
console.log(t)
console.log(n / t)
printBoard(b)
