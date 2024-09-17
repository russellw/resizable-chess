"use strict"
Object.assign(global, require("./lib"))

tron()

let a = initialBoard(4, 4)
let b = bestMove(a, 1)
