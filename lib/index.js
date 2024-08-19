"use strict"

const KING = 1
const QUEEN = 2
const ROOK = 3
const BISHOP = 4
const KNIGHT = 5
const PAWN = 6

function pack(x, y, x1, y1) {
  return (x << 24) | (y << 16) | (x1 << 8) | y1
}

function move(board, m) {
  const width = board.width
  const height = board.height

  const x = (m >> 24) & 0xff
  const y = (m >> 16) & 0xff
  const x1 = (m >> 8) & 0xff
  const y1 = m & 0xff

  const b = blankBoard(width, height)
  b.turn = -board.turn
  for (let Y = 0; Y < height; Y++)
    for (let X = 0; X < width; X++) {
      //If this is where we are moving from
      //then leave the corresponding square on the new board empty
      if (Y == y && X == x) continue

      //If this is where we are moving to
      //then the piece comes from the square we are moving from
      let piece
      if (Y == y1 && X == x1) {
        piece = get(board, x, y)
        switch (piece) {
          case PAWN:
            if (y1 == height - 1) piece = QUEEN
            break
          case -PAWN:
            if (y1 == 0) piece = -QUEEN
            break
        }
      } else piece = get(board, X, Y)

      put(b, X, Y, piece)
    }
  return b
}

function validMoves(board) {
  const width = board.width
  const height = board.height
  const turn = board.turn
  const v = []

  function add(x1, y1) {
    // outside the board
    if (!(0 <= x1 && x1 < width && 0 <= y1 && y1 < height)) return false

    // onto own piece (including null move)
    if (get(board, x1, y1) * turn > 0) return false

    // valid move
    v.push(pack(x, y, x1, y1))
    return true
  }

  function pawn() {
    const x1 = x
    let y1 = y
    if (turn >= 0) {
      //Usually pawns can only move one square
      let limit = y1 + 1

      //initial extra move
      //cannot reach center row on odd board
      //JIT compiler might or might not optimize divide to bit shift
      //To be on the safe side, performance-critical code should do it by hand
      if (y == 1) limit = Math.max(limit, (height >> 1) - 1)

      //move
      for (;;) {
        y1++
        if (y1 > limit) break
        if (get(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      //capture
      y1 = y + 1
      if (x1) {
        let x2 = x1 - 1
        if (get(board, x2, y1) < 0) add(x2, y1)
      }
      if (x1 + 1 < width) {
        let x2 = x1 + 1
        if (get(board, x2, y1) < 0) add(x2, y1)
      }
    } else {
      //Usually pawns can only move one square
      let limit = y1 - 1

      //initial extra move cannot reach center row on odd board
      if (y == height - 2) limit = Math.min(limit, (height + 1) >> 1)

      //move
      for (;;) {
        y1--
        if (y1 < limit) break
        if (get(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      //capture
      y1 = y - 1
      if (x1) {
        let x2 = x1 - 1
        if (get(board, x2, y1) > 0) add(x2, y1)
      }
      if (x1 + 1 < width) {
        let x2 = x1 + 1
        if (get(board, x2, y1) > 0) add(x2, y1)
      }
    }
  }

  function rook() {
    //west
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      if (!add(x1, y1)) break
    }

    //east
    x1 = x
    y1 = y
    for (;;) {
      x1++
      if (!add(x1, y1)) break
    }

    // south
    x1 = x
    y1 = y
    for (;;) {
      y1--
      if (!add(x1, y1)) break
    }

    // north
    x1 = x
    y1 = y
    for (;;) {
      y1++
      if (!add(x1, y1)) break
    }
  }

  function bishop() {
    // southwest
    let x1 = x
    let y1 = y
    for (;;) {
      x1--
      y1--
      if (!add(x1, y1)) break
    }

    // southeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1--
      if (!add(x1, y1)) break
    }

    // northwest
    x1 = x
    y1 = y
    for (;;) {
      x1--
      y1++
      if (!add(x1, y1)) break
    }

    // northeast
    x1 = x
    y1 = y
    for (;;) {
      x1++
      y1++
      if (!add(x1, y1)) break
    }
  }

  for (var y = 0; y < height; y++)
    for (var x = 0; x < width; x++)
      switch (get(board, x, y) * turn) {
        case PAWN:
          pawn()
          break
        case ROOK:
          rook()
          break
        case BISHOP:
          bishop()
          break
        case QUEEN:
          bishop()
          rook()
          break
        case KNIGHT:
          add(x - 1, y - 2)
          add(x + 1, y - 2)
          add(x - 2, y - 1)
          add(x + 2, y - 1)
          add(x - 2, y + 1)
          add(x + 2, y + 1)
          add(x - 1, y + 2)
          add(x + 1, y + 2)
          break
        case KING:
          add(x - 1, y - 1)
          add(x, y - 1)
          add(x + 1, y - 1)
          add(x - 1, y)
          add(x + 1, y)
          add(x - 1, y + 1)
          add(x, y + 1)
          add(x + 1, y + 1)
          break
      }
  return v
}

function staticVal(board) {
  const width = board.width
  const height = board.height
  let r = 0.0
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) r += pieceVal(board, get(board, x, y))
  return r
}

function blankBoard(width, height) {
  if (!(0 < width && width <= 0xff)) throw new Error()
  if (!(0 < height && height <= 0xff)) throw new Error()
  const board = new Int8Array(width * height)
  board.width = width
  board.height = height
  board.turn = 1
  return board
}

function get(board, x, y) {
  return board[x + y * board.width]
}

function initialBoard(width, height) {
  if (width < 1) throw new Error()
  if (height < 4) throw new Error()
  const board = blankBoard(width, height)

  // Pawns
  let y = height - 2
  for (let x = 0; x < width; x++) {
    put(board, x, 1, PAWN)
    put(board, x, y, -PAWN)
  }

  // Queen
  let x = (width - 1) >> 1
  put(board, x, 0, QUEEN)
  let pieces = x

  // King overwrites queen on odd width
  x = width >> 1
  put(board, x, 0, KING)

  // Pieces
  const rooks = Math.ceil(pieces / 3)
  const knights = (pieces - rooks + 1) >> 1
  for (let x = 0; x < pieces; x++) {
    let piece = BISHOP
    if (x < rooks) piece = ROOK
    else if (x < rooks + knights) piece = KNIGHT
    put(board, x, 0, piece)
    put(board, width - 1 - x, 0, piece)
  }

  // Opponent
  y = height - 1
  for (let x = 0; x < width; x++) put(board, x, y, -get(board, x, 0))

  return board
}

function pieceVal(board, piece) {
  let minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }
  let r = 0.0
  switch (piece) {
    case KING:
      r = 1e12
      break
    case QUEEN:
      r = 9.0
      break
    case ROOK:
      r = 5.0
      break
    case BISHOP:
      r = 3.1
      break
    case KNIGHT:
      r = 3.0
      break
    case PAWN:
      r = 1.0
      break
  }
  if (minus) return -r
  return r
}

function pieceChar(piece) {
  let minus = false
  if (piece < 0) {
    piece = -piece
    minus = true
  }
  let c = "."
  switch (piece) {
    case KING:
      c = "K"
      break
    case QUEEN:
      c = "Q"
      break
    case ROOK:
      c = "R"
      break
    case BISHOP:
      c = "B"
      break
    case KNIGHT:
      c = "N"
      break
    case PAWN:
      c = "P"
      break
  }
  if (minus) return c.toLowerCase()
  return c
}

function printBoard(board) {
  //separator
  for (let x = 0; x < board.width; x++) process.stdout.write("--")
  process.stdout.write("\n")

  //board
  for (let y = board.height; y--; ) {
    for (let x = 0; x < board.width; x++) {
      process.stdout.write(" ")
      process.stdout.write(pieceChar(get(board, x, y)))
    }
    process.stdout.write("\n")
  }
}

function put(board, x, y, piece) {
  board[x + y * board.width] = piece
}

function alive(board) {
  let k = false
  for (const piece of board) {
    switch (piece) {
      case KING:
      case -KING:
        if (k) return true
        k = true
        break
    }
  }
  return false
}

module.exports = {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
  blankBoard,
  get,
  initialBoard,
  printBoard,
  put,
  validMoves,
  staticVal,
  move,
}
