import { transpose } from "../../../../helpers.js";

const parseInput = (input) =>
  input
    .trim()
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => x.split("")));

const findReflectionLine = (grid, checkBroken = false) => {
  for (let y = 1; y < grid.length; y++) {
    let brokenCount = 0;
    let reflected = true;
    for (let offset = 0; offset < grid.length; offset++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (y - offset - 1 >= 0 && y + offset < grid.length) {
          if (grid[y + offset][x] !== grid[y - offset - 1][x]) {
            reflected = false;
            brokenCount += 1;
          }
        }
      }
    }

    if (checkBroken && brokenCount === 1) {
      return y;
    }
    if (!checkBroken && reflected) {
      return y;
    }
  }

  return false;
};

const part1 = (input) => {
  const grids = parseInput(input);

  let total = 0;
  for (const grid of grids) {
    const reflectionLineHorizontal = findReflectionLine(grid);
    if (reflectionLineHorizontal) {
      total += reflectionLineHorizontal * 100;
    } else {
      total += findReflectionLine(transpose(grid));
    }
  }

  return total;
};

const part2 = (input) => {
  const grids = parseInput(input);

  let total = 0;
  for (const grid of grids) {
    let reflectionLineHorizontal = findReflectionLine(grid, true);
    let reflectionLineVertical = findReflectionLine(transpose(grid), true);

    if (!reflectionLineHorizontal && !reflectionLineVertical) {
      reflectionLineHorizontal = findReflectionLine(grid);
      reflectionLineVertical = findReflectionLine(transpose(grid));
    }

    if (reflectionLineHorizontal) {
      total += reflectionLineHorizontal * 100;
    } else {
      total += reflectionLineVertical;
    }
  }

  return total;
};

export { part1, part2 };
