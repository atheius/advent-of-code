import { readLinesOfCharacters, rotate } from "../../../../helpers.js";

const DIRECTIONS = {
  north: [-1, 0],
  northEast: [-1, 1],
  northWest: [-1, -1],
  south: [1, 0],
  southEast: [1, 1],
  southWest: [1, -1],
  west: [0, -1],
  east: [0, 1],
};

const INSTRUCTIONS = [
  {
    name: "north",
    check: [DIRECTIONS.north, DIRECTIONS.northEast, DIRECTIONS.northWest],
    move: DIRECTIONS.north,
  },
  {
    name: "south",
    check: [DIRECTIONS.south, DIRECTIONS.southEast, DIRECTIONS.southWest],
    move: DIRECTIONS.south,
  },
  {
    name: "west",
    check: [DIRECTIONS.west, DIRECTIONS.northWest, DIRECTIONS.southWest],
    move: DIRECTIONS.west,
  },
  {
    name: "east",
    check: [DIRECTIONS.east, DIRECTIONS.northEast, DIRECTIONS.southEast],
    move: DIRECTIONS.east,
  },
];

const getElfPositions = (grid) => {
  const elfPositions = [];
  for (const [rowIndex, row] of grid.entries()) {
    for (const [colIndex, col] of row.entries()) {
      if (col === "#") {
        elfPositions.push([rowIndex, colIndex]);
      }
    }
  }
  return elfPositions;
};

const getElfLimits = (elves) => {
  const limits = {
    maxRow: Number.NEGATIVE_INFINITY,
    minRow: Number.POSITIVE_INFINITY,
    maxCol: Number.NEGATIVE_INFINITY,
    minCol: Number.POSITIVE_INFINITY,
  };

  for (const [row, col] of elves) {
    if (row > limits.maxRow) {
      limits.maxRow = row;
    }
    if (row < limits.minRow) {
      limits.minRow = row;
    }
    if (col > limits.maxCol) {
      limits.maxCol = col;
    }
    if (col < limits.minCol) {
      limits.minCol = col;
    }
  }

  return limits;
};

const coordinateInList = (coord, listOfCoords) =>
  !!listOfCoords.find((x) => x[0] === coord[0] && x[1] === coord[1]);

const isSurroundingAreaClear = (allElves) => {
  const elvesToMove = [];
  for (const elf of allElves) {
    for (const coord of Object.values(DIRECTIONS)) {
      // Move the elf if there is an adjacent elf
      if (coordinateInList([elf[0] + coord[0], elf[1] + coord[1]], allElves)) {
        // Only add to the moving list if not already
        if (!coordinateInList(elf, elvesToMove)) {
          elvesToMove.push(elf);
        }
      }
    }
  }
  return elvesToMove;
};

// This function is very slow for large inputs - should probably be optimised
const moveElves = (allElves, instructionIdx) => {
  const nextInstructions = rotate(INSTRUCTIONS, instructionIdx);

  // Check which elves are going to move
  const elvesToMove = isSurroundingAreaClear(allElves);

  let elvesNotMoving = [];
  for (const elf of allElves) {
    if (!coordinateInList(elf, elvesToMove)) {
      elvesNotMoving.push(elf);
    }
  }

  // Move the elves using instructions
  const nextElfProposedPositions = {};
  for (const elf of elvesToMove) {
    for (const [idx, { check, move }] of nextInstructions.entries()) {
      let adjacentElf = false;
      for (const direction of check) {
        if (
          coordinateInList(
            [elf[0] + direction[0], elf[1] + direction[1]],
            allElves
          )
        ) {
          adjacentElf = true;
        }
      }
      if (!adjacentElf) {
        // Propose moving in this direction
        nextElfProposedPositions[elf] = [elf[0] + move[0], elf[1] + move[1]];
        break;
      }
      if (idx === nextInstructions.length - 1) {
        elvesNotMoving.push(elf);
      }
    }
  }

  const counts = {};
  for (const position of Object.values(nextElfProposedPositions)) {
    counts[position] = counts[position] ? counts[position] + 1 : 1;
  }

  const nextPositions = [];
  for (const [elf, position] of Object.entries(nextElfProposedPositions)) {
    if (counts[position] === 1) {
      nextPositions.push(position);
    } else {
      nextPositions.push([
        Number.parseInt(elf.split(",")[0], 10),
        Number.parseInt(elf.split(",")[1], 10),
      ]);
    }
  }

  return {
    nextPositions: [...nextPositions, ...elvesNotMoving],
    stillMoving: nextPositions.length,
  };
};

const part1 = (input) => {
  const grid = readLinesOfCharacters(input);
  const elfPositions = getElfPositions(grid);

  let i = 0;
  let nextPositions = elfPositions;
  while (i < 10) {
    ({ nextPositions } = moveElves(nextPositions, i));
    i += 1;
  }

  // Calculate area of largest rectangle that can fit the elves, then deduct the number of elves
  const limits = getElfLimits(nextPositions);
  const emptyTiles =
    (limits.maxRow - limits.minRow + 1) * (limits.maxCol - limits.minCol + 1) -
    elfPositions.length;

  return emptyTiles;
};

const part2 = (input) => {
  const grid = readLinesOfCharacters(input);
  const elfPositions = getElfPositions(grid);

  let i = 0;
  let nextPositions = elfPositions;
  let stillMoving = true;
  while (stillMoving) {
    ({ nextPositions, stillMoving } = moveElves(nextPositions, i));
    i += 1;
  }

  return i;
};

export { part1, part2 };
