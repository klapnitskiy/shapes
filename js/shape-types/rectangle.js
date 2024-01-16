import { Shape } from "../shape";
import { random } from "../app";

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
