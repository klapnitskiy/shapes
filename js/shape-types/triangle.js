import { Shape } from "../shape";
import { random } from "../helpers";

export class Triangle extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: data.x + data.width / 2,
            y: data.y + data.height,
          },
          {
            x: data.x - data.width / 2,
            y: data.y + data.height,
          },
        ],
      })
    );
  }
}
