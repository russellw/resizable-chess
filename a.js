"use strict"
import chalk from "chalk"

// print text with different colors
console.log(chalk.blue("This text is blue!"))
console.log(chalk.red("This text is red!"))
console.log(chalk.green("This text is green!"))

// you can also combine styles
console.log(chalk.bold.yellow("This text is bold and yellow!"))
console.log(chalk.bgCyan.black("This text has a cyan background and black text!"))
