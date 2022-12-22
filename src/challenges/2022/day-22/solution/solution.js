import { sum } from "../../../../helpers.js";

const parseInstructions = (input) => {
  const split = input.split("\n\n");
  return {
    map: split[0].split("\n").map((x) => x.split("")),
    instructions: split[1].match(/[a-zA-Z]+|[0-9]+/g).map((x) => {
      if (Number.isInteger(Number.parseInt(x, 10))) {
        return Number.parseInt(x, 10);
      }
      return x;
    }),
  };
};

const printMap = (map) => {
  for (const line of map) {
    console.log(line.join(""));
  }
};

// Map my values for north/east/south/west for left/right/up/down
const facingMap = {
  0: 3,
  1: 0,
  2: 1,
  3: 2,
};

// This function allows negative mod
const mod = (n, m) => ((n % m) + m) % m;

const getNextStep = (map, direction, [row, col], numSteps) => {
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  let blocked = false;
  let step = 1;
  let lastStep = [row, col];
  let currentPosition = [row, col];
  let nextPosition;
  while (step <= numSteps && !blocked) {
    const [currentRow, currentCol] = currentPosition;

    switch (direction) {
      case 0:
        nextPosition = [mod(currentRow - 1, mapHeight), currentCol];
        break;
      case 1:
        nextPosition = [currentRow, mod(currentCol + 1, mapWidth)];
        break;
      case 2:
        nextPosition = [mod(currentRow + 1, mapHeight), currentCol];
        break;
      case 3:
        nextPosition = [currentRow, mod(currentCol - 1, mapWidth)];
        break;
    }

    const [nextRow, nextCol] = nextPosition;

    switch (map[nextRow][nextCol]) {
      case ".":
        // We can take a step forward
        // console.log("STEP", nextPosition);
        step += 1;
        lastStep = nextPosition;
        currentPosition = nextPosition;
        break;
      case "#":
        // The path is blocked
        // console.log("BLOCKED", nextPosition);
        blocked = true;
        break;
      default:
        currentPosition = nextPosition;
        break;
    }
  }
  return lastStep;
};

const part1 = (input) => {
  const { instructions, map } = parseInstructions(input);

  const startPosition = [0, map[0].indexOf(".")];
  const startDirection = 1; // 0 North, 1 = East, 2 = South, 3 = West

  let currentDirection = startDirection;
  let currentPosition = startPosition;
  for (const instruction of instructions) {
    if (["R", "L"].includes(instruction)) {
      // Change direction
      currentDirection =
        instruction === "L"
          ? mod(currentDirection - 1, 4)
          : mod(currentDirection + 1, 4);
    } else {
      // Move a number of steps forward
      currentPosition = getNextStep(
        map,
        currentDirection,
        currentPosition,
        instruction
      );
    }
  }

  const [row, col] = currentPosition;

  const facing = facingMap[currentDirection.toString()];
  const rowValue = 1000 * (row + 1);
  const colValue = 4 * (col + 1);

  return sum([rowValue, colValue, facing]);
};

const part2 = (input) => {
  return null;
};

export { part1, part2 };
