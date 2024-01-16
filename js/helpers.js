const vectorProd = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

export const random = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const polygonArea = (points) =>
  points.reduce(
    (prev, curr, index, array) =>
      prev + (index > 0 ? vectorProd(array[index - 1], curr) : 0),
    0
  ) / 2;
