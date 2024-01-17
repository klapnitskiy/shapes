import { SHAPE_SIZE } from "./constants";
import { random } from "./helpers";
import { Graphics, RenderTexture, Sprite, Text } from "pixi.js";

//creates fullscreen background
function addBackground() {
  const graphics = new Graphics();
  graphics.beginFill(0x643843);
  graphics.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
  graphics.endFill();

  const renderTexture = RenderTexture.create({
    width: this.app.screen.width,
    height: this.app.screen.height,
    resolution: window.devicePixelRatio,
  });
  // With the existing renderer, render texture
  // make sure to apply a transform Matrix
  this.app.renderer.render(graphics, {
    renderTexture,
  });

  this.background = new Sprite(renderTexture);
  this.background.eventMode = "static";
  this.background.on("pointerdown", (e) => {
    // this.onAddShape(this.getRandomShapeData(e.global));
    this.onAddShape(ShapeService.getRandomShape(e.global));
  });
  this.app.stage.addChild(this.background);
}

// creates button with following params
function addButton(innerText, callback, position) {
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

// generates random shape on click
const getRandomShapeData = (position) => {
  return Object.assign({}, position, {
    width: SHAPE_SIZE.WIDTH,
    height: SHAPE_SIZE.HEIGHT,
  });
};

//creates text fields inside header
function addFields() {
  this.textContent = new Graphics();
  const textArea = new Text("0", { fontSize: 16, fill: "#E7CBCB" });

  this.textContent.beginFill(0x99627a);
  this.textContent.drawRoundedRect(0, 0, this.app.screen.width, 50, 5);
  this.textContent.endFill();

  textArea.anchor.set(0, 0.5);
  textArea.x = 10;
  textArea.y = this.textContent.height / 2;

  // const textPerSecond = new Text(
  //   ` Shapes per second: ${this.shapesPerSecond}`,
  //   {
  //     fontSize: 16,
  //     fill: "#E7CBCB",
  //     align: "center",
  //     resolution: 5,
  //   }
  // );

  // textPerSecond.anchor.set(0, 0.5);
  // textPerSecond.x = 200;
  // textPerSecond.y = textArea.y;

  // const textGravity = new Text(`Gravity value: ${this.gravity}`, {
  //   fontSize: 16,
  //   fill: "#E7CBCB",
  //   align: "center",
  //   resolution: 5,
  // });

  // textGravity.anchor.set(0, 0.5);
  // textGravity.x = 500;
  // textGravity.y = textArea.y;

  // const textShapes = new Text(
  //   `Shapes being displayed: ${this.numberOfShapes}`,
  //   {
  //     fontSize: 16,
  //     fill: "#E7CBCB",
  //     align: "center",
  //     resolution: 5,
  //   }
  // );

  // textShapes.anchor.set(0, 0.5);
  // textShapes.x = 770;
  // textShapes.y = textArea.y;

  // this.textContent.addChild(textArea, textPerSecond, textGravity, textShapes);

  this.app.stage.addChild(this.textContent);
}

function addHtmlFields() {
  const coveredArea = document.createElement("div");
  coveredArea.classList.add("info-area");
  const shapesPerSecond = document.createElement("div");
  shapesPerSecond.classList.add("info-shapes_per_second");
  const gravity = document.createElement("div");
  gravity.classList.add("info-gravity");
  const shapesDisplayed = document.createElement("div");
  shapesDisplayed.classList.add("info-shapes_displayed");

  const textArea = document.createElement("span");
  textArea.classList.add("info-area_span");
  textArea.innerText = `Covered area: ${this.coveredArea}`;
  const textShapes = document.createElement("span");
  textShapes.classList.add("info-shapes_span");
  textShapes.innerText = `Shapes per second: ${this.shapesPerSecond}`;
  const textGravity = document.createElement("span");
  textGravity.classList.add("info-gravity_span");
  textGravity.innerText = `Gravity: ${this.gravity}`;
  const textDisplayed = document.createElement("span");
  textDisplayed.classList.add("info-displayed_span");
  textDisplayed.innerText = `Shapes being displayed: ${this.numberOfShapes}`;

  coveredArea.appendChild(textArea);
  shapesPerSecond.appendChild(textShapes);
  gravity.appendChild(textGravity);
  shapesDisplayed.appendChild(textDisplayed);

  this.infoContainer.insertAdjacentElement("beforeend", coveredArea);
  this.infoContainer.insertAdjacentElement("beforeend", shapesPerSecond);
  this.infoContainer.insertAdjacentElement("beforeend", gravity);
  this.infoContainer.insertAdjacentElement("beforeend", textDisplayed);
}

//updates textContent inside header
function updateHtmlText() {
  const textArea = document.querySelector(".info-area_span");
  textArea.innerHTML = `Covered area: ${this.coveredArea}`;
  const textShapes = document.querySelector(".info-shapes_span");
  textShapes.innerHTML = `Shapes per second: ${this.shapesPerSecond}`;
  const textGravity = document.querySelector(".info-gravity_span");
  textGravity.innerHTML = `Gravity: ${this.gravity}`;
  const textDisplayed = document.querySelector(".info-displayed_span");
  textDisplayed.innerHTML = `Shapes being displayed: ${this.numberOfShapes}`;
}

//creates sprite without params after adding shape
function createEmptySprite() {
  const sprite = new Sprite();
  sprite.eventMode = "static";

  return sprite;
}

//adds new shape to shapes array
function addShape(data) {
  const sprite = this.createEmptySprite();
  const ShapeClass = this.shapeClasses[random(0, this.shapeClasses.length)]; // randomly select type of shape
  const newShape = new ShapeClass(Object.assign(data, { sprite }));
  this.shapes.push(newShape);
  return newShape;
}

//creates new shape with sprite and event click listener to remove shape
function onAddShape(data) {
  const newShape = this.addShape.call(this, data);

  newShape.sprite.on("pointerdown", (e) => {
    e.stopPropagation();
    this.removeShape(newShape, this.onRemoveShape);
  });

  this.addSprite(newShape.sprite);
}

//removes sprite from display and clears from memory
function removeSprite(sprite) {
  this.background.removeChild(sprite);
  sprite.destroy();
}

// removes the shape specified in params
function onRemoveShape(shape) {
  this.removeSprite(shape.sprite);
}

// draws sprite on screen
function addSprite(sprite) {
  this.background.addChild(sprite);
}

// gravity logic
function moveShapes() {
  this.shapes.forEach((shape) => {
    shape.move({ x: 0, y: this.gravity });
  });
}

//generates shapes with certain params depends on screensize and required amount to generate per sec
function generateShapes(containerSize, amount) {
  const ms = new Date().getTime();
  for (let i = 0; i < amount; i++) {
    const width = SHAPE_SIZE.WIDTH;
    const height = SHAPE_SIZE.HEIGHT;
    this.onAddShape({
      id: ms,
      x: random(0, containerSize.width - width / 2),
      y: 0 - height,
      width,
      height,
    });
  }
}

//removes shape from shapes array
function removeShape(shapeToRemove, callback) {
  const shapeIndex = this.shapes.findIndex(
    (shape) => shape.id === shapeToRemove.id
  );
  callback(this.shapes[shapeIndex]);
  this.shapes.splice(shapeIndex, 1);
}

//removes shapes that passed the viewport
function removeFinishedShapes(containerSize, callback) {
  this.shapes
    .filter((shape) => shape.y >= containerSize.height + shape.height)
    .forEach((shape) => {
      this.removeShape(shape, callback);
    });
}

//emmits gravity logic and updating textcontent, creates new and removes finished shapes
function tick(containerSize, shouldGenerate) {
  // each second generate given amount of shapes and remove those, which are outside of the canvas
  if (shouldGenerate) {
    this.generateShapes(containerSize, this.shapesPerSecond);
    this.removeFinishedShapes(containerSize, this.onRemoveShape);
  }
  // move shapes and update stats
  // this.updateT();
  this.updateHtmlText();
  this.moveShapes();
}

export const ShapeService = {
  getRandomShape: getRandomShapeData,
  createEmptySprite,
  addShape,
  onAddShape,
  removeSprite,
  onRemoveShape,
  addSprite,
  generateShapes,
  removeShape,
  removeFinishedShapes,
};

export const AppService = {
  addButton,
  addBackground,
  addFields,
  addHtmlFields,
  updateT,
  updateHtmlText,
  moveShapes,
  tick,
};
