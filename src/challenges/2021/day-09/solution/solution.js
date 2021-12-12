import { readLinesOfDigits, sum } from "../../../../helpers.js";

const getValueAtPosition = (map, [y, x], inverse = false) => {
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;
  if (x < 0 || x > maxX) {
    return inverse ? -Infinity : Infinity;
  }
  if (y < 0 || y > maxY) {
    return inverse ? -Infinity : Infinity;
  }
  return map[y][x];
};

const isPointInList = ([y, x], list) =>
  list.findIndex(([y2, x2]) => y === y2 && x === x2) !== -1;

const surroundingBasinPoints = ([y, x]) => [
  [y - 1, x],
  [y + 1, x],
  [y, x - 1],
  [y, x + 1],
];

const getMinValuePoints = (map) => {
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;

  const points = [];

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const checkValue = map[y][x];

      const surroundingValues = surroundingBasinPoints([y, x]).map((point) =>
        getValueAtPosition(map, point)
      );

      const isLocalMinimum = surroundingValues.every(
        (value) => value > checkValue
      );

      if (isLocalMinimum) {
        points.push([y, x]);
      }
    }
  }

  return points;
};

const getBasin = (map, basin, minValue, point) => {
  if (!isPointInList(point, basin)) {
    basin.push(point);
  }

  const basinPoints = surroundingBasinPoints(point).filter(([y, x]) => {
    const positionValue = getValueAtPosition(map, [y, x], true);
    if (
      !isPointInList([y, x], basin) &&
      positionValue > minValue &&
      positionValue < 9
    ) {
      return true;
    }
    return false;
  });

  basinPoints.forEach((basinPoint) => {
    getBasin(map, basin, minValue, basinPoint);
  });

  return basin;
};

const part1 = (input) => {
  const map = readLinesOfDigits(input);

  const points = getMinValuePoints(map).map((point) =>
    getValueAtPosition(map, point)
  );

  return sum(points) + points.length;
};

const part2 = (input) => {
  const map = readLinesOfDigits(input);

  const basins = getMinValuePoints(map).map((minPoint) =>
    getBasin(map, [], getValueAtPosition(map, minPoint, true), minPoint)
  );

  basins.sort((a, b) => b.length - a.length);

  return basins[0].length * basins[1].length * basins[2].length;
};

export { part1, part2 };
