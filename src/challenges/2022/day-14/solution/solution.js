import { readLines, aperture } from "../../../../helpers.js";

const findLimits = (lines) =>
  lines.reduce(
    (acc, line) => {
      for (const [x, y] of line) {
        if (x < acc.minX) {
          acc.minX = x;
        }
        if (x > acc.maxX) {
          acc.maxX = x;
        }
        if (y > acc.maxY) {
          acc.maxY = y;
        }
      }
      return acc;
    },
    {
      minX: 500,
      minY: 0, // minY stays 0 (source of sand)
      maxX: 500,
      maxY: 0,
    }
  );

const createGrid = (width, height, rockLines, relativeX, addBottom = false) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      if (addBottom && row === height - 1) {
        grid[row][col] = "#";
      } else {
        grid[row][col] = ".";
      }
    }
  }

  let dx, dy;
  for (const line of rockLines) {
    for (const [[x1, y1], [x2, y2]] of aperture(2, line)) {
      dx = Math.sign(x2 - x1);
      dy = Math.sign(y2 - y1);
      // draw left
      if (dx < 0) {
        for (let i = x1; i > x2 - 1; i--) {
          grid[y1][relativeX + (i - 500)] = "#";
        }
      }
      // draw right
      if (dx > 0) {
        for (let i = x1; i < x2 + 1; i++) {
          grid[y1][relativeX + (i - 500)] = "#";
        }
      }
      // draw up
      if (dy < 0) {
        for (let i = y1; i > y2 - 1; i--) {
          grid[i][relativeX + (x1 - 500)] = "#";
        }
      }
      // draw down
      if (dy > 0) {
        for (let i = y1; i < y2 + 1; i++) {
          grid[i][relativeX + (x1 - 500)] = "#";
        }
      }
    }
  }

  return grid;
};

const addSand = (grid, sandX, maxX, isInfinite = true) => {
  let finished = false; // track whether simulation is done
  let down = 0; // track how far down we are
  let currentX = sandX; // track left / right position

  while (true) {
    if (
      isInfinite &&
      (currentX < 0 || currentX > grid[0].length - 1 || down > grid.length - 1)
    ) {
      // sand will run to infinity
      finished = true;
      break;
    }

    if (grid[down][currentX] === ".") {
      // down
      down += 1;
      continue;
    }

    if (grid[down][currentX - 1] === "." || currentX - 1 < 0) {
      // diagonal left
      down += 1;
      currentX -= 1;
      continue;
    }

    if (grid[down][currentX + 1] === "." || currentX + 1 > maxX) {
      // diagonal right
      down += 1;
      currentX += 1;
      continue;
    }

    // Did the sand stop at the source?
    if (down === 1 && currentX === sandX) {
      grid[0][sandX] = "o";
      finished = true;
      break;
    }

    // grain of sand has stopped
    grid[down - 1][currentX] = "o";
    break;
  }

  return { grid, finished };
};

const runSandSimulation = (grid, sandSourceRelativeX, maxX, type = 1) => {
  let nextGrid = grid;
  let grainsOfSand = 0;
  while (true) {
    const res = addSand(nextGrid, sandSourceRelativeX, maxX);
    nextGrid = res.grid;
    grainsOfSand += 1;
    if (res.finished) {
      if (type === 1) {
        // If this is part1, don't count the last grain of sand (reached infinty)
        grainsOfSand -= 1;
      }
      break;
    }
  }
  return grainsOfSand;
};

const parseInput = (input) =>
  readLines(input).map((x) =>
    x.split(" -> ").map((x) => x.split(",").map((x) => Number.parseInt(x, 10)))
  );

const part1 = (input) => {
  const rockLines = parseInput(input);

  const { minX, maxX, minY, maxY } = findLimits(rockLines);
  const sandSourceRelativeX = 500 - minX;

  const grid = createGrid(
    maxX - minX + 1,
    maxY - minY + 1,
    rockLines,
    sandSourceRelativeX
  );

  return runSandSimulation(grid, sandSourceRelativeX, maxX);
};

const part2 = (input) => {
  const rockLines = parseInput(input);

  // Set sensible bound for floor size (could be infinitely long)
  const floorSize = 300;

  const { minX, maxX, minY, maxY } = findLimits(rockLines);
  const sandSourceRelativeX = 500 - minX + floorSize / 2;

  const grid = createGrid(
    maxX - minX + floorSize,
    maxY - minY + 3,
    rockLines,
    sandSourceRelativeX,
    true
  );

  return runSandSimulation(grid, sandSourceRelativeX, maxX, 2);
};

export { part1, part2 };
