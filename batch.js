"use strict"
Object.assign(global, require("./lib"))

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
process.stdout.write(fen)
process.stdout.write("\n")

const result = decodeFEN(fen, 8, 8)
dbg(result)
printBoard(result)
