import { App } from "./app";
import { Application } from "pixi.js";

export const app = new Application({
  resizeTo: window,
  autoDensity: true,
  antialias: true,
  resolution: window.devicePixelRatio,
});

globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

let second = 0;

app.ticker.add((delta) => {
  const containerSize = {
    width: app.view.clientWidth,
    height: app.view.clientHeight,
  };

  second += (1 / 60) * delta;

  const toGenerate = second >= 1;

  if (second >= 1) {
    second = 0;
  }

  game.tick(containerSize, toGenerate);
});

const game = new App(app);
