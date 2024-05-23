/**
 * @typedef {object} Score
 * @property {number[]} rows
 * @property {number[]} cols
 * @property {number} diag
 * @property {number} invDiag
 */

/**
 * @typedef {0 | 1} Player
 */
const PLAYERS = /** @type {const} */ ([0, 1]);

/**
 * @typedef {object} State
 * @property {Player} currentPlayer
 * @property {(Player | undefined)[][]} board
 * @property {[player1: Score, player2: Score]} score
 */

/**
 * @template T
 * @template {[T,T]} R
 * @param {(player: Player, index: number, array: readonly Player[]) => T} callback
 * @returns {R}
 */
function mapPlayers(callback) {
  return /** @type {R} */ (PLAYERS.map(callback));
}

/**
 * @param {number} [boardSize]
 * @returns {State}
 */
function resetState(boardSize = 3) {
  const resetScore = () => ({
    rows: Array.from({ length: boardSize }, () => 0),
    cols: Array.from({ length: boardSize }, () => 0),
    diag: 0,
    invDiag: 0,
  });

  return {
    currentPlayer: 0,
    board: Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => undefined),
    ),
    score: mapPlayers(resetScore),
  };
}

export class Controller {
  state = resetState();

  constructor(boardSize = 3) {
    this.boardSize = boardSize;
    this.reset();
  }

  /**
   * @param {number} row
   * @param {number} col
   */
  handleCellClick(row, col) {
    if (this.state.board[row][col] !== undefined) {
      return;
    }

    const player = this.state.currentPlayer;
    this.state.board[row][col] = player;

    this.updateScore(row, col);
    this.state.currentPlayer = player === 0 ? 1 : 0;
  }

  /**
   * @param {number} row
   * @param {number} col
   */
  updateScore(row, col) {
    const player = this.state.currentPlayer;
    const cell = this.state.board[row][col];

    if (cell === undefined) {
      return;
    }

    const score = this.state.score[player];

    score.rows[row]++;
    score.cols[col]++;

    if (row === col) {
      score.diag++;
    }

    if (row + col === this.boardSize - 1) {
      score.invDiag++;
    }
  }

  /**
   * @returns {Player | undefined}
   */
  checkWinner() {
    const winner = this.getMaxScores().findIndex(
      (maxScore) => maxScore === this.boardSize,
    );

    return winner > 0 ? PLAYERS[winner] : undefined;
  }

  getMaxScores() {
    const { score } = this.state;

    return mapPlayers((player) => {
      return Math.max(
        ...[
          ...score[player].rows,
          ...score[player].cols,
          score[player].diag,
          score[player].invDiag,
        ],
      );
    });
  }

  reset() {
    this.state = resetState(this.boardSize);
  }
}
