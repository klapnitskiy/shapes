import { Shape } from "../shape";
import { random } from "../app";

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
