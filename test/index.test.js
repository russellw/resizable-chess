"use strict"
Object.assign(global, require("../lib"))

test("pieces are distinct", () => {
  expect(BISHOP).not.toBe(KNIGHT)
})

test("board size", () => {
  expect(initialBoard(6, 6).array.length).toBe(36)
})

test("minimum width", () => {
  expect(() => initialBoard(0, 6)).toThrow()
})

test("minimum height", () => {
  expect(() => initialBoard(6, 2)).toThrow()
})

test("1x4", () => {
  const board = initialBoard(1, 4)
  expect(board.at(0, 0)).toBe(KING)
  expect(board.at(0, 1)).toBe(PAWN)
  expect(board.at(0, 2)).toBe(-PAWN)
  expect(board.at(0, 3)).toBe(-KING)
  expect(moves(board)).toStrictEqual([])
})

test("1x4 pawnless", () => {
  const board = emptyBoard(1, 4)
  board.put(0, 0, KING)
  board.put(0, 3, -KING)
  expect(moves(board).length).toBe(1)
})

test("staticVal decreases if you delete a rook", () => {
  const board = initialBoard(8, 8)
  const a = staticVal(board)
  board.put(0, 0, 0)
  const b = staticVal(board)
  expect(a).toBeGreaterThan(b)
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

function isAlpha(c) {
  if (c.length !== 1) throw new Error(c)
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
  if (c.length !== 1) throw new Error(c)
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
  if (c.length !== 1) throw new Error(c)
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

function stringsBoard(v) {
  const width = v[0].length
  const height = v.length
  const board = emptyBoard(width, height)
  for (let y = 0; y < height; y++) {
    if (v[y].length !== width) throw new Error(v[y])
    for (let x = 0; x < width; x++) board.put(x, height - 1 - y, charPiece(v[y][x]))
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

test("move", () => {
  let a = []
  a.push("k")
  a.push("p")
  a.push(".")
  a.push("P")
  a.push("K")
  a = stringsBoard(a)

  let v = moves(a)
  expect(v.length).toBe(1)
  expect(v[0].turn).toBe(-1)

  let b = []
  b.push("k")
  b.push("p")
  b.push("P")
  b.push(".")
  b.push("K")
  b = stringsBoard(b)
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
  a = stringsBoard(a)

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
  b = stringsBoard(b)
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
  a = stringsBoard(a)

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
  b = stringsBoard(b)
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
  a = stringsBoard(a)

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
  const a = stringsBoard(v)
  const b = initialBoard(7, 8)
  expect(boardEq(a, b)).toBe(true)
})

test("moves 8x8", () => {
  let board = initialBoard(8, 8)
  verify(board)
  expect(moves(board).length).toBe(20)
})

test("check", () => {
  let b = initialBoard(8, 8)
  expect(check(b, 1)).toBe(false)
  expect(check(b, -1)).toBe(false)

  b = []
  b.push("...k")
  b.push(".n..")
  b.push("....")
  b.push("K...")
  b = stringsBoard(b)
  expect(check(b, 1)).toBe(true)
  expect(check(b, -1)).toBe(false)

  b = []
  b.push("....")
  b.push("....")
  b.push("..k.")
  b.push("...K")
  b = stringsBoard(b)
  expect(check(b, 1)).toBe(true)
  expect(check(b, -1)).toBe(true)

  b = []
  b.push(".k.K")
  b.push("....")
  b.push("....")
  b.push("q...")
  b = stringsBoard(b)
  expect(check(b, 1)).toBe(true)
  expect(check(b, -1)).toBe(false)

  b = []
  b.push(".k.K")
  b.push("....")
  b.push("....")
  b.push("...r")
  b = stringsBoard(b)
  expect(check(b, 1)).toBe(true)
  expect(check(b, -1)).toBe(false)

  b = initialBoard(1, 3)
  expect(check(b, 1)).toBe(false)
  expect(check(b, -1)).toBe(false)
  expect(moves(b).length).toBe(0)
})

function possibleCheck(v) {
  for (const b of v) if (b.check) return true
  return false
}

test("check moves", () => {
  let b = []
  b.push("...k")
  b.push("....")
  b.push("....")
  b.push("KR..")
  b = stringsBoard(b)
  let v = moves(b)
  expect(possibleCheck(v)).toBe(true)

  b = []
  b.push("...k")
  b.push("....")
  b.push("....")
  b.push("KB..")
  b = stringsBoard(b)
  v = moves(b)
  expect(possibleCheck(v)).toBe(false)
})

test("minimax", () => {
  let b = initialBoard(1, 3)
  expect(minimax(b, 9)).toBe(0)

  b = []
  b.push("k")
  b.push(".")
  b.push("r")
  b.push(".")
  b.push("K")
  b = stringsBoard(b)
  b.check = true
  expect(minimax(b, 9)).toBe(-Infinity)
})

function decodeFEN(fen, width, height) {
  const [position, turn] = fen.split(" ")
  const rows = position.split("/")

  let board = emptyBoard(width, height)

  // Map FEN piece characters to values
  const pieceMap = {
    P: PAWN,
    N: KNIGHT,
    B: BISHOP,
    R: ROOK,
    Q: QUEEN,
    K: KING,
    p: -PAWN,
    n: -KNIGHT,
    b: -BISHOP,
    r: -ROOK,
    q: -QUEEN,
    k: -KING,
  }

  // Fill the board based on FEN notation
  let y = height - 1
  for (let row of rows) {
    let x = 0
    for (let char of row) {
      if (char >= "1" && char <= "9") {
        // Handle empty squares
        x += parseInt(char, 10)
      } else {
        // Map the piece character to the board
        if (!(0 <= x && x < width)) throw new Error(x)
        if (!(0 <= y && y < height)) throw new Error(y)
        board.put(x, y, pieceMap[char])
        x++
      }
    }
    y--
  }

  // Determine whose turn it is (1 for white, -1 for black)
  board.turn = turn === "w" ? 1 : -1

  return board
}

describe("decodeFEN", () => {
  test("Standard 8x8 starting position", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const board = decodeFEN(fen, 8, 8)

    expect(board.turn).toBe(1) // White's turn
    expect(board.array[56]).toBe(-ROOK) // Top-left square is black rook
    expect(board.array[63]).toBe(-ROOK) // Top-right square is black rook
    expect(board.array[0]).toBe(ROOK) // Bottom-left square is white rook
    expect(board.array[7]).toBe(ROOK) // Bottom-right square is white rook
  })

  test("Black's turn", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
    const board = decodeFEN(fen, 8, 8)

    expect(board.turn).toBe(-1) // Black's turn
  })

  test("Arbitrary 10x10 board", () => {
    const fen = "rnbqkbnrpp/pppppppppp/10/10/10/10///PPPPPPPPPP/RNBQKBNRPP w KQkq - 0 1"
    const board = decodeFEN(fen, 10, 10)

    expect(board.array.length).toBe(100) // 10x10 board should have 100 squares
    expect(board.array[0]).toBe(ROOK)
    expect(board.array[99]).toBe(-PAWN)
  })

  test("Empty board", () => {
    const fen = "8/8/8/8/8/8/8/8 w - - 0 1"
    const board = decodeFEN(fen, 8, 8)

    const empty = emptyBoard(8, 8)
    expect(boardEq(board, empty)).toBe(true)
    expect(board.turn).toBe(1) // It should be White's turn
  })

  test("Non-standard height (5x8 board)", () => {
    const fen = "rnbqkbnr/pppppppp/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const board = decodeFEN(fen, 8, 5)

    expect(board.array.length).toBe(40) // 5x8 board should have 40 squares
    expect(board.array[0]).toBe(ROOK)
    expect(board.array[39]).toBe(-ROOK)
  })
})

test("movesVals", () => {
  const fen = "k/1/1/1/1/1/1/1/1/K w"
  const board = decodeFEN(fen, 1, 10)

  let v = movesVals(board, 1)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)

  v = movesVals(board, 2)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)

  v = movesVals(board, 3)
  expect(v.length).toBe(1)
  expect(v[0].val).toBe(0)
})

test("valid", () => {
  let b = []
  b.push("k")
  b.push("p")
  b.push("P")
  b.push(".")
  b.push("K")
  b = stringsBoard(b)
  expect(valid(b)).toBe(true)

  b = []
  b.push("r")
  b.push("p")
  b.push("P")
  b.push(".")
  b.push("K")
  b = stringsBoard(b)
  expect(valid(b)).toBe(false)
})

test("Can't make a move that leaves you in check", () => {
  let b = []
  b.push("Rkr")
  b.push("...")
  b.push(".KR")
  b = stringsBoard(b)
  b.turn = -1
  expect(valid(b)).toBe(true)

  const v = moves(b)
  expect(v.length).toBe(1)
})
