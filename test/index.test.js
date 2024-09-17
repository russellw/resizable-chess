"use strict"
Object.assign(global, require("../lib"))

test("pieces are distinct", () => {
  expect(BISHOP).not.toBe(KNIGHT)
})

test("board size", () => {
  expect(initialBoard(6, 6).array.length).toBe(36)
})

test("1x4", () => {
  const board = initialBoard(1, 4)
  expect(board.at(0, 0)).toBe(KING)
  expect(board.at(0, 1)).toBe(PAWN)
  expect(board.at(0, 2)).toBe(-PAWN)
  expect(board.at(0, 3)).toBe(-KING)
  expect(moves(board)).toStrictEqual([])
})

test("1x9", () => {
  const board = initialBoard(1, 9)
  expect(board.at(0, 0)).toBe(KING)
  expect(board.at(0, 1)).toBe(PAWN)
  expect(board.at(0, 7)).toBe(-PAWN)
  expect(board.at(0, 8)).toBe(-KING)
  expect(moves(board).length).toBe(2)
})

test("8x8", () => {
  const board = initialBoard(8, 8)
  expect(board.at(0, 0)).toBe(ROOK)
  expect(board.at(1, 0)).toBe(KNIGHT)
  expect(board.at(2, 0)).toBe(BISHOP)
  expect(board.at(3, 0)).toBe(QUEEN)
  expect(board.at(4, 0)).toBe(KING)
  expect(board.at(0, 1)).toBe(PAWN)
})

test("1x5", () => {
  const a = [KING, PAWN, 0, -PAWN, -KING]
  const b = initialBoard(1, 5)
  for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b.array[i])
  expect(moves(b).length).toBe(1)
})

test("2x5", () => {
  const a = [QUEEN, KING, PAWN, PAWN, 0, 0, -PAWN, -PAWN, -QUEEN, -KING]
  const b = initialBoard(2, 5)
  for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b.array[i])
  expect(moves(b).length).toBe(2)
})

function boardEq(a, b) {
  if (a.array.length !== b.array.length) throw new Error()
  for (let i = 0; i < a.array.length; i++) if (a.array[i] !== b.array[i]) return false
  return true
}

test("boardEq", () => {
  expect(() => boardEq([0], [0, 0])).toThrow()

  const a = initialBoard(1, 5)
  const b = initialBoard(1, 5)
  expect(boardEq(a, b)).toBe(true)

  b.array[0] = QUEEN
  expect(boardEq(a, b)).toBe(false)
})

function decodeArray(v, turn = 1) {
  const width = v[0].length
  const height = v.length
  turn = turn === 1 ? "w" : "b"
  return decodeFEN(width, height, `${v.join("/")} ${turn}`)
}

test("decodeArray", () => {
  expect(() => decodeArray(["a"])).toThrow()
  expect(() => decodeArray(["p", "pp"])).toThrow()

  const v = []
  v.push("rnbqkbnr")
  v.push("pppppppp")
  v.push("........")
  v.push("........")
  v.push("........")
  v.push("........")
  v.push("PPPPPPPP")
  v.push("RNBQKBNR")
  const a = decodeArray(v)
  const b = initialBoard(8, 8)
  expect(boardEq(a, b)).toBe(true)
})

test("move", () => {
  let a = []
  a.push("k")
  a.push("p")
  a.push(".")
  a.push("P")
  a.push("K")
  a = decodeArray(a)

  let v = moves(a)
  expect(v.length).toBe(1)
  expect(v[0].turn).toBe(-1)

  let b = []
  b.push("k")
  b.push("p")
  b.push("P")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(boardEq(v[0], b)).toBe(true)
})

test("move 1x6", () => {
  let a = []
  a.push("k")
  a.push("p")
  a.push(".")
  a.push(".")
  a.push("P")
  a.push("K")
  a = decodeArray(a)

  let v = moves(a)
  expect(v.length).toBe(1)
  expect(v[0].turn).toBe(-1)

  let b = []
  b.push("k")
  b.push("p")
  b.push(".")
  b.push("P")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(boardEq(v[0], b)).toBe(true)
})

test("move 1x7", () => {
  let a = []
  a.push("k")
  a.push("p")
  a.push(".")
  a.push(".")
  a.push(".")
  a.push("P")
  a.push("K")
  a = decodeArray(a)

  let v = moves(a)
  expect(v.length).toBe(1)
  expect(v[0].turn).toBe(-1)

  let b = []
  b.push("k")
  b.push("p")
  b.push(".")
  b.push(".")
  b.push("P")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(boardEq(v[0], b)).toBe(true)
})

test("move 1x8", () => {
  let a = []
  a.push("k")
  a.push("p")
  a.push(".")
  a.push(".")
  a.push(".")
  a.push(".")
  a.push("P")
  a.push("K")
  a = decodeArray(a)

  let v = moves(a)
  expect(v.length).toBe(2)
})

test("pawn moves", () => {
  let board

  board = initialBoard(1, 4)
  expect(moves(board).length).toBe(0)

  board = initialBoard(1, 5)
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 6)
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 7)
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 8)
  expect(moves(board).length).toBe(2)

  board = initialBoard(1, 9)
  expect(moves(board).length).toBe(2)

  board = initialBoard(1, 10)
  expect(moves(board).length).toBe(3)

  board = initialBoard(1, 11)
  expect(moves(board).length).toBe(3)

  board = initialBoard(1, 12)
  expect(moves(board).length).toBe(4)

  board = initialBoard(1, 13)
  expect(moves(board).length).toBe(4)
})

test("pawn moves, other side", () => {
  let board

  board = initialBoard(1, 4)
  board.turn = -1
  expect(moves(board).length).toBe(0)

  board = initialBoard(1, 5)
  board.turn = -1
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 6)
  board.turn = -1
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 7)
  board.turn = -1
  expect(moves(board).length).toBe(1)

  board = initialBoard(1, 8)
  board.turn = -1
  expect(moves(board).length).toBe(2)

  board = initialBoard(1, 9)
  board.turn = -1
  expect(moves(board).length).toBe(2)

  board = initialBoard(1, 10)
  board.turn = -1
  expect(moves(board).length).toBe(3)

  board = initialBoard(1, 11)
  board.turn = -1
  expect(moves(board).length).toBe(3)

  board = initialBoard(1, 12)
  board.turn = -1
  expect(moves(board).length).toBe(4)

  board = initialBoard(1, 13)
  board.turn = -1
  expect(moves(board).length).toBe(4)
})

test("7x8", () => {
  const v = []
  v.push("rnbkbnr")
  v.push("ppppppp")
  v.push(".......")
  v.push(".......")
  v.push(".......")
  v.push(".......")
  v.push("PPPPPPP")
  v.push("RNBKBNR")
  const a = decodeArray(v)
  const b = initialBoard(7, 8)
  expect(boardEq(a, b)).toBe(true)
})

test("moves 8x8", () => {
  let board = initialBoard(8, 8)
  expect(moves(board).length).toBe(20)
})

test("minimax", () => {
  let b = initialBoard(1, 4)
  expect(minimax(b, 9)).toBe(-Infinity)

  b = []
  b.push("k")
  b.push(".")
  b.push("r")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(minimax(b, 9)).toBe(-Infinity)
})

describe("decodeFEN", () => {
  test("Standard 8x8 starting position", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const board = decodeFEN(8, 8, fen)

    expect(board.turn).toBe(1) // White's turn
    expect(board.array[56]).toBe(-ROOK) // Top-left square is black rook
    expect(board.array[63]).toBe(-ROOK) // Top-right square is black rook
    expect(board.array[0]).toBe(ROOK) // Bottom-left square is white rook
    expect(board.array[7]).toBe(ROOK) // Bottom-right square is white rook
  })

  test("Black's turn", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
    const board = decodeFEN(8, 8, fen)

    expect(board.turn).toBe(-1) // Black's turn
  })

  test("Arbitrary 10x10 board", () => {
    const fen = "rnbqkbnrpp/pppppppppp/10/10/10/10///PPPPPPPPPP/RNBQKBNRPP w KQkq - 0 1"
    const board = decodeFEN(10, 10, fen)

    expect(board.array.length).toBe(100) // 10x10 board should have 100 squares
    expect(board.array[0]).toBe(ROOK)
    expect(board.array[99]).toBe(-PAWN)
  })

  test("Empty board", () => {
    const fen = "8/8/8/8/8/8/8/8 w - - 0 1"
    const board = decodeFEN(8, 8, fen)

    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) expect(board.at(x, y)).toBe(0)
    expect(board.turn).toBe(1) // It should be White's turn
  })

  test("Non-standard height (5x8 board)", () => {
    const fen = "rnbqkbnr/pppppppp/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const board = decodeFEN(8, 5, fen)

    expect(board.array.length).toBe(40) // 5x8 board should have 40 squares
    expect(board.array[0]).toBe(ROOK)
    expect(board.array[39]).toBe(-ROOK)
  })
})

test("moves", () => {
  const fen = "k/1/1/1/1/1/1/1/1/K w"
  const board = decodeFEN(1, 10, fen)

  let v = moves(board, 1)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)

  v = moves(board, 2)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)

  v = moves(board, 3)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)
})

test("checkmate", () => {
  let b = []
  b.push("k...")
  b.push("....")
  b.push("....")
  b.push("RR.K")
  b = decodeArray(b)
  b.turn = -1
  expect(minimax(b, 3)).toBe(Infinity)
})

test("simple results", () => {
  for (let p of "BKNPQR.bknpqr") {
    let b = []
    b.push(p)
    b = decodeArray(b)
    expect(minimax(b, 3)).toBe(-Infinity)
  }

  let b = []
  b.push("k")
  b.push("K")
  b = decodeArray(b)
  expect(minimax(b, 3)).toBe(Infinity)

  b = []
  b.push("k")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(minimax(b, 3)).toBe(-Infinity)

  b = []
  b.push("k")
  b.push(".")
  b.push(".")
  b.push("K")
  b = decodeArray(b)
  expect(minimax(b, 10)).toBe(Infinity)

  b = initialBoard(1, 4)
  expect(minimax(b, 10)).toBe(-Infinity)

  b = initialBoard(1, 5)
  expect(minimax(b, 10)).toBe(Infinity)

  b = initialBoard(2, 2)
  expect(minimax(b, 10)).toBe(Infinity)
})

test("should disallow a complex repetition of board state (superko)", () => {
  // Initial board with both players
  const board = decodeFEN(8, 8, "8/8/8/4k3/8/8/4K3/8 w - - 0 1")

  // Move white King to F3
  let nextBoard = move(board, 4, 0, 5, 1)
  expect(nextBoard).not.toBeNull()

  // Move black King back to E5
  nextBoard = move(nextBoard, 4, 4, 5, 4)
  expect(nextBoard).not.toBeNull()

  // Move white King back
  nextBoard = move(nextBoard, 5, 1, 4, 0)
  expect(nextBoard).not.toBeNull()

  // Repeating board position with black King
  nextBoard = move(nextBoard, 5, 4, 4, 4)
  expect(nextBoard).toBeNull() // Expecting superko prevention
})

test("should allow non-repetitive moves", () => {
  const board = decodeFEN(8, 8, "8/8/8/8/8/8/4k3/4K3 w - - 0 1")

  // White King moves
  let nextBoard = move(board, 4, 0, 5, 1)
  expect(nextBoard).not.toBeNull()

  // Black King moves in a different direction
  nextBoard = move(nextBoard, 4, 1, 5, 1)
  expect(nextBoard).not.toBeNull()
})
