"use strict"

const minWidth = 1
const minHeight = 3

const KING = 1
const QUEEN = 2
const ROOK = 3
const BISHOP = 4
const KNIGHT = 5
const PAWN = 6

function getBounded(board, x, y) {
  if (!(0 <= x && x < board.width)) return 0
  if (!(0 <= y && y < board.height)) return 0
  return at(board, x, y)
}

function check1(board, player, x, y) {
  const width = board.width
  const height = board.height

  const opponent = -player

  //Possibly checking pieces are looked for
  //in best-guess descending order of probability

  //knight
  const knight = KNIGHT * opponent
  if (getBounded(board, x - 1, y - 2) == knight) return true
  if (getBounded(board, x + 1, y - 2) == knight) return true
  if (getBounded(board, x - 2, y - 1) == knight) return true
  if (getBounded(board, x + 2, y - 1) == knight) return true
  if (getBounded(board, x - 2, y + 1) == knight) return true
  if (getBounded(board, x + 2, y + 1) == knight) return true
  if (getBounded(board, x - 1, y + 2) == knight) return true
  if (getBounded(board, x + 1, y + 2) == knight) return true

  //king
  const king = KING * opponent
  //JIT compiler might or might not optimize Math.max/min
  //To be on the safe side, performance-critical code should do it by hand
  let X1 = x - 1
  if (X1 < 0) X1 = 0
  let X2 = x + 2
  if (X2 > width) X2 = width
  let Y1 = y - 1
  if (Y1 < 0) Y1 = 0
  let Y2 = y + 2
  if (Y2 > height) Y2 = height
  for (let y1 = Y1; y1 < Y2; y1++) for (let x1 = X1; x1 < X2; x1++) if (at(board, x1, y1) == king) return true

  return false
}

function check(board, player) {
  const width = board.width
  const height = board.height

  const king = KING * player
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (at(board, x, y) == king) return check1(board, player, x, y)
  throw new Error()
}

function move(board, x, y, x1, y1) {
  const b = new Int8Array(board.length)
  b.set(board)
  b.width = board.width
  b.height = board.height
  b.turn = -board.turn

  let piece = at(board, x, y)
  switch (piece) {
    case PAWN:
      if (y1 == board.height - 1) piece = QUEEN
      break
    case -PAWN:
      if (y1 == 0) piece = -QUEEN
      break
  }
  put(b, x1, y1, piece)

  put(b, x, y, 0)
  return b
}

function validMoves(board) {
  const width = board.width
  const height = board.height
  const turn = board.turn

  const v = []

  function add1(x1, y1) {
    const b = move(board, x, y, x1, y1)
    v.push(b)
  }

  function add(x1, y1) {
    // outside the board
    if (!(0 <= x1 && x1 < width && 0 <= y1 && y1 < height)) return false

    // onto own piece (including null move)
    if (at(board, x1, y1) * turn > 0) return false

    // valid move
    add1(x1, y1)
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
        if (at(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      //capture
      y1 = y + 1
      if (y1 == height) return

      //diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (at(board, x2, y1) < 0) add1(x2, y1)
      }

      //diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (at(board, x2, y1) < 0) add1(x2, y1)
      }
    } else {
      //Usually pawns can only move one square
      let limit = y1 - 1

      //initial extra move
      //cannot reach center row on odd board
      if (y == height - 2) limit = Math.min(limit, (height + 1) >> 1)

      //move
      for (;;) {
        y1--
        if (y1 < limit) break
        if (at(board, x1, y1)) break
        if (!add(x1, y1)) break
      }

      //capture
      y1 = y - 1
      if (y1 < 0) return

      //diagonal west
      let x2 = x1 - 1
      if (x2 >= 0) {
        if (at(board, x2, y1) > 0) add1(x2, y1)
      }

      //diagonal east
      x2 = x1 + 1
      if (x2 < width) {
        if (at(board, x2, y1) > 0) add1(x2, y1)
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
      switch (at(board, x, y) * turn) {
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
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) r += pieceVal(board, at(board, x, y))
  return r
}

function emptyBoard(width, height) {
  if (width < minWidth) throw new Error(width)
  if (height < minHeight) throw new Error(height)

  const board = new Int8Array(width * height)
  board.width = width
  board.height = height
  board.turn = 1
  return board
}

function at(board, x, y) {
  return board[x + y * board.width]
}

function verify(board) {
  const width = board.width
  const height = board.height
  const turn = board.turn

  if (width < minWidth) throw new Error(width)
  if (height < minHeight) throw new Error(height)
  if (board.length != width * height) throw new Error(board.length)

  if (!(turn == 1 || turn == -1)) throw new Error(turn)

  //every square is empty or contains a valid piece
  for (const piece of board) pieceChar(piece)

  //each player has exactly one king
  let kingsp = 0
  let kingsm = 0
  for (const piece of board)
    switch (piece) {
      case KING:
        kingsp++
        break
      case -KING:
        kingsm++
        break
    }
  if (kingsp != 1) throw new Error(kingsp)
  if (kingsm != 1) throw new Error(kingsm)

  //pawns are where they should be
  for (let x = 0; x < width; x++)
    if (Math.abs(at(board, x, 0)) == PAWN || Math.abs(at(board, x, height - 1)) == PAWN) throw new Error(x)
}

function initialBoard(width, height) {
  const board = emptyBoard(width, height)

  // Pawns
  if (height > 3) {
    let y = height - 2
    for (let x = 0; x < width; x++) {
      put(board, x, 1, PAWN)
      put(board, x, y, -PAWN)
    }
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
  let y = height - 1
  for (let x = 0; x < width; x++) put(board, x, y, -at(board, x, 0))

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

  let c
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
    case 0:
      c = "."
      break
    default:
      throw new Error(piece)
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
      process.stdout.write(pieceChar(at(board, x, y)))
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
  emptyBoard,
  at,
  initialBoard,
  printBoard,
  put,
  validMoves,
  staticVal,
  verify,
  check,
}
