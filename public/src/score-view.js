import { Animations, EphemeralTicker } from "./animations.js";
import { AppView } from "./app-view.js";
import { Graphics, Text } from "./pixijs.js";
import { Utils } from "./utils.js";

/**
 * @extends {AppView<import("./scene-controller.js").SceneController>}
 */
export class ScoreView extends AppView {
  static VICTORY_ANIMATION_DURATION = 2500;

  isPlayingVictoryAnimation = false;

  /**
   * @param {import("pixi.js").Application} app
   * @param {object} [options]
   * @param {number} [options.gap]
   * @param {number} [options.offset] - The offset from the top-right corner.
   */
  constructor(app, options) {
    const { gap, offset } = Utils.getOptions(options, { gap: 10 });

    super(app);

    this.gap = gap;
    this.offset = offset ?? gap;
    this.container = new Graphics();
  }

  draw() {
    this.container.clear();
    this.container.removeChildren();

    if (!this.controller) {
      return;
    }

    const scores = this.controller.getMaxScores();
    const winner = this.controller.checkWinner();

    const [scoreText] = scores.map((score, i) => {
      const text = new Text({
        text: `Player ${i + 1}: ${score}`,
        style: {
          fontFamily: this.theme.fonts.body,
          fontSize: 24,
          fill: this.theme.colors.text,
          align: "right",
        },
      });

      text.position.set(0, i * (this.gap + text.height));
      this.container.addChild(text);

      return text;
    });

    if (winner !== undefined) {
      const winnerText = new Text({
        text: `Player ${winner + 1} wins!`,
        style: {
          fontFamily: this.theme.fonts.body,
          fontSize: 16,
          fill: this.theme.colors.success.text,
          align: "right",
        },
      });

      winnerText.position.set(0, scores.length * (scoreText.height + this.gap));
      this.container.addChild(winnerText);
    }

    this.container.position.set(
      this.app.screen.width - this.container.width - this.offset,
      this.offset,
    );

    this.app.stage.addChild(this.container);
  }

  /**
   * @param {import("./scene-controller.js").Player | undefined} winner
   */
  playVictoryAnimation(winner) {
    if (winner === undefined || this.isPlayingVictoryAnimation) {
      return;
    }

    this.isPlayingVictoryAnimation = true;

    const dimmer = new Graphics()
      .rect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({
        color: this.theme.colors.black,
        alpha: 0.5,
      });

    this.app.stage.addChild(dimmer);

    Array.from({ length: 2 }).forEach((_, index) => {
      const [animation, effect] = Animations.particleDissolve({
        size: this.app.screen.width * 0.4,
        count: 150,
        duration: ScoreView.VICTORY_ANIMATION_DURATION,
        particleSize: 8,
        color: "random",
      });

      effect.position.set(index * this.app.screen.width * 0.66, 0);

      this.app.stage.addChild(effect);
      animation.start();
    });

    const text = new Text({
      text: `Player ${winner + 1} wins!`,
      style: {
        fontFamily: this.theme.fonts.title,
        fontSize: 48,
        fontWeight: "bold",
        fill: this.theme.colors.text,
      },
    });

    text.position.set(
      (this.app.screen.width - text.width) / 2,
      (this.app.screen.height - text.height) / 2,
    );

    this.app.stage.addChild(text);

    const ticker = new EphemeralTicker({
      duration: ScoreView.VICTORY_ANIMATION_DURATION,
      onStop: () => {
        dimmer.destroy();
        text.destroy();
        this.isPlayingVictoryAnimation = false;
      },
    });

    ticker.start();
  }
}
