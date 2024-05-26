import { Graphics, GraphicsContext } from "./pixijs.js";
import { Theme } from "./theme.js";

const DEFAULT_OPTIONS = { cellSize: 120, gap: 16, gridSize: 3 };

export class Scene extends Theme {
  /**
   * @param {import("pixi.js").Application} app
   * @param {import("./scene-controller.js").SceneController} controller
   * @param {object} [options]
   * @param {number} [options.cellSize]
   * @param {number} [options.gap]
   * @param {number} [options.gridSize]
   * @param {[x: number, y: number]} [options.position]
   */
  constructor(app, controller, options = DEFAULT_OPTIONS) {
    const { cellSize, gap, gridSize, position } = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    super();

    this.app = app;
    this.controller = controller;

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
    const drawContexts = this.createCellDrawContexts();

    this.drawContainer();
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.drawCell(drawContexts, row, col);
      }
    }
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
    const cirlceOrCross = new Graphics();

    const cellSize = cell.width;
    const padding = this.gap;

    const stroke = { width: 5, color: this.colors.accent.highlight };

    if (this.controller.state.currentPlayer) {
      cirlceOrCross
        .moveTo(padding, padding)
        .lineTo(cellSize - padding, cellSize - padding)
        .stroke(stroke);

      cirlceOrCross
        .moveTo(cellSize - padding, padding)
        .lineTo(padding, cellSize - padding)
        .stroke(stroke);
    } else {
      cirlceOrCross
        .circle(cellSize / 2, cellSize / 2, cellSize / 2 - padding)
        .stroke(stroke);
    }

    cell.addChild(cirlceOrCross);
  }

  /**
   * @param {ReturnType<typeof this.createCellDrawContexts>} contexts
   * @param {number} row
   * @param {number} col
   */
  drawCell(contexts, row, col) {
    const cell = new Graphics(contexts.base);

    cell.pivot.set(this.cellSize / 2, this.cellSize / 2);
    cell.position.set(
      row * (this.cellSize + this.gap) + this.cellSize / 2,
      col * (this.cellSize + this.gap) + this.cellSize / 2,
    );

    cell.eventMode = "static";
    cell.cursor = "pointer";

    cell.on("click", () => {
      this.controller.handleCellClick(row, col);
      this.drawPlayer(cell);
    });

    cell.on("pointerover", () => {
      cell.tint = 0xaaaaaa;
    });

    cell.on("pointerout", () => {
      cell.tint = 0xffffff;
    });

    cell.on("pointerdown", () => {
      cell.scale.set(0.9);
    });

    cell.on("pointerup", () => {
      cell.scale.set(1);
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
      .fill(this.colors.background)
      .stroke({
        color: this.colors.accent.background,
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
      .fill(this.colors.surface.background);

    const highlight = new GraphicsContext()
      .poly([
        { x: 0, y: 0 },
        { x: this.cellSize, y: 0 },
        { x: this.cellSize, y: this.cellSize },
      ])
      .fill({
        alpha: 0.3,
        color: this.colors.surface.highlight,
      });

    return { base, body, highlight };
  }
}
