import {
  Triangle,
  Rectangle,
  Circle,
  Ellipse,
  Pentagon,
  Hexagon,
} from "./shape-types";

import { Application, Graphics, Sprite, RenderTexture, Matrix } from "pixi.js";

export const app = new Application({
  resizeTo: window,
});

globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

const vectorProd = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

export const random = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const polygonArea = (points) =>
  points.reduce(
    (prev, curr, index, array) =>
      prev + (index > 0 ? vectorProd(array[index - 1], curr) : 0),
    0
  ) / 2;

export class App {
  #shapeClasses = [Triangle, Rectangle, Circle, Ellipse, Pentagon, Hexagon];

  constructor(app) {
    this.app = app;

    this.gravity = 1;
    this.shapes = [];

    this.addBackground();

    this.addShape = this.addShape.bind(this);
    this.removeShape = this.removeShape.bind(this);
    this.onRemoveShape = this.onRemoveShape.bind(this);
    this.onAddShape = this.onAddShape.bind(this);
    this.tick = this.tick.bind(this);
  }

  addBackground() {
    const g = new Graphics();
    g.beginFill(0x2f2f2f);
    g.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    g.endFill();

    const renderTexture = RenderTexture.create({
      width: this.app.screen.width,
      height: this.app.screen.height,
      resolution: window.devicePixelRatio,
    });
    // With the existing renderer, render texture
    // make sure to apply a transform Matrix
    this.app.renderer.render(g, {
      renderTexture,
      // transform: new Matrix(
      //   1,
      //   0,
      //   0,
      //   1,
      //   renderTexture.width / 2,
      //   renderTexture.height / 2
      // ),
    });

    this.background = new Sprite(renderTexture);
    this.background.eventMode = "static";
    this.background.on("pointerdown", (e) => {
      // const ms = new Date().getTime();
      // const width = random(50, 200);
      // const height = random(50, 200);
      // this.onAddShape({
      //   id: ms,
      //   x: e.global.x,
      //   y: e.global.y,
      //   width,
      //   height,
      // });
      this.onAddShape(this.getRandomShapeData(e.global));
    });
    this.app.stage.addChild(this.background);
  }

  createEmptySprite() {
    const sprite = new Sprite();
    sprite.eventMode = "static";
    return sprite;
  }

  getRandomShapeData(position) {
    console.log(position, "POSITION");
    return Object.assign({}, position, {
      width: random(50, 200),
      height: random(50, 200),
    });
  }

  addShape(data) {
    const sprite = this.createEmptySprite();
    const ShapeClass = this.#shapeClasses[random(0, this.#shapeClasses.length)]; // randomly select type of shape
    const newShape = new ShapeClass(Object.assign(data, { sprite }));
    this.shapes.push(newShape);
    return newShape;
  }

  onAddShape(data) {
    const newShape = this.addShape(data);
    // newShape.sprite.click = ($event) => {
    //   $event.stopPropagation(); // don't propagate to canvas
    //   this.model.removeShape(newShape, this.onRemoveShape);
    // };

    this.addSprite(newShape.sprite, newShape);

    console.log(newShape);
  }

  removeSprite(sprite) {
    this.background.removeChild(sprite);
    // sprite.click = null;
    sprite.destroy();
    console.log("sprite removed");
  }

  onRemoveShape(shape) {
    this.removeSprite(shape.sprite);
  }

  addSprite(sprite) {
    // sprite.x = random(0, this.app.screen.width);
    // sprite.y = 0 - sprite.height;
    // sprite.color = 0xffffff;
    sprite.anchor.set(0.5);
    sprite.tint = parseInt(
      Math.floor(Math.random() * 16777215).toString(16),
      16
    );
    // sprite.width = shape.width;
    // sprite.height = shape.height;
    this.background.addChild(sprite);

    console.log(sprite.width, sprite.height, "SPRPITE");
  }

  moveShapes() {
    this.shapes.forEach((shape) => {
      shape.move({ x: 0, y: this.gravity });
    });
  }

  generateShapes(containerSize, amount) {
    const ms = new Date().getTime();
    for (let i = 0; i < amount; i++) {
      const width = random(50, 200);
      const height = random(50, 200);
      this.onAddShape({
        id: ms,
        x: random(0, containerSize.width - width / 2),
        y: 0 - height,
        width,
        height,
      });
    }
  }

  removeShape(shapeToRemove, callback) {
    const shapeIndex = this.shapes.findIndex(
      (shape) => shape.id === shapeToRemove.id
    );
    callback(this.shapes[shapeIndex]); // notify view (through controller) in order to remove sprite from canvas
    this.shapes.splice(shapeIndex, 1);
  }

  removeFinishedShapes(containerSize, callback) {
    this.shapes
      .filter((shape) => shape.y >= containerSize.height + shape.height)
      .forEach((shape) => {
        this.removeShape(shape, callback);
      });

    console.log("shape removed");
  }

  tick(containerSize, shouldGenerate) {
    // each second generate given amount of shapes and remove those, which are outside of the canvas
    if (shouldGenerate) {
      this.generateShapes(containerSize, 1);
      this.removeFinishedShapes(containerSize, this.onRemoveShape);
    }
    // move shapes and update stats
    this.moveShapes();
    // this.view.updateInfo(this.model.coveredArea, this.model.numberOfShapes);
  }

  get coveredArea() {
    return Math.ceil(
      this.shapes.reduce((prev, curr) => prev + curr.coveredArea, 0)
    );
  }

  get gravity() {
    return this._gravity;
  }

  set gravity(value) {
    this._gravity = Number(value);
  }

  get shapesPerSecond() {
    return this._shapesPerSecond;
  }

  set shapesPerSecond(value) {
    this._shapesPerSecond = Number(value);
  }

  get numberOfShapes() {
    return this.shapes.length;
  }
}

let renderCounter = 0;

app.ticker.add(() => {
  const containerSize = {
    width: app.view.clientWidth,
    height: app.view.clientHeight,
  };

  const tickerInterval = app.ticker.deltaMS; // ~16.6667ms by default
  const shouldGenerate =
    (renderCounter * tickerInterval) % 1000 < tickerInterval;

  A.tick(containerSize, shouldGenerate);

  // A.moveShapes();

  // if (shouldGenerate) {
  //   A.generateShapes(containerSize, 1);
  //   A.removeFinishedShapes(containerSize, A.onRemoveShape);
  // }
  // move shapes and update stats
  // app.updateInfo(this.model.coveredArea, this.model.numberOfShapes);

  renderCounter++;
});

const A = new App(app);
