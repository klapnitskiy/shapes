import { Shape } from "../shape";

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
