import { readLines, aperture } from "../../../../helpers.js";

const findLimits = (input) => {
  let minX = 500;
  let minY = 0; // minY stays 0 (source of sand)
  let maxX = 500;
  let maxY = 0;
  for (const line of input) {
    for (const [x, y] of line) {
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

const createGrid = (width, height, rockLines, mid, addBottom = false) => {
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

      // left
      if (dx < 0) {
        for (let i = x1; i > x2 - 1; i--) {
          grid[y1][mid + (i - 500)] = "#";
        }
      }

      // right
      if (dx > 0) {
        for (let i = x1; i < x2 + 1; i++) {
          grid[y1][mid + (i - 500)] = "#";
        }
      }

      // up
      if (dy < 0) {
        for (let i = y1; i > y2 - 1; i--) {
          grid[i][mid + (x1 - 500)] = "#";
        }
      }

      // down
      if (dy > 0) {
        for (let i = y1; i < y2 + 1; i++) {
          grid[i][mid + (x1 - 500)] = "#";
        }
      }
    }
  }

  return grid;
};

const addSand = (grid, sandCol, maxX, isInfinite = true) => {
  let addedSand = 0;
  let finished = false;

  let stopped = false;
  let down = 0;
  let currentX = sandCol;
  while (!stopped) {
    if (
      isInfinite &&
      (currentX < 0 || currentX > grid[0].length - 1 || down > grid.length - 1)
    ) {
      stopped = true;
      break;
    }

    if (grid[down][currentX] !== ".") {
      if (grid[down][currentX - 1] === "." || currentX - 1 < 0) {
        // diagonal left
        currentX -= 1;
      } else if (grid[down][currentX + 1] === "." || currentX + 1 > maxX) {
        // diagonal right
        currentX += 1;
      } else {
        // down
        stopped = true;
        addedSand += 1;
        if (down === 1 && currentX === sandCol) {
          grid[0][sandCol] = "o";
          finished = true;
        } else {
          grid[down - 1][currentX] = "o";
        }
      }
    }
    down += 1;
  }

  return { updatedGrid: grid, addedSand, finished };
};

const printGrid = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(row.toString().padStart(2, "0") + " " + grid[row].join(""));
  }
};

const runSimulation = (grid, sandSourceRelativeX, maxX) => {
  let keepAddingSand = true;
  let nextGrid = grid;
  let grainsOfSand = 0;
  while (keepAddingSand) {
    const res = addSand(nextGrid, sandSourceRelativeX, maxX);
    nextGrid = res.updatedGrid;
    grainsOfSand += res.addedSand;
    if (res.addedSand === 0 || res.finished) {
      keepAddingSand = false;
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

  const grainsOfSand = runSimulation(grid, sandSourceRelativeX, maxX);

  return grainsOfSand;
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

  const grainsOfSand = runSimulation(grid, sandSourceRelativeX, maxX);

  return grainsOfSand;
};

export { part1, part2 };
