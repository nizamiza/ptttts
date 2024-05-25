import { Application, Graphics, NoiseFilter } from "./pixijs.js";
import { SceneController } from "./scene-controller.js";
import { Theme } from "./theme.js";

const app = new Application();

const scene = new SceneController(app);

await app.init({
  resizeTo: window,
  antialias: true,
});

const bg = new Graphics()
  .rect(0, 0, app.screen.width, app.screen.height)
  .fill(Theme.colors.background);

bg.filters = [
  new NoiseFilter({
    noise: 0.15,
  }),
];

app.stage.addChild(bg);

document.body.appendChild(app.canvas);

scene.view.draw();
