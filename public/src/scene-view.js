import { Animations } from "./animations.js";
import { AppView } from "./app-view.js";
import { Graphics, GraphicsContext, NoiseFilter, Text } from "./pixijs.js";
import { Utils } from "./utils.js";

/**
 * @extends {AppView<import("./scene-controller.js").SceneController>}
 */
export class SceneView extends AppView {
  static noiseFilter = new NoiseFilter({
    noise: 0.1,
    resolution: 0.25,
  });

  /**
   * @param {import("pixi.js").Application} app
   * @param {object} [options]
   * @param {number} [options.cellSize]
   * @param {number} [options.gap]
   * @param {number} [options.gridSize]
   * @param {[x: number, y: number]} [options.position]
   */
  constructor(app, options) {
    const { cellSize, gap, gridSize, position } = Utils.getOptions(options, {
      cellSize: 120,
      gap: 16,
      gridSize: 3,
    });

    super(app);

    this.gap = gap;
    this.cellSize = cellSize;
    this.borderRadius = cellSize * 0.15;
    this.gridSize = gridSize;
    this.position = position;

    this.scene = new Graphics();
    this.cells = /** @type {import("pixi.js").Graphics[]} */ ([]);
  }

  draw() {
    this.cells = [];

    this.scene.clear();
    this.scene.removeChildren();

    const drawContexts = this.createCellDrawContexts();

    this.drawContainer();
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.drawCell(drawContexts, row, col);
      }
    }

    this.drawTitle();
    this.drawResetButton();
  }

  drawContainer() {
    const size =
      (this.cellSize + this.gap) * (this.gridSize - 1) + this.cellSize;

    const [x, y] = this.position ?? [
      this.app.screen.width / 2 - size / 2,
      this.app.screen.height / 2 - size / 2,
    ];

    this.scene.position.set(x, y);
    this.app.stage.addChild(this.scene);
  }

  /**
   * @param {import("pixi.js").Graphics} cell
   */
  drawPlayer(cell) {
    const player = new Graphics();
    const base = new Graphics();

    const cellSize = cell.width;

    const padding = this.gap * 1.5;

    const stroke = {
      width: 4,
      color: this.theme.colors.accent.highlight,
      cap: "round",
    };

    const baseStroke = {
      ...stroke,
      width: stroke.width * 2.5,
      color: this.theme.colors.accent.background,
    };

    if (this.controller?.state.currentPlayer) {
      base
        .moveTo(padding, padding)
        .lineTo(cellSize - padding, cellSize - padding)
        .stroke(baseStroke);

      base
        .moveTo(cellSize - padding, padding)
        .lineTo(padding, cellSize - padding)
        .stroke(baseStroke);

      player
        .moveTo(padding, padding)
        .lineTo(cellSize - padding, cellSize - padding)
        .stroke(stroke);

      player
        .moveTo(cellSize - padding, padding)
        .lineTo(padding, cellSize - padding)
        .stroke(stroke);
    } else {
      base
        .circle(cellSize / 2, cellSize / 2, cellSize / 2 - padding)
        .stroke(baseStroke);

      player
        .circle(cellSize / 2, cellSize / 2, cellSize / 2 - padding)
        .stroke(stroke);
    }

    cell.addChild(base, player);

    const [animation, effect] = Animations.particleDissolve({ size: cellSize });

    cell.addChild(effect);
    animation.start();
  }

  drawResetButton() {
    const button = new Graphics()
      .roundRect(0, 0, 100, 50, 8)
      .fill(this.theme.colors.accent.background);

    button.eventMode = "static";
    button.cursor = "pointer";

    const text = new Text({
      text: "Reset",
      style: {
        fill: this.theme.colors.accent.text,
        fontSize: 16,
      },
    });

    button.addChild(text);

    text.position.set(
      button.width / 2 - text.width / 2,
      button.height / 2 - text.height / 2,
    );

    button.on("click", () => {
      this.controller?.reset();
    });

    button.position.set(
      this.scene.width / 2 - button.width / 2,
      this.scene.height + this.gap * 2,
    );

    this.scene.addChild(button);
  }

  drawTitle() {
    const title = new Text({
      text: "Tic Tac Toe!",
      style: {
        fill: this.theme.colors.text,
        fontSize: 36,
        fontWeight: "bold",
      },
    });

    title.position.set(
      this.app.screen.width / 2 - title.width / 2,
      this.app.screen.height / 2 -
      (this.gridSize * this.cellSize) / 2 -
      title.height -
      this.gap * 6,
    );

    this.app.stage.addChild(title);
  }

  /**
   * @param {ReturnType<typeof this.createCellDrawContexts>} contexts
   * @param {number} row
   * @param {number} col
   */
  drawCell(contexts, row, col) {
    const cell = new Graphics(contexts.base);
    cell.filters = [SceneView.noiseFilter];

    cell.pivot.set(this.cellSize / 2, this.cellSize / 2);
    cell.position.set(
      row * (this.cellSize + this.gap) + this.cellSize / 2,
      col * (this.cellSize + this.gap) + this.cellSize / 2,
    );

    cell.eventMode = "static";
    cell.cursor = "pointer";

    cell.on("pointerover", () => {
      cell.tint = this.theme.tint.hover;
    });

    cell.on("pointerout", () => {
      cell.tint = this.theme.tint.default;
    });

    cell.on("pointerdown", () => {
      cell.scale.set(0.9);

      setTimeout(() => {
        cell.scale.set(1);
        this.controller?.handleCellClick(row, col, cell);
      }, this.theme.duration.click);
    });

    const body = new Graphics(contexts.body);
    body.position.set(this.cellSize * 0.1, this.cellSize * 0.1);
    cell.addChild(body);

    const highlight = new Graphics(contexts.highlight);
    cell.addChild(highlight);

    this.scene.addChild(cell);
    this.cells.push(cell);
  }

  createCellDrawContexts() {
    const base = new GraphicsContext()
      .roundRect(0, 0, this.cellSize, this.cellSize, this.borderRadius)
      .fill(this.theme.colors.background)
      .stroke({
        color: this.theme.colors.accent.background,
        width: 4,
      });

    const body = new GraphicsContext()
      .roundRect(
        0,
        0,
        this.cellSize * 0.8,
        this.cellSize * 0.8,
        this.borderRadius * 0.5,
      )
      .fill(this.theme.colors.surface.background);

    const highlightOffset = this.cellSize * 0.025;
    const highlight = new GraphicsContext()
      .poly([
        { x: this.cellSize - highlightOffset, y: highlightOffset },
        {
          x: this.cellSize - highlightOffset,
          y: this.cellSize - highlightOffset,
        },
        { x: highlightOffset, y: this.cellSize - highlightOffset },
      ])
      .fill({
        alpha: 0.3,
        color: this.theme.colors.surface.highlight,
      });

    return { base, body, highlight };
  }
}
