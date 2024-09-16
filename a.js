"use strict"
Object.assign(global, require("./lib"))

let b = initialBoard(4, 4)
minimax(b, 2)
