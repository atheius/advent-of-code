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

const addSand = (grid, source, maxX, isInfinite = true) => {
  let addedSand = 0;
  let finished = false;
  let [sandRow, sandCol] = source;

  let stopped = false;
  let down = 0;
  let currentX = sandCol;
  while (!stopped) {
    if (
      isInfinite &&
      (currentX < 0 ||
        currentX > grid[0].length - 1 ||
        sandRow + down > grid.length - 1)
    ) {
      stopped = true;
      break;
    }

    if (grid[sandRow + down][currentX] !== ".") {
      if (grid[sandRow + down][currentX - 1] === "." || currentX - 1 < 0) {
        // diagonal left
        currentX -= 1;
      } else if (
        grid[sandRow + down][currentX + 1] === "." ||
        currentX + 1 > maxX
      ) {
        // diagonal right
        currentX += 1;
      } else {
        stopped = true;
        if (sandRow + down === source[0] && currentX === source[1]) {
          addedSand += 1;
          grid[source[0] - 1][source[1]] = "o";
          finished = true;
        } else {
          addedSand += 1;
          grid[sandRow + down - 1][currentX] = "o";
        }
      }
    }
    down += 1;
  }

  return { grid, addedSand, finished };
};

const printGrid = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(row.toString().padStart(2, "0") + " " + grid[row].join(""));
  }
};

const part1 = (input) => {
  const rockLines = readLines(input).map((x) =>
    x.split(" -> ").map((x) => x.split(",").map((x) => Number.parseInt(x, 10)))
  );

  const { minX, maxX, minY, maxY } = findLimits(rockLines);

  const sandSource = [1, 500 - minX];

  const mid = 500 - minX;

  const grid = createGrid(maxX - minX + 1, maxY - minY + 1, rockLines, mid);

  let keepAddingSand = true;
  let nextGrid = grid;
  let i = 0;
  let grainsOfSand = 0;
  while (keepAddingSand) {
    const res = addSand(nextGrid, sandSource, maxX);
    nextGrid = res.grid;
    grainsOfSand += res.addedSand;
    if (res.addedSand === 0) {
      keepAddingSand = false;
    }
    i += 1;
  }

  return grainsOfSand;
};

const part2 = (input) => {
  const rockLines = readLines(input).map((x) =>
    x.split(" -> ").map((x) => x.split(",").map((x) => Number.parseInt(x, 10)))
  );

  const { minX, maxX, minY, maxY } = findLimits(rockLines);

  const sandSource = [1, 500 - minX + 200];

  const mid = 500 - minX + 200;

  const grid = createGrid(
    maxX - minX + 400,
    maxY - minY + 3,
    rockLines,
    mid,
    true
  );

  let grainsOfSand = 0;

  let keepAddingSand = true;
  let nextGrid = grid;
  let i = 0;
  while (keepAddingSand) {
    const res = addSand(nextGrid, sandSource, maxX);
    nextGrid = res.grid;

    grainsOfSand += res.addedSand;

    if (res.finished) {
      keepAddingSand = false;
    }
    i += 1;
  }

  return grainsOfSand;
};

export { part1, part2 };
