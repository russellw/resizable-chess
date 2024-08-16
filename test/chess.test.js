Object.assign(global, require('../lib/chess'));

test('pieces are distinct', () => {
  expect(BISHOP).not.toBe(KNIGHT);
});
test('board size', () => {
  expect(initialBoard(6,6)).length.toBe(36);
});
