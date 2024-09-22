"use strict"
import chalk from "chalk"
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK, Engine,initialBoard } from "./lib/engine.js"

let a = initialBoard(16, 16)
console.log(a)

// print text with different colors
console.log(chalk.blue("This text is blue!"))
console.log(chalk.red("This text is red!"))
console.log(chalk.green("This text is green!"))

// you can also combine styles
console.log(chalk.bold.yellow("This text is bold and yellow!"))
console.log(chalk.bgCyan.black("This text has a cyan background and black text!"))
