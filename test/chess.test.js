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
