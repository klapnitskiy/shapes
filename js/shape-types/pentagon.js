import { Shape } from "../shape";
import { random } from "../helpers";

export class Pentagon extends Shape {
  constructor(data = {}) {
    super(
      Object.assign(data, {
        points: [
          {
            x: data.x + data.width / 3,
            y: data.y + data.height / 3,
          },
          {
            x: data.x + data.width / 2,
            y: data.y + data.height / 1.2,
          },
          {
            x: data.x - data.width / 4,
            y: data.y + data.height,
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
