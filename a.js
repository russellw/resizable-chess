"use strict"
import chalk from "chalk"
import * as engine from "./lib/engine.js"
import * as old from "./lib/engine.js"

engine.initBoard()
console.log(engine.board)

function takeTurn(name, makeMove, notifyMove, board) {
  console.log(name)
  let start = Date.now()
  let move = makeMove()
  let t = (Date.now() - start) / 1000
  console.log(t)
  if (move === null) return false
  notifyMove(move)
  printBoard(move, board)
  return true
}

for (let i = 1; ; i++) {
  console.log(i)
  if (!takeTurn("white", engine.makeMove, old.notifyMove, engine.board)) break
  if (!takeTurn("black", old.makeMove, engine.notifyMove, engine.board)) break
}
