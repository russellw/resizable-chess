"use strict"
import chalk from "chalk"
// SORT
import * as common from "./common.js"
import * as engine from "./engine.js"
import * as old from "./engine.js"
import { initialBoard } from "./rules.js"
//

const width = 10
const height = 10
const board = initialBoard(width, height)
console.log(board)
engine.init(width, height, board, 1)

function takeTurn(name, makeMove) {
  console.log(name)
  let start = Date.now()
  let move = makeMove()
  let t = (Date.now() - start) / 1000
  console.log(t)
  if (move === null) return false
  common.printMove(width, move, board)
  common.printBoard(board)
  return true
}

for (let i = 1; ; i++) {
  console.log(i)
  if (!takeTurn("white", engine.makeMove)) break
  if (!takeTurn("black", old.makeMove)) break
}
