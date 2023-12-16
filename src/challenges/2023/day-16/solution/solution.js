import { max, readLinesOfCharacters } from "../../../../helpers.js";

const withinGrid = (grid, [y, x]) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;

const nextStep = (grid, [currentY, currentX, currentDirection]) => {
  const currentPointChar = grid[currentY][currentX];

  let nextPoints = [];

  if (currentDirection === "north") {
    if (currentPointChar === ".") {
      nextPoints = [[currentY - 1, currentX, "north"]];
    }
    if (currentPointChar === "/") {
      nextPoints = [[currentY, currentX + 1, "east"]];
    }
    if (currentPointChar === "\\") {
      nextPoints = [[currentY, currentX - 1, "west"]];
    }
    if (currentPointChar === "|") {
      nextPoints = [[currentY - 1, currentX, "north"]];
    }
    if (currentPointChar === "-") {
      nextPoints = [
        [currentY, currentX - 1, "west"],
        [currentY, currentX + 1, "east"],
      ];
    }

    return nextPoints.filter((point) => withinGrid(grid, point));
  }

  if (currentDirection === "east") {
    if (currentPointChar === ".") {
      nextPoints = [[currentY, currentX + 1, "east"]];
    }
    if (currentPointChar === "/") {
      nextPoints = [[currentY - 1, currentX, "north"]];
    }
    if (currentPointChar === "\\") {
      nextPoints = [[currentY + 1, currentX, "south"]];
    }
    if (currentPointChar === "|") {
      nextPoints = [
        [currentY - 1, currentX, "north"],
        [currentY + 1, currentX, "south"],
      ];
    }
    if (currentPointChar === "-") {
      nextPoints = [[currentY, currentX + 1, "east"]];
    }
    return nextPoints.filter((point) => withinGrid(grid, point));
  }

  if (currentDirection === "south") {
    if (currentPointChar === ".") {
      nextPoints = [[currentY + 1, currentX, "south"]];
    }
    if (currentPointChar === "/") {
      nextPoints = [[currentY, currentX - 1, "west"]];
    }
    if (currentPointChar === "\\") {
      nextPoints = [[currentY, currentX + 1, "east"]];
    }
    if (currentPointChar === "|") {
      nextPoints = [[currentY + 1, currentX, "south"]];
    }
    if (currentPointChar === "-") {
      nextPoints = [
        [currentY, currentX - 1, "west"],
        [currentY, currentX + 1, "east"],
      ];
    }
    return nextPoints.filter((point) => withinGrid(grid, point));
  }

  if (currentDirection === "west") {
    if (currentPointChar === ".") {
      nextPoints = [[currentY, currentX - 1, "west"]];
    }
    if (currentPointChar === "/") {
      nextPoints = [[currentY + 1, currentX, "south"]];
    }
    if (currentPointChar === "\\") {
      nextPoints = [[currentY - 1, currentX, "north"]];
    }
    if (currentPointChar === "|") {
      nextPoints = [
        [currentY - 1, currentX, "north"],
        [currentY + 1, currentX, "south"],
      ];
    }
    if (currentPointChar === "-") {
      nextPoints = [[currentY, currentX - 1, "west"]];
    }
    return nextPoints.filter((point) => withinGrid(grid, point));
  }
};

const getEnergisedTiles = (grid, startPosition) => {
  // Keep track of all the positions that have been visited (y,x,direction)
  const positions = new Set();
  positions.add(`${startPosition[0]},${startPosition[1]},${startPosition[2]}`);

  let currentPositions = [startPosition];
  while (currentPositions.length > 0) {
    const nextPositions = [];
    for (const position of currentPositions) {
      const nextPoints = nextStep(grid, position);
      for (const [y, x, direction] of nextPoints) {
        if (!positions.has(`${y},${x},${direction}`)) {
          nextPositions.push([y, x, direction]);
          positions.add(`${y},${x},${direction}`);
        }
      }
    }
    currentPositions = nextPositions;
  }

  // Return the number of unique positions
  return [...positions].reduce((tiles, path) => {
    const [y, x] = path.split(",");
    tiles.add(`${y},${x}`);
    return tiles;
  }, new Set()).size;
};

const part1 = (input) =>
  getEnergisedTiles(readLinesOfCharacters(input), [0, 0, "east"]);

const part2 = (input) => {
  const grid = readLinesOfCharacters(input);

  const startPositions = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length - 1; x++) {
      if (y === 0) {
        // North side
        startPositions.push([y, x, "south"]);
      }
      if (y === grid.length - 1) {
        // South side
        startPositions.push([y, x, "north"]);
      }
      if (x === 0) {
        // West side
        startPositions.push([y, x, "east"]);
      }
      if (x === grid[0].length - 1) {
        // East side
        startPositions.push([y, x, "west"]);
      }
    }
  }

  return max(
    startPositions.map((position) => getEnergisedTiles(grid, position))
  );
};

export { part1, part2 };
