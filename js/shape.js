import { RenderTexture, Graphics, Matrix } from "pixi.js";
import { app } from "./app";
import { polygonArea } from "./app";
import { random } from "./app";

export class Shape {
  constructor(data = {}) {
    if (data.sprite == null) {
      throw new Error("Can't instantiate shape without sprite");
    }

    this.id = data.id || new Date().getTime();
    this.width = random(150, 200);
    this.height = random(150, 200);
    this.tint = this.generateColor() || 0xff3300;
    this.points = data.points || null;
    this.sprite = data.sprite;
    this.x = data.x;
    this.y = data.y;

    this.initSprite(this.render());
    this.coveredArea = this.getArea();
  }

  move(deltaPosition) {
    this.x += deltaPosition.x;
    this.y += deltaPosition.y;
  }

  render() {
    if (!this.points) {
      return;
    }

    const g = this.createGraphics();
    g.beginFill(this.tint);
    g.moveTo(this.x, this.y);
    this.points.forEach((point) => {
      g.lineTo(point.x, point.y);
    });
    g.lineTo(this.x, this.y);
    g.endFill();

    return g;
  }

  initSprite(g) {
    if (g != null) {
      this.sprite.texture = app.renderer.generateTexture(g, 1, 1);
      this.sprite.setTransform(this.x, this.y, 1, 1);
      this.sprite.anchor.set(0.5, 0.5);
      g.destroy();
    }
  }

  createGraphics() {
    const shapeGraphics = new Graphics();
    return shapeGraphics;
  }

  getArea() {
    if (!this.points) {
      return;
    }
    const top = { x: this.x, y: this.y };
    return polygonArea([top].concat(this.points).concat([top]));
  }

  generateColor() {
    return parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
  }

  get x() {
    return this.sprite.position.x;
  }

  set x(value) {
    this.sprite.position.x = value;
  }

  get y() {
    return this.sprite.position.y;
  }

  set y(value) {
    this.sprite.position.y = value;
  }
}
