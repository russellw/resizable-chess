"use strict"
Object.assign(global, require("./lib"))

let a = initialBoard(4, 4)
printBoard(a)

tron()
for (let i = 1; i <= 2; i++) {
  dbg(i)
  let b = bestMove(a, i)
  dbg(i)
  printBoard(b)
}
