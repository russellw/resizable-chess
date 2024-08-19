"use strict"
Object.assign(global, require("../lib"))

test("pieces are distinct", () => {
  expect(BISHOP).not.toBe(KNIGHT)
})

test("board size", () => {
  expect(initialBoard(6, 6).length).toBe(36)
})

test("minimum width", () => {
  expect(() => initialBoard(0, 6)).toThrow()
})

test("minimum height", () => {
  expect(() => initialBoard(6, 2)).toThrow()
})

test("1x4", () => {
  const board = initialBoard(1, 4)
  expect(get(board, 0, 0)).toBe(KING)
  expect(get(board, 0, 1)).toBe(PAWN)
  expect(get(board, 0, 2)).toBe(-PAWN)
  expect(get(board, 0, 3)).toBe(-KING)
  expect(validMoves(board)).toStrictEqual([])
})

test("1x4 pawnless", () => {
  const board = blankBoard(1, 4)
  put(board, 0, 0, KING)
  put(board, 0, 3, -KING)
  expect(validMoves(board).length).toBe(1)
})

test("staticVal decreases if you delete a rook", () => {
  const board = initialBoard(8, 8)
  const a = staticVal(board)
  put(board, 0, 0, 0)
  const b = staticVal(board)
  expect(a).toBeGreaterThan(b)
})

test("1x9", () => {
  const board = initialBoard(1, 9)
  expect(get(board, 0, 0)).toBe(KING)
  expect(get(board, 0, 1)).toBe(PAWN)
  expect(get(board, 0, 7)).toBe(-PAWN)
  expect(get(board, 0, 8)).toBe(-KING)
  expect(validMoves(board).length).toBe(1)
})

test("8x8", () => {
  const board = initialBoard(8, 8)
  expect(get(board, 0, 0)).toBe(ROOK)
  expect(get(board, 1, 0)).toBe(KNIGHT)
  expect(get(board, 2, 0)).toBe(BISHOP)
  expect(get(board, 0, 1)).toBe(PAWN)
})

test("1x5", () => {
  const a = [KING, PAWN, 0, -PAWN, -KING]
  const b = initialBoard(1, 5)
  for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b[i])
  expect(validMoves(b).length).toBe(1)
})
