"use strict"
Object.assign(global, require("./lib"))

let b = new Board(8, 8)
dbg(b)
dbg(b.at(2, 3))
