"use strict"
import chalk from "chalk"
// SORT
import * as common from "./lib/common.js"
import * as engine from "./lib/engine.js"
import * as old from "./lib/old.js"
//

const width = 2
const height = 3
let v = []
v.push("k.")
v.push("")
v.push("K.")
const board = common.decodeArray(width, height, v)
engine.init(width, height, board, 1)
old.init(width, height, board, -1)

function takeTurn(name, makeMove) {
  console.log(name)
  let start = Date.now()
  let move = makeMove()
  let t = (Date.now() - start) / 1000
  console.log(t)
  if (move === null) return false
  common.printMove(width, move, board)
  common.printBoard(width, height, board)
  console.log(move.val)
  return true
}

for (let i = 1; i <= 2; i++) {
  console.log(i)
  if (!takeTurn("white", engine.makeMove)) {
    console.log("*** black wins ***")
    break
  }
  if (!takeTurn("black", old.makeMove)) {
    console.log("*** white wins ***")
    break
  }
  console.log()
}
