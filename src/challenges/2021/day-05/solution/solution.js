import { readLines } from "../../../../helpers.js";

const readInput = (input) =>
  readLines(input).map((line) => {
    const points = line.split(" -> ");
    const point1 = points[0].split(",").map((x) => parseInt(x, 10));
    const point2 = points[1].split(",").map((x) => parseInt(x, 10));
    return { x1: point1[0], y1: point1[1], x2: point2[0], y2: point2[1] };
  });

const updateMap = (prevMap, x, y) => {
  const map = [...prevMap];
  if (map[y] === undefined) {
    map[y] = [];
  }
  if (map[y][x] === undefined) {
    map[y][x] = 0;
  }
  map[y][x] += 1;
  return map;
};

/**
 * Generate a map of the vents
 * @param {*} points
 * @param {*} includeDiagonal
 * @returns
 */
const generateVentMap = (points, includeDiagonal = false) => {
  let ventMap = [];

  for (let { x1, y1, x2, y2 } of points) {
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);

    if (!includeDiagonal && x1 !== x2 && y1 !== y2) {
      continue;
    }

    let x, y;
    while (x !== x2 || y !== y2) {
      x = (x ?? x1 - dx) + dx;
      y = (y ?? y1 - dy) + dy;
      ventMap = updateMap(ventMap, x, y);
    }
  }

  return ventMap;
};

const getOverlapCount = (map) =>
  map.reduce(
    (a, row = []) => a + row.reduce((a, x) => a + (x > 1 ? 1 : 0), 0),
    0
  );

const part1 = (input) => {
  const points = readInput(input);
  const ventMap = generateVentMap(points);
  return getOverlapCount(ventMap);
};

const part2 = (input) => {
  const points = readInput(input);
  const ventMap = generateVentMap(points, true);
  return getOverlapCount(ventMap);
};

export { part1, part2 };
