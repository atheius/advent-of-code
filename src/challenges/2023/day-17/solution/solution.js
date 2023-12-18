import { readLinesOfDigits } from "../../../../helpers.js";

const getSurroundingPoints = ([y, x]) => ({
  north: [y - 1, x],
  east: [y, x + 1],
  south: [y + 1, x],
  west: [y, x - 1],
});

const inBounds = (grid, [y, x]) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

// Very slow algorithm - needs some improvement!!
const findMinHeatLoss = (grid, minConsecutive = 0, maxConsecutive = 3) => {
  // End is bottom right corner
  const [endY, endX] = [grid.length - 1, grid[0].length - 1];

  // Queue of [y, x, direction, numDirection, heatLoss, path]
  const queue = [
    [0, 0, "south", 0, 0, [[0, 0]]],
    [0, 0, "east", 0, 0, [[0, 0]]],
  ];

  const visited = new Map();

  let finalHeatLoss = Infinity;
  while (queue.length > 0) {
    // Sort queue by heatLoss
    queue.sort((a, b) => a[4] - b[4]);

    // Get the next step to check
    const [
      currentY,
      currentX,
      currentDirection,
      currentNumDirection,
      currentHeatLoss,
      path,
    ] = queue.shift();

    visited.set(
      `${currentY},${currentX},${currentDirection},${currentNumDirection}`,
      currentHeatLoss
    );

    if (
      currentY === endY &&
      currentX === endX &&
      currentNumDirection >= minConsecutive - 1
    ) {
      if (currentHeatLoss < finalHeatLoss) {
        // Found a better path
        finalHeatLoss = currentHeatLoss;
        console.log("Found a path", path);
      }
      continue;
    }

    const surroundingPoints = getSurroundingPoints([currentY, currentX]);

    for (const [nextDirection, [y, x]] of Object.entries(surroundingPoints)) {
      if (!inBounds(grid, [y, x])) {
        // Skip if out of bounds
        continue;
      }

      if (path.some(([pathY, pathX]) => pathY === y && pathX === x)) {
        // Don't go back on yourself
        continue;
      }

      let nextNumDirection = currentNumDirection;
      if (currentDirection === nextDirection) {
        nextNumDirection += 1;
        if (nextNumDirection > maxConsecutive - 1) {
          continue;
        }
      } else {
        if (nextNumDirection < minConsecutive - 1) {
          // Skip if not enough consecutive
          continue;
        }
        nextNumDirection = 0;
      }

      // skip if require consecutive would go out of bounds
      if (
        nextDirection === "north" &&
        y - (minConsecutive - nextNumDirection) < 0
      ) {
        continue;
      }
      if (
        nextDirection === "south" &&
        y + (minConsecutive - nextNumDirection) > grid.length
      ) {
        continue;
      }
      if (
        nextDirection === "east" &&
        x + (minConsecutive - nextNumDirection) > grid[y].length
      ) {
        continue;
      }
      if (
        nextDirection === "west" &&
        x - (minConsecutive - nextNumDirection) < 0
      ) {
        continue;
      }

      const nextHeatLoss = currentHeatLoss + grid[y][x];

      if (nextHeatLoss >= finalHeatLoss) {
        // Skip if already over the final heat loss
        continue;
      }

      const alreadyVisited =
        visited.get(`${y},${x},${nextDirection},${nextNumDirection}`) ||
        Infinity;

      if (alreadyVisited <= nextHeatLoss) {
        // Skip if already visited with a lower heat loss
        continue;
      }

      const alreadyInQueue = queue.findIndex((item) => {
        const [itemY, itemX, itemDirection, itemNumDirection, ItemHeatLoss] =
          item;
        return (
          itemY === y &&
          itemX === x &&
          itemDirection === nextDirection &&
          itemNumDirection === nextNumDirection &&
          // if already in queue with a lower heat loss
          ItemHeatLoss <= nextHeatLoss
        );
      });

      if (alreadyInQueue !== -1) {
        // Skip if already in the queue
        continue;
      }

      queue.push([
        y,
        x,
        nextDirection,
        nextNumDirection,
        nextHeatLoss,
        [...path, [y, x, nextDirection]],
      ]);
    }
  }

  return finalHeatLoss;
};

const part1 = (input) => {
  const grid = readLinesOfDigits(input);
  return findMinHeatLoss(grid);
};

const part2 = (input) => {
  const grid = readLinesOfDigits(input);
  return findMinHeatLoss(grid, 4, 10);
};

export { part1, part2 };
