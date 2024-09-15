"use strict"
Object.assign(global, require("./lib"))

let b = initialBoard(3, 3)
minimax(b, 0)
printTree(b)
