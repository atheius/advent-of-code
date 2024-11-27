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

const createGrid = (width, height, rockLines, mid) => {
  console.log("width", width);
  console.log("height", height);

  const grid = [];
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      grid[row][col] = ".";
    }
  }

  let dx, dy;
  for (const line of rockLines) {
    for (const [[x1, y1], [x2, y2]] of aperture(2, line)) {
      dx = Math.sign(x2 - x1);
      dy = Math.sign(y2 - y1);

      console.log("==", [x1, y1], [x2, y2], dx, dy);

      if (dx < 0) {
        // left
        for (let i = x1; i > x2 - 1; i--) {
          grid[y1][mid + (i - 500)] = "#";
        }
      }

      if (dx > 0) {
        // right
        for (let i = x1; i < x2 + 1; i++) {
          grid[y1][mid + (i - 500)] = "#";
        }
      }

      if (dy < 0) {
        // up
        for (let i = y1; i > y2 - 1; i--) {
          grid[i][mid + (x1 - 500)] = "#";
        }
      }

      if (dy > 0) {
        // down
        for (let i = y1; i < y2 + 1; i++) {
          grid[i][mid + (x1 - 500)] = "#";
        }
      }
    }
  }

  return grid;
};

const addSand = (grid, source, minX, maxX) => {
  let addedSand = 0;

  let [sandRow, sandCol] = source;

  let stopped = false;
  let down = 1;
  let currentX = sandCol;
  while (!stopped) {
    if (
      currentX < 0 ||
      currentX > grid[0].length - 1 ||
      sandRow + down > grid[0].length - 1
    ) {
      stopped = true;
    }
    // console.log("currentX", currentX);
    // console.log("down", down);

    console.log("checking", sandRow + down, currentX);
    if (grid[sandRow + down][currentX] !== ".") {
      // console.log("check diagonal left", sandRow + down, currentX - 1);
      // console.log("check diagonal right", sandRow + down, currentX + 1);
      if (grid[sandRow + down][currentX - 1] === "." || currentX - 1 < 0) {
        // diagonal left
        // console.log("go left");
        currentX -= 1;
      } else if (
        grid[sandRow + down][currentX + 1] === "." ||
        currentX + 1 > maxX
      ) {
        // diagonal right
        // console.log("go right");
        currentX += 1;
      } else {
        // stopped
        stopped = true;
        grid[sandRow + down - 1][currentX] = "o";
        addedSand += 1;
      }
    }
    down += 1;
  }
  return { grid, changed: addedSand };
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

  console.log(rockLines);

  const { minX, maxX, minY, maxY } = findLimits(rockLines);

  // Relative to grid
  const sandSource = [1, 500 - minX];

  console.log({ minX, maxX, minY, maxY });

  const mid = 500 - minX;

  const grid = createGrid(maxX - minX + 1, maxY - minY + 1, rockLines, mid);

  console.log({ minX, maxX, minY, maxY });

  printGrid(grid);

  let keepAddingSand = true;

  let grainsOfSand = 0;
  while (keepAddingSand) {
    console.log(`---- SAND ${(i + 1).toString()} ----`);
    const { grid: nextGrid, addedSand } = addSand(
      grid,
      sandSource,
      minX,
      maxX,
      mid
    );
    grainsOfSand += addedSand;
    if (addedSand === 0) {
      keepAddingSand = false;
    }
    printGrid(nextGrid);
  }

  return grainsOfSand;
};

const part2 = (input) => {
  return null;
};

export { part1, part2 };
