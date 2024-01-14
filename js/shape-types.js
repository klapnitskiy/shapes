import { Shape } from "./shape";
import { random } from "./app";

export class Circle extends Shape {
  constructor(data = {}) {
    super(data);
  }

  render() {
    const g = this.createGraphics();
    g.beginFill(this.color);
    g.drawCircle(this.x, this.y, this.width / 2);
    g.endFill();
    return g;
  }

  getArea() {
    return Math.PI * Math.pow(this.width / 2, 2);
  }
}

export class Ellipse extends Shape {
  constructor(data = {}) {
    super(data);
  }

  render() {
    const g = this.createGraphics();
    g.beginFill(this.tint);
    g.drawEllipse(this.x, this.y, this.width / 2, this.height / 2);
    g.endFill();
    return g;
  }

  getArea() {
    return Math.PI * (this.width / 2) * (this.height / 2);
  }
}

export class Rectangle extends Shape {
  constructor(data = {}) {
    super(data);
  }

  render() {
    const g = this.createGraphics();
    g.beginFill(this.tint);
    g.drawRect(this.x, this.y, this.width, this.height);
    g.endFill();
    return g;
  }

  getArea() {
    return this.width * this.height;
  }
}

export class Triangle extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: random(data.x, data.x + data.width / 2),
            y: random(data.y + data.height / 3, data.y + data.height),
          },
          {
            x: random(Math.max(0, data.x - data.width / 2), data.x),
            y: random(data.y + data.height / 3, data.y + data.height),
          },
        ],
      })
    );
  }
}

export class Pentagon extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: random(data.x, data.x + data.width / 2),
            y: random(data.y, data.y + data.height / 2),
          },
          {
            x: random(data.x, data.x + data.width / 2),
            y: random(data.y + data.height / 2, data.y + data.height),
          },
          {
            x: random(Math.max(0, data.x - data.width / 2), data.x),
            y: random(data.y + data.height / 2, data.y + data.height),
          },
          {
            x: random(Math.max(0, data.x - data.width / 2), data.x),
            y: random(data.y, data.y + data.height / 2),
          },
        ],
      })
    );
  }
}

export class Hexagon extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: random(data.x, data.x + data.width / 2),
            y: random(data.y, data.y + data.height / 2),
          },
          {
            x: random(data.x, data.x + data.width / 2),
            y: random(data.y + data.height / 2, data.y + data.height),
          },
          { x: data.x, y: data.y + data.height },
          {
            x: random(Math.max(0, data.x - data.width / 2), data.x),
            y: random(data.y + data.height / 2, data.y + data.height),
          },
          {
            x: random(Math.max(0, data.x - data.width / 2), data.x),
            y: random(data.y, data.y + data.height / 2),
          },
        ],
      })
    );
  }
}
