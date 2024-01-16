import { Shape } from "../shape";
import { random } from "../helpers";

export class Hexagon extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: data.x + data.width / 2,
            y: data.y + data.height / 3,
          },
          {
            x: data.x + data.width / 2,
            y: data.y + data.height / 1.3,
          },
          { x: data.x, y: data.y + data.height },
          {
            x: data.x - data.width / 2,
            y: data.y + data.height / 1.3,
          },
          {
            x: data.x - data.width / 2,
            y: data.y + data.height / 3,
          },
        ],
      })
    );
  }
}
