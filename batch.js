Object.assign(global, require('./lib'));

for (var i = 1; i <= 16; i++) {
  board = initialBoard(i, 4)
  printBoard(board)
}
