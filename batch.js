"use strict"
Object.assign(global, require("./lib"))

for (let i = 1; i <= 16; i++) {
  let board = initialBoard(i, 4)
  printBoard(board)
}
