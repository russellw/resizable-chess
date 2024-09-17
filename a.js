"use strict"
Object.assign(global, require("./lib"))

let v

v = []
v.push("qk")
v.push("QK")
let a = decodeArray(v)
printBoard(a)

let b = bestMove(a, 5)
printBoard(b)
