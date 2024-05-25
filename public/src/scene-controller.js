import { AppController } from "./app-controller.js";
import { SceneView } from "./scene-view.js";
import { ScoreView } from "./score-view.js";
import { Utils } from "./utils.js";

/**
 * @typedef {typeof SceneController.PLAYERS[number]} Player
 */

/**
 * @typedef {object} Score
 * @property {number[]} rows
 * @property {number[]} cols
 * @property {number} diag
 * @property {number} invDiag
 */

/**
 * @typedef {object} State
 * @property {Player} currentPlayer
 * @property {(Player | undefined)[][]} board
 * @property {[player1: Score, player2: Score]} score
 */

/**
 * @extends {AppController<{ scene: SceneView; score: ScoreView }>}
 */
export class SceneController extends AppController {
  static DEFAULT_BOARD_SIZE = 3;
  static PLAYERS = /** @type {const} */ ([0, 1]);

  state = SceneController.resetState();

  /**
   * @param {import("pixi.js").Application} app
   * @param {object} [options]
   * @param {number} [options.boardSize]
   */
  constructor(app, options) {
    const { boardSize } = Utils.getOptions(options, {
      boardSize: SceneController.DEFAULT_BOARD_SIZE,
    });

    super(app, {
      scene: new SceneView(app, { gridSize: boardSize }),
      score: new ScoreView(app),
    });

    this.boardSize = boardSize;
    SceneView.sounds.hit.volume = 0.15;

    document.addEventListener("keydown", (event) => {
      if (event.key === "r") {
        this.reset();
      }
    });
  }

  /**
   * @param {number} row
   * @param {number} col
   * @param {import("pixi.js").Graphics} cell
   */
  handleCellClick(row, col, cell) {
    if (this.state.board[row][col] !== undefined) {
      return;
    }

    if (this.checkWinner() === undefined) {
      const player = this.state.currentPlayer;
      this.state.board[row][col] = player;

      this.updateScore(row, col);
      this.state.currentPlayer = player === 0 ? 1 : 0;

      this.views.scene.drawPlayer(cell);
      this.views.score.draw();

      SceneView.sounds.hit.play();

      this.views.score.playVictoryAnimation(this.checkWinner());
    }
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

    return winner >= 0 ? SceneController.PLAYERS[winner] : undefined;
  }

  getMaxScores() {
    const { score } = this.state;

    return SceneController.mapPlayers((player) => {
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
    if (this.views.score.isPlayingVictoryAnimation) {
      return;
    }

    this.state = SceneController.resetState(this.boardSize);
    this.views.scene.draw();
  }

  /**
   * @template T
   * @template {[T,T]} R
   * @param {(player: Player, index: number, array: readonly Player[]) => T} callback
   * @returns {R}
   */
  static mapPlayers(callback) {
    return /** @type {R} */ (SceneController.PLAYERS.map(callback));
  }

  /**
   * @param {number} [boardSize]
   * @returns {State}
   */
  static resetState(boardSize = SceneController.DEFAULT_BOARD_SIZE) {
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
      score: SceneController.mapPlayers(resetScore),
    };
  }
}
