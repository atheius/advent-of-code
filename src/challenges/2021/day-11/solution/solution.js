import { readLinesOfDigits } from "../../../../helpers.js";

const getPointsGreaterThanValue = (inputMap, value) => {
  return inputMap.reduce((acc, row, y) => {
    const points = [];
    for (let x = 0; x < row.length; x++) {
      if (getValueAtPoint(inputMap, [y, x]) > value) {
        points.push([y, x]);
      }
    }
    if (points.length === 0) {
      return acc;
    }
    return [...acc, ...points];
  }, []);
};

const getValueAtPoint = (inputMap, [y, x]) => {
  const maxX = inputMap[0].length - 1;
  const maxY = inputMap.length - 1;
  if (x < 0 || x > maxX) {
    return -Infinity;
  }
  if (y < 0 || y > maxY) {
    return -Infinity;
  }
  return inputMap[y][x];
};

const getAdjacentPoints = ([y, x]) => [
  [y - 1, x - 1],
  [y - 1, x],
  [y - 1, x + 1],
  [y, x - 1],
  [y, x + 1],
  [y + 1, x - 1],
  [y + 1, x],
  [y + 1, x + 1],
];

const incrementMap = (inputMap, num) =>
  inputMap.reduce((acc, row) => {
    return [...acc, [...row.map((col) => (col += num))]];
  }, []);

const flash = (inputMap, inputPoint) => {
  const outputMap = [...inputMap];
  outputMap[inputPoint[0]][inputPoint[1]] = 0;
  getAdjacentPoints(inputPoint).forEach(([y, x]) => {
    const value = getValueAtPoint(inputMap, [y, x]);
    if (value > 0) {
      outputMap[y][x] += 1;
    }
  });
  return outputMap;
};

const runFlash = (inputMap) => {
  let outputMap = [...inputMap];

  let numFlashes = 0;
  let stillFlashing = true;

  while (stillFlashing) {
    const nextFlashes = getPointsGreaterThanValue(outputMap, 9);
    for (let point of nextFlashes) {
      numFlashes += 1;
      outputMap = flash(outputMap, point);
    }
    stillFlashing = nextFlashes.length !== 0;
  }

  return { outputMap, numFlashes };
};

const isSynchronized = (inputMap) =>
  inputMap.every((row) => row.every((col) => col === 0));

const part1 = (input) => {
  const octopusMap = readLinesOfDigits(input);
  const stepMaps = [octopusMap];

  let totalFlashes = 0;

  for (let step = 0; step < 100; step += 1) {
    const { outputMap: stepMap, numFlashes } = runFlash(
      incrementMap(stepMaps[step], 1)
    );
    totalFlashes += numFlashes;
    stepMaps.push(stepMap);
  }

  return totalFlashes;
};

const part2 = (input) => {
  const octopusMap = readLinesOfDigits(input);
  const stepMaps = [octopusMap];

  let synchronized = false;
  let step = 0;

  while (!synchronized) {
    const { outputMap: stepMap } = runFlash(incrementMap(stepMaps[step], 1));
    step += 1;
    synchronized = isSynchronized(stepMap);
    stepMaps.push(stepMap);
  }

  return step;
};

export { part1, part2 };
