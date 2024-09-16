"use strict"
Object.assign(global, require("./lib"))

let b = initialBoard(8, 8)
console.log(b.str())
