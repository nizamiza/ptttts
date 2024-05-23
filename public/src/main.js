import { Application } from "./pixijs.js";
import { Controller } from "./controller.js";
import { Scene } from "./scene.js";
import { Theme } from "./theme.js";

const app = new Application();

const controller = new Controller();
const theme = new Theme();

await app.init({
  background: theme.colors.background,
  resizeTo: window,
});

document.body.appendChild(app.canvas);

const scene = new Scene(app, controller);
scene.draw();
