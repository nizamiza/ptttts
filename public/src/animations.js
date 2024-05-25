import { Graphics, GraphicsContext, Ticker } from "./pixijs.js";
import { Theme } from "./theme.js";
import { Utils } from "./utils.js";

export class Animations {
  /**
   * @param {object} [options]
   * @param {number} [options.size]
   * @param {number} [options.duration]
   * @param {number} [options.particleSize]
   * @param {string} [options.color]
   * @param {number} [options.count]
   */
  static particleDissolve(options) {
    let { size, duration, particleSize, color, count } = Utils.getOptions(
      options,
      {
        size: 100,
        duration: 500,
        color: Theme.colors.accent.highlight,
        count: 8,
      },
    );

    particleSize = particleSize ?? size * 0.1;

    const container = new Graphics().rect(0, 0, size, size);

    const ticker = new EphemeralTicker({
      duration,
      onStop: () => container.destroy({ children: true }),
    });

    const motionRadius = size * 0.75;

    Array.from({ length: count }).forEach(() => {
      const particle = new Graphics()
        .rect(0, 0, particleSize, particleSize)
        .fill(color === "random" ? Theme.randomColor() : color);

      const initialPos = Utils.randomNumber(
        motionRadius * 0.5,
        size - motionRadius * 0.5,
      );

      const direction = Utils.randomNumber(0, 360);
      const destPos = Utils.randomNumber(motionRadius * 0.5, motionRadius);

      container.addChild(particle);
      particle.position.set(initialPos, initialPos);

      ticker.add(() => {
        const progress = 1 - Math.pow(1 - ticker.totalElapsedMS / duration, 3);

        const x = initialPos + Math.cos(direction) * destPos * progress;
        const y = initialPos + Math.sin(direction) * destPos * progress;

        particle.alpha = 1 - Math.pow(progress, 3);
        particle.position.set(x, y);
      });
    });

    return /** @type {const} */ ([ticker, container]);
  }
}

export class EphemeralTicker extends Ticker {
  /**
   * @param {object} [options]
   * @param {number} [options.duration]
   * @param {(ticker: import("pixi.js").Ticker) => void} [options.onStop]
   */
  constructor(options) {
    const { duration, onStop } = Utils.getOptions(options, { duration: 1000 });

    super();

    this.autoStart = false;
    this.duration = duration;
    this.onStop = onStop;
    this.totalElapsedMS = 0;
  }

  start() {
    super.start();

    this.add(() => {
      this.totalElapsedMS += this.elapsedMS;

      if (this.totalElapsedMS >= this.duration) {
        this.stop();
        this.onStop?.(this);
      }
    });
  }
}
