"use strict"
Object.assign(global, require("./lib"))

let b = initialBoard(8, 8)
dbg(b)
dbg(b.at(7, 7))
