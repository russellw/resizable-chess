"use strict"
Object.assign(global, require("./lib"))

let a = initialBoard(3, 3)
printBoard(a)

for (let i = 1; i < 10; i++) {
  console.log(i)
  let b = bestMove(a, i)
  printBoard(b)
}
