/**
 * @template {Record<string, import("./app-view.js").AppView>} [Views={}]
 */
export class AppController {
  /** @type {import("pixi.js").Application} */
  app;

  /** @type {Views} */
  views;

  /**
   * @param {import("pixi.js").Application} app
   * @param {Views} views
   */
  constructor(app, views) {
    this.app = app;
    this.views = views;

    for (const view of Object.values(this.views)) {
      view.controller = this;
    }
  }

  drawAll() {
    for (const view of Object.values(this.views)) {
      view.draw();
    }
  }
}
