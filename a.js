"use strict"
Object.assign(global, require("./lib"))

let v

v = []
v.push("k")
v.push("K")
v.push(".")
let a = decodeArray(v)

let b = bestMove(a, 5)
printBoard(b)
