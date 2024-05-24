/**
 * @template {import("./app-view.js").AppView} [View=any]
 */
export class AppController {
  /** @type {import("pixi.js").Application} */
  app;

  /** @type {View} */
  view;

  /**
   * @param {import("pixi.js").Application} app
   * @param {View} view
   */
  constructor(app, view) {
    this.app = app;
    this.view = view;

    view.controller = this;
  }
}
