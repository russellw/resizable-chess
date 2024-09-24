import assert from "assert"
import { decodeFEN } from "../common.js"

describe('decodeFEN', function() {
  it('should decode a simple FEN for a standard 8x8 chess board', function() {
    const [board, turn] = decodeFEN(8, 8, '8/8/8/8/8/8/8/8 w');
    
    const expectedBoard = new Int8Array(8 * 8); // Empty board
    assert.deepStrictEqual(board, expectedBoard);
    assert.strictEqual(turn, 1); // White's turn
  });

  it('should decode FEN with pieces for a standard 8x8 board', function() {
    const [board, turn] = decodeFEN(8, 8, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w');

    const expectedBoard = new Int8Array(8 * 8);
    // Fill expectedBoard with appropriate piece values
    expectedBoard[0] = -2; // r
    expectedBoard[1] = -3; // n
    expectedBoard[2] = -4; // b
    expectedBoard[3] = -5; // q
    expectedBoard[4] = -6; // k
    expectedBoard[5] = -4; // b
    expectedBoard[6] = -3; // n
    expectedBoard[7] = -2; // r
    expectedBoard[8] = -1; // p (and so on for other pawns and pieces)

    // Check if board matches expected layout
    assert.deepStrictEqual(board, expectedBoard);
    assert.strictEqual(turn, 1); // White's turn
  });

  it('should decode FEN with black to move', function() {
    const [board, turn] = decodeFEN(8, 8, '8/8/8/8/8/8/8/8 b');
    
    const expectedBoard = new Int8Array(8 * 8); // Empty board
    assert.deepStrictEqual(board, expectedBoard);
    assert.strictEqual(turn, -1); // Black's turn
  });

  it('should throw an error for invalid turn character', function() {
    assert.throws(() => {
      decodeFEN(8, 8, '8/8/8/8/8/8/8/8 x');
    }, Error);
  });
});
