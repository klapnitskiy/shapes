import { Shape } from "../shape";
import { random } from "../app";

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
