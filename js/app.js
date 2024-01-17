import { Triangle } from "./shape-types/triangle";
import { Ellipse } from "./shape-types/ellipse";
import { Circle } from "./shape-types/circle";
import { Hexagon } from "./shape-types/hexagon";
import { Pentagon } from "./shape-types/pentagon";
import { Rectangle } from "./shape-types/rectangle";

import { AppService, ShapeService } from "./Game.service.js";

export class App {
  shapeClasses = [Triangle, Rectangle, Circle, Ellipse, Pentagon, Hexagon];

  constructor(app) {
    this.app = app;

    this.shapesPerSecond = 1;
    this.gravity = 1;
    this.shapes = [];
    this.infoContainer = document.querySelector(".info-container");
    this.buttonContainer = document.querySelector(".controls");

    this.addHtmlButton(
      "ADD",
      () => {
        this.shapesPerSecond++;
      },
      { x: 0, y: 0 },
      "btn-shape_add"
    );

    this.addHtmlButton(
      "SUB",
      () => {
        if (this.shapesPerSecond <= 0) return;
        this.shapesPerSecond--;
      },
      { x: 0, y: 0 },
      "btn-shape_sub"
    );

    this.addHtmlButton(
      "ADD",
      () => {
        this.gravity++;
      },
      { x: 0, y: 0 },
      "btn-gravity_add"
    );

    this.addHtmlButton(
      "SUB",
      () => {
        if (this.gravity <= 1) return;
        this.gravity--;
      },
      { x: 0, y: 0 },
      "btn-gravity_sub"
    );

    this.addBackground();
    this.addFields();
    this.addHtmlFields();

    this.addShape = this.addShape.bind(this);
    this.removeShape = this.removeShape.bind(this);
    this.onRemoveShape = this.onRemoveShape.bind(this);
    this.onAddShape = this.onAddShape.bind(this);
    this.tick = this.tick.bind(this);
  }

  addBackground() {
    AppService.addBackground.apply(this);
  }

  addFields() {
    AppService.addFields.apply(this);
  }

  addHtmlFields() {
    AppService.addHtmlFields.apply(this);
  }

  addHtmlButton(innerText, callback, position, classname) {
    const btn = document.createElement("button");
    btn.classList.add(`${classname}`, "button");
    // btn.classList.add("button");

    btn.innerText = innerText;

    btn.style.transform = `translate(${position.x}px, ${position.y}px)`;

    btn.addEventListener("click", callback);

    this.buttonContainer.appendChild(btn);
  }

  addButton(innerText, callback, position) {
    AppService.addButton.call(this, innerText, callback, position);
  }

  updateHtmlText() {
    AppService.updateHtmlText.apply(this);
  }

  createEmptySprite() {
    return ShapeService.createEmptySprite();
  }

  addShape(data) {
    return ShapeService.addShape.call(this, data);
  }

  onAddShape(data) {
    ShapeService.onAddShape.call(this, data);
  }

  removeSprite(sprite) {
    ShapeService.removeSprite.call(this, sprite);
  }

  onRemoveShape(shape) {
    ShapeService.onRemoveShape.call(this, shape);
  }

  addSprite(sprite) {
    ShapeService.addSprite.call(this, sprite);
  }

  moveShapes() {
    AppService.moveShapes.apply(this);
  }

  generateShapes(containerSize, amount) {
    ShapeService.generateShapes.call(this, containerSize, amount);
  }

  removeShape(shapeToRemove, callback) {
    ShapeService.removeShape.call(this, shapeToRemove, callback);
  }

  removeFinishedShapes(containerSize, callback) {
    ShapeService.removeFinishedShapes.call(this, containerSize, callback);
  }

  tick(containerSize, shouldGenerate) {
    AppService.tick.call(this, containerSize, shouldGenerate);
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
