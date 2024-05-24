import { Application } from "./pixijs.js";
import { SceneController } from "./scene-controller.js";
import { Theme } from "./theme.js";

const app = new Application();

const scene = new SceneController(app);

await app.init({
  background: Theme.colors.background,
  resizeTo: window,
  antialias: true,
});

document.body.appendChild(app.canvas);

scene.view.draw();
