import { Theme } from "./theme.js";

/**
 * @template {import("./app-controller.js").AppController} [Controller=any]
 */
export class AppView {
  /** @type {import("pixi.js").Application} */
  app;

  /** @type {Controller | undefined} */
  controller;

  /** @type {Theme} */
  theme = new Theme();

  /**
   * @param {import("pixi.js").Application} app
   */
  constructor(app) {
    this.app = app;
  }

  draw() { }
}
