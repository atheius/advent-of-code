import {
  readLinesOfCharacters,
  coordinateInList,
} from "../../../../helpers.js";

const getBlizzardPositions = (grid) => {
  const blizzardPositions = [];
  for (const [row, rowValue] of grid.entries()) {
    for (const [col, colValue] of rowValue.entries()) {
      if (["^", ">", "v", "<"].includes(colValue))
        blizzardPositions.push([row, col, colValue]);
    }
  }
  return blizzardPositions;
};

/**
 * Get the next iteration of blizzard movements
 */
const nextBlizzardPositions = (blizzardPositions, { maxRow, maxCol }) => {
  const nextBlizzardPositions = [];
  for (const [row, col, direction] of blizzardPositions) {
    if (direction === "^") {
      if (row === 1) {
        nextBlizzardPositions.push([maxRow, col, direction]);
      } else {
        nextBlizzardPositions.push([row - 1, col, direction]);
      }
    }
    if (direction === ">") {
      if (col === maxCol) {
        nextBlizzardPositions.push([row, 1, direction]);
      } else {
        nextBlizzardPositions.push([row, col + 1, direction]);
      }
    }
    if (direction === "v") {
      if (row === maxRow) {
        nextBlizzardPositions.push([1, col, direction]);
      } else {
        nextBlizzardPositions.push([row + 1, col, direction]);
      }
    }
    if (direction === "<") {
      if (col === 1) {
        nextBlizzardPositions.push([row, maxCol, direction]);
      } else {
        nextBlizzardPositions.push([row, col - 1, direction]);
      }
    }
  }
  return nextBlizzardPositions;
};

/**
 * Get a list of all the next potential moves
 */
const getPotentialMoves = (
  blizzardPositions,
  currentPosition,
  startPosition,
  endPosition,
  limits
) => {
  const rowBeforeStart = startPosition[0] === 0 ? 1 : -1;
  const rowBeforeEnd = endPosition[0] === 0 ? 1 : -1;

  // Are we still at the start?
  if (
    currentPosition[0] === startPosition[0] &&
    currentPosition[1] === startPosition[1]
  ) {
    return [
      // Allow waiting or moving up/down (depending on start/end location)
      [currentPosition[0], currentPosition[1]],
      [currentPosition[0] + rowBeforeStart, currentPosition[1]],
    ];
  }

  // Check if we are just before the end point
  if (
    currentPosition[0] === endPosition[0] + rowBeforeEnd &&
    currentPosition[1] === endPosition[1]
  ) {
    return [endPosition];
  }

  return (
    [
      // Wait
      [currentPosition[0], currentPosition[1]],
      // Up
      [currentPosition[0] - 1, currentPosition[1]],
      // Right
      [currentPosition[0], currentPosition[1] + 1],
      // Down
      [currentPosition[0] + 1, currentPosition[1]],
      // Left
      [currentPosition[0], currentPosition[1] - 1],
    ]
      .filter(
        // Make sure next position is within bounds (and not the start)
        ([row, col]) =>
          row > 0 &&
          row <= limits.maxRow &&
          col > 0 &&
          col <= limits.maxCol &&
          // Don't go back to the start
          row !== startPosition[0] &&
          col !== startPosition[1]
      )
      // Not a blizzard position
      .filter(([row, col]) => !coordinateInList([row, col], blizzardPositions))
  );
};

const shortestPath = (
  blizzardPositions,
  startPosition,
  endPosition,
  { maxRow, maxCol },
  startTime = 0
) => {
  let queue = [[startPosition, startTime, []]];
  while (queue.length) {
    // Get the next position to check
    const [currentPosition, currentMinute] = queue.shift();

    // Check if we have a blizzard grid for this minute
    if (!blizzardPositions[currentMinute + 1]) {
      // If not - get the next blizzard positions
      blizzardPositions[currentMinute + 1] = nextBlizzardPositions(
        blizzardPositions[currentMinute],
        {
          maxRow,
          maxCol,
        }
      );
    }

    // Get a list of all the next moves we could make
    const nextMoves = getPotentialMoves(
      blizzardPositions[currentMinute + 1],
      currentPosition,
      startPosition,
      endPosition,
      {
        maxRow,
        maxCol,
      }
    );

    for (const move of nextMoves) {
      if (move[0] === endPosition[0] && move[1] === endPosition[1]) {
        return { time: currentMinute + 1, blizzardPositions };
      } else {
        if (
          // If position/minute not already in the queue...
          !queue.filter(
            (x) =>
              x[0][0] === move[0] &&
              x[0][1] === move[1] &&
              x[1] === currentMinute + 1
          ).length
        ) {
          // Check the next position
          queue.push([move, currentMinute + 1]);
        }
      }
    }
  }
};

const part1 = (input) => {
  const grid = readLinesOfCharacters(input);
  const limits = { maxRow: grid.length - 2, maxCol: grid[0].length - 2 };

  const startPosition = [0, grid[0].indexOf(".")];
  const endPosition = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

  const initialBlizzardPositions = getBlizzardPositions(grid);
  const blizzardPositions = [initialBlizzardPositions];

  // Find the shortest path from start to end through the blizzards...
  const { time } = shortestPath(
    blizzardPositions,
    startPosition,
    endPosition,
    limits
  );

  return time;
};

const part2 = (input) => {
  const grid = readLinesOfCharacters(input);
  const limits = { maxRow: grid.length - 2, maxCol: grid[0].length - 2 };

  const startPosition = [0, grid[0].indexOf(".")];
  const endPosition = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

  const initialBlizzardPositions = getBlizzardPositions(grid);
  const blizzardPositions = [initialBlizzardPositions];

  let nextTime;
  let nextBlizzardPositions;

  // This journey is from A - B
  ({ time: nextTime, blizzardPositions: nextBlizzardPositions } = shortestPath(
    blizzardPositions,
    startPosition,
    endPosition,
    limits
  ));

  // This journey is from B - A (elf forgot snacks!)
  ({ time: nextTime, blizzardPositions: nextBlizzardPositions } = shortestPath(
    nextBlizzardPositions,
    endPosition,
    startPosition,
    limits,
    nextTime
  ));

  // This journey is from A - B (again)
  ({ time: nextTime, blizzardPositions: nextBlizzardPositions } = shortestPath(
    nextBlizzardPositions,
    startPosition,
    endPosition,
    limits,
    nextTime
  ));

  return nextTime;
};

export { part1, part2 };
