"use strict"
import chalk from "chalk"
import * as engine from "./lib/engine.js"

engine.initBoard()
console.log(board)
let white = new Engine(board, 1, "white")
let black = new Engine(board, -1, "black")

function takeTurn(player, opponent) {
  console.log(player.name)
  let start = Date.now()
  let move = player.makeMove()
  let t = (Date.now() - start) / 1000
  console.log(t)
  if (move === null) return false
  putMove(move, board)
  printBoard(move, board)
  opponent.notifyMove(move)
  return true
}

for (let i = 1; ; i++) {
  console.log(i)
  if (!takeTurn(white, black)) break
  if (!takeTurn(black, white)) break
}
