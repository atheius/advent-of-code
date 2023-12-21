import { readLinesOfCharacters } from "../../../../helpers.js";

const parseInput = (input) => {
  return readLinesOfCharacters(input);
};

const findStart = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "S") {
        return [y, x];
      }
    }
  }
};

const inBounds = (grid, [y, x]) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

const getSurroundingPoints = ([y, x]) => [
  [y - 1, x],
  [y, x + 1],
  [y + 1, x],
  [y, x - 1],
];

const isPlot = (grid, [y, x]) => grid[y][x] !== "#";

const part1 = (input, maxSteps = 64) => {
  const grid = parseInput(input);

  const start = findStart(grid);

  const stepPositions = new Set();
  const queue = [[start, 0]];

  while (queue.length) {
    const [position, steps] = queue.shift();

    const [nextY, nextX] = position;

    if (stepPositions.has(`${nextY},${nextX}`)) {
      continue;
    }

    if (steps % 2 === 0) {
      // Only add even steps
      stepPositions.add(`${nextY},${nextX}`);
    }

    if (steps > maxSteps) {
      continue;
    }

    const points = getSurroundingPoints([nextY, nextX]);

    for (const [y, x] of points) {
      if (!inBounds(grid, [y, x])) {
        continue;
      }

      if (isPlot(grid, [y, x])) {
        queue.push([[y, x], steps + 1]);
      }
    }
  }

  return stepPositions.size;
};

const part2 = (input, maxSteps = 26501365) => {
  const grid = parseInput(input);

  const start = findStart(grid);

  const stepPositions = new Map();
  const queue = [[start, 0]];

  // BFS of the grid, keeping track of the steps to each point
  while (queue.length) {
    const [position, steps] = queue.shift();
    const [nextY, nextX] = position;

    if (stepPositions.has(`${nextY},${nextX}`)) {
      continue;
    }

    if (steps > maxSteps) {
      continue;
    }

    stepPositions.set(`${nextY},${nextX}`, steps);

    const points = getSurroundingPoints([nextY, nextX]);

    for (const [y, x] of points) {
      if (!inBounds(grid, [y, x])) {
        continue;
      }

      if (isPlot(grid, [y, x])) {
        queue.push([[y, x], steps + 1]);
      }
    }
  }

  // Due to the nature of the input (a repeating diamond shape), we can use a geometric solution to this problem.
  // This blog has a good explanation...
  // https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21

  const stepPositionValues = [...stepPositions.values()];

  const halfGridLength = Math.floor(grid.length / 2);

  const evenCorners = stepPositionValues.filter(
    (v) => v % 2 === 0 && v > halfGridLength
  ).length;

  const oddCorners = stepPositionValues.filter(
    (v) => v % 2 === 1 && v > halfGridLength
  ).length;

  const evenFull = stepPositionValues.filter((v) => v % 2 === 0).length;

  const oddFull = stepPositionValues.filter((v) => v % 2 === 1).length;

  const n = Math.floor((maxSteps - Math.floor(grid.length / 2)) / grid.length);

  const total =
    (n + 1) * (n + 1) * oddFull +
    n * n * evenFull -
    (n + 1) * oddCorners +
    n * evenCorners;

  return total;
};

export { part1, part2 };
