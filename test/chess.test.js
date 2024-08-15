Object.assign(global, require('../lib/chess'));

test('pieces are distinct', () => {
  expect(BISHOP).not.toBe(KNIGHT);
});
