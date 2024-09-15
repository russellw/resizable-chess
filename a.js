"use strict"
Object.assign(global, require("./lib"))

let b = initialBoard(8, 8)
dbg(b)
let v = moves(b)
printBoard(b)
