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
  expect(get(board, 3, 0)).toBe(QUEEN)
  expect(get(board, 4, 0)).toBe(KING)
  expect(get(board, 0, 1)).toBe(PAWN)
})

test("1x5", () => {
  const a = [KING, PAWN, 0, -PAWN, -KING]
  const b = initialBoard(1, 5)
  for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b[i])
  expect(validMoves(b).length).toBe(1)
})

test("2x5", () => {
  const a = [QUEEN, KING, PAWN, PAWN, 0, 0, -PAWN, -PAWN, -QUEEN, -KING]
  const b = initialBoard(2, 5)
  for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b[i])
  expect(validMoves(b).length).toBe(2)
})

function isAlpha(c) {
  if (c.length != 1) throw new Error(c)
  const rx = /[a-zA-Z]/
  return rx.test(c)
}

test("isAlpha", () => {
  expect(isAlpha("a")).toBe(true)
  expect(isAlpha("z")).toBe(true)
  expect(isAlpha("A")).toBe(true)
  expect(isAlpha("Z")).toBe(true)
  expect(isAlpha("0")).toBe(false)
  expect(isAlpha("9")).toBe(false)
  expect(() => isAlpha("")).toThrow()
  expect(() => isAlpha("..")).toThrow()
})

function isLowerCase(c) {
  if (c.length != 1) throw new Error(c)
  const rx = /[a-z]/
  return rx.test(c)
}

test("isLowerCase", () => {
  expect(isLowerCase("a")).toBe(true)
  expect(isLowerCase("z")).toBe(true)
  expect(isLowerCase("A")).toBe(false)
  expect(isLowerCase("Z")).toBe(false)
  expect(isLowerCase("0")).toBe(false)
  expect(isLowerCase("9")).toBe(false)
  expect(() => isLowerCase("")).toThrow()
  expect(() => isLowerCase("..")).toThrow()
})

function isUpperCase(c) {
  if (c.length != 1) throw new Error(c)
  const rx = /[A-Z]/
  return rx.test(c)
}

test("isUpperCase", () => {
  expect(isUpperCase("a")).toBe(false)
  expect(isUpperCase("z")).toBe(false)
  expect(isUpperCase("A")).toBe(true)
  expect(isUpperCase("Z")).toBe(true)
  expect(isUpperCase("0")).toBe(false)
  expect(isUpperCase("9")).toBe(false)
  expect(() => isUpperCase("")).toThrow()
  expect(() => isUpperCase("..")).toThrow()
})

function charPiece(c) {
  if (!isAlpha(c)) return 0
  let minus = false
  if (isLowerCase(c)) {
    c = c.toUpperCase()
    minus = true
  }
  let piece
  switch (c) {
    case "K":
      piece = KING
      break
    case "Q":
      piece = QUEEN
      break
    case "R":
      piece = ROOK
      break
    case "B":
      piece = BISHOP
      break
    case "N":
      piece = KNIGHT
      break
    case "P":
      piece = PAWN
      break
    default:
      throw new Error(c)
  }
  if (minus) return -piece
  return piece
}

test("charPiece", () => {
  expect(charPiece(" ")).toBe(0)
  expect(charPiece(".")).toBe(0)
  expect(charPiece("b")).toBe(-BISHOP)
  expect(charPiece("B")).toBe(BISHOP)
  expect(() => charPiece("")).toThrow()
  expect(() => charPiece("z")).toThrow()
})

function boardEq(a, b) {
  if (a.length != b.length) throw new Error()
  for (let i = 0; i < a.length; i++) if (a[i] != b[i]) return false
  return true
}

test("boardEq", () => {
  expect(() => boardEq([0], [0, 0])).toThrow()

  const a = [KING, PAWN, 0, -PAWN, -KING]
  const b = initialBoard(1, 5)
  expect(boardEq(a, b)).toBe(true)

  b[0] = QUEEN
  expect(boardEq(a, b)).toBe(false)
})

function stringsBoard(v) {
  const width = v[0].length
  const height = v.length
  const board = blankBoard(width, height)
  for (let y = 0; y < height; y++) {
    if (v[y].length != width) throw new Error(v[y])
    for (let x = 0; x < width; x++)
      put(board, x, height - 1 - y, charPiece(v[y][x]))
  }
  return board
}

test("stringsBoard", () => {
  expect(() => stringsBoard([""])).toThrow()
  expect(() => stringsBoard(["a"])).toThrow()
  expect(() => stringsBoard(["p", "pp"])).toThrow()

  const v = []
  v.push("rnbqkbnr")
  v.push("pppppppp")
  v.push("........")
  v.push("........")
  v.push("........")
  v.push("........")
  v.push("PPPPPPPP")
  v.push("RNBQKBNR")
  const a = stringsBoard(v)
  const b = initialBoard(8, 8)
  expect(boardEq(a, b)).toBe(true)
})
