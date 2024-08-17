Object.assign(global, require('../lib/chess'));

test('pieces are distinct', () => {
  expect(BISHOP).not.toBe(KNIGHT);
});
test('board size', () => {
  expect(initialBoard(6, 6).length).toBe(36);
});
test('minimum width', () => {
  expect(() => initialBoard(0, 6)).toThrow();
});
test('minimum height', () => {
  expect(() => initialBoard(6, 2)).toThrow();
});
test('1x4', () => {
  var board = initialBoard(1, 4)
  expect(get(board, 0, 0)).toBe(KING);
  expect(get(board, 0, 1)).toBe(PAWN);
  expect(get(board, 0, 2)).toBe(-PAWN);
  expect(get(board, 0, 3)).toBe(-KING);
  expect(validMoves(board)).toStrictEqual([]);
});
test('1x4 pawnless', () => {
  var board = blankBoard(1, 4)
  put(board, 0, 0, KING)
  put(board, 0, 3, -KING)
  expect(validMoves(board).length).toBe(1);
});
test('staticVal decreases if you delete a rook', () => {
  var board = initialBoard(8, 8)
  var a = staticVal(board)
  put(board, 0, 0, 0)
  var b = staticVal(board)
  expect(a).toBeGreaterThan(b);
});
