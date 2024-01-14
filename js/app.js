import {
  Triangle,
  Rectangle,
  Circle,
  Ellipse,
  Pentagon,
  Hexagon,
} from "./shape-types";

import { Application, Graphics, Sprite, RenderTexture, Text } from "pixi.js";

export const app = new Application({
  resizeTo: window,
  autoDensity: true,
  antialias: true,
  resolution: window.devicePixelRatio,
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

    this.shapesPerSecond = 1;
    this.gravity = 1;
    this.shapes = [];

    this.addBackground();
    this.addFields();
    this.addButton(
      "ADD",
      () => {
        this.shapesPerSecond++;
      },
      { x: 380, y: 5 }
    );
    this.addButton(
      "SUB",
      () => {
        if (this.shapesPerSecond <= 0) return;
        this.shapesPerSecond--;
      },
      { x: 430, y: 5 }
    );
    this.addButton(
      "ADD",
      () => {
        this.gravity++;
      },
      { x: 635, y: 5 }
    );
    this.addButton(
      "SUB",
      () => {
        if (this.gravity <= 1) return;
        this.gravity--;
      },
      { x: 685, y: 5 }
    );

    this.addShape = this.addShape.bind(this);
    this.removeShape = this.removeShape.bind(this);
    this.onRemoveShape = this.onRemoveShape.bind(this);
    this.onAddShape = this.onAddShape.bind(this);
    this.tick = this.tick.bind(this);
  }

  addBackground() {
    const g = new Graphics();
    g.beginFill(0x643843);
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
    });

    this.background = new Sprite(renderTexture);
    this.background.eventMode = "static";
    this.background.on("pointerdown", (e) => {
      this.onAddShape(this.getRandomShapeData(e.global));
    });
    this.app.stage.addChild(this.background);
  }

  addFields() {
    this.textContent = new Graphics();
    const textArea = new Text("0", { fontSize: 16, fill: "#E7CBCB" });

    this.textContent.beginFill(0x99627a);
    this.textContent.drawRoundedRect(0, 0, this.app.screen.width, 50, 5);
    this.textContent.endFill();

    textArea.anchor.set(0, 0.5);
    textArea.x = 10;
    textArea.y = this.textContent.height / 2;

    const textPerSecond = new Text(
      ` Shapes per second: ${this.shapesPerSecond}`,
      {
        fontSize: 16,
        fill: "#E7CBCB",
        align: "center",
        resolution: 5,
      }
    );

    textPerSecond.anchor.set(0, 0.5);
    textPerSecond.x = 200;
    textPerSecond.y = textArea.y;

    const textGravity = new Text(`Gravity value: ${this.gravity}`, {
      fontSize: 16,
      fill: "#E7CBCB",
      align: "center",
      resolution: 5,
    });

    textGravity.anchor.set(0, 0.5);
    textGravity.x = 500;
    textGravity.y = textArea.y;

    this.textContent.addChild(textArea, textPerSecond, textGravity);

    this.app.stage.addChild(this.textContent);
  }

  addButton(innerText, callback, position) {
    const button = new Graphics()
      .beginFill(0x643843)
      .drawRoundedRect(0, 0, 40, 40, 100);
    const text = new Text(innerText, { fontSize: 12, fill: "#E7CBCB" });
    text.anchor.set(0.5);
    text.x = button.width / 2;
    text.y = button.height / 2;

    button.x = position.x;
    button.y = position.y;

    button.addChild(text);

    button.eventMode = "static";
    button.on("pointerdown", callback);

    this.textContent.addChild(button);
  }

  updateT() {
    this.app.stage.children[1].children[0].text = `Covered area: ${this.coveredArea}`;
    this.app.stage.children[1].children[1].text = `Shapes per second: ${this.shapesPerSecond}`;
    this.app.stage.children[1].children[2].text = `Gravity value: ${this.gravity}`;
  }

  createEmptySprite() {
    const sprite = new Sprite();
    sprite.eventMode = "static";

    return sprite;
  }

  getRandomShapeData(position) {
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

    newShape.sprite.on("pointerdown", (e) => {
      e.stopPropagation();
      this.removeShape(newShape, this.onRemoveShape);
    });

    this.addSprite(newShape.sprite);
  }

  removeSprite(sprite) {
    this.background.removeChild(sprite);
    sprite.destroy();
  }

  onRemoveShape(shape) {
    this.removeSprite(shape.sprite);
  }

  addSprite(sprite) {
    this.background.addChild(sprite);
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
  }

  tick(containerSize, shouldGenerate) {
    // each second generate given amount of shapes and remove those, which are outside of the canvas
    if (shouldGenerate) {
      this.generateShapes(containerSize, this.shapesPerSecond);
      this.removeFinishedShapes(containerSize, this.onRemoveShape);
    }
    // move shapes and update stats
    this.updateT();
    this.moveShapes();
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

  renderCounter++;
});

const A = new App(app);
