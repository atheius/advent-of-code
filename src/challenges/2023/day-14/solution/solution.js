import {
  readLinesOfCharacters,
  clone,
  rotateGridClockwise,
} from "../../../../helpers.js";

const roll = (grid) => {
  const nextGrid = clone(grid);

  const rows = grid.length;
  const columns = grid[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      // Roll 0 north
      if (nextGrid[y][x] === "O") {
        let move = false;
        let offset = 1;
        while (
          y - offset >= 0 &&
          nextGrid[y - offset][x] !== "O" &&
          nextGrid[y - offset][x] !== "#"
        ) {
          move = true;
          offset++;
        }
        if (move) {
          nextGrid[y - offset + 1][x] = "O";
          nextGrid[y][x] = ".";
        }
      }
    }
  }

  return nextGrid;
};

const calculateLoad = (grid) => {
  const rows = grid.length;
  const columns = grid[0].length;
  let total = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (grid[y][x] === "O") {
        total += rows - y;
      }
    }
  }

  return total;
};

const cycle = (grid) => {
  // Roll north
  let next = roll(grid);
  // Rotate grid and roll (West)
  next = roll(rotateGridClockwise(next));
  // Rotate grid and roll (South)
  next = roll(rotateGridClockwise(next));
  // Rotate grid and roll (East)
  next = roll(rotateGridClockwise(next));
  // Rotate grid back to original orientation
  return rotateGridClockwise(next);
};

const part1 = (input) => calculateLoad(roll(readLinesOfCharacters(input)));

const part2 = (input) => {
  const grid = readLinesOfCharacters(input);

  const loads = [calculateLoad(grid)];

  let cycleMap = {};
  let cycleNum = 0;
  let next = grid;

  while (true) {
    cycleNum += 1;
    next = cycle(next);
    const load = calculateLoad(next);
    loads.push(load);
    if (!cycleMap[load]) {
      cycleMap[load] = [cycleNum];
    } else {
      cycleMap[load].push(cycleNum);
      if (cycleMap[load].length > 100) {
        break;
      }
    }
  }

  // Some slightly dodgy maths, but seems to do the trick....

  const firstLoopNumber = Object.keys(cycleMap)[0];

  const [a, b] = cycleMap[firstLoopNumber].slice(0, 2);

  const cycleLength = b - a;

  const firstTimeSeenInCycle = cycleMap[firstLoopNumber][0];

  const offset = (1000000000 - firstTimeSeenInCycle) % cycleLength;

  return loads[loads.indexOf(Number.parseInt(firstLoopNumber)) + offset];
};

export { part1, part2 };
