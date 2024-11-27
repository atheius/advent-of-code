import {
  chunk,
  readLinesContainingNumbers,
  min,
  max,
} from "../../../../helpers.js";

// Find the bounds of the grid based on sensor readings
const findLimits = (sensorReadings) => {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  for (const [[x1, y1], [x2, y2]] of sensorReadings) {
    if (min([x1, x2]) < minX) {
      minX = min([x1, x2]);
    }
    if (max([x1, x2]) > maxX) {
      maxX = max([x1, x2]);
    }
    if (min([y1, y2]) < minY) {
      minY = min([y1, y2]);
    }
    if (max([y1, y2]) > maxY) {
      maxY = max([y1, y2]);
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
};

// Calculate Manhatten Distance (see: https://xlinux.nist.gov/dads/HTML/manhattanDistance.html)
const manhattanDistance = ([x1, y1], [x2, y2]) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

// Add sensor readings to the grid
const addReadings = (grid, limits, sensorReadings) => {
  for (const [[x1, y1], [x2, y2]] of sensorReadings) {
    if (!grid[Math.abs(limits.minY - y1)]) {
      grid[Math.abs(limits.minY - y1)] = new Array(
        limits.maxX - limits.minX + 1
      );
    }
    if (!grid[Math.abs(limits.minY - y2)]) {
      grid[Math.abs(limits.minY - y2)] = new Array(
        limits.maxX - limits.minX + 1
      );
    }
    grid[Math.abs(limits.minY - y1)][Math.abs(limits.minX - x1)] = "S";
    grid[Math.abs(limits.minY - y2)][Math.abs(limits.minX - x2)] = "B";
  }
  return grid;
};

// Check a specific row for the number of exclusions that apply (cannot contain a beacon)
const checkExclusion = (grid, limits, sensorReadings, row) => {
  const relativeRow = Math.abs(limits.minY - row);

  const columns = limits.maxX - limits.minX;

  let count = 0;

  for (const [[x1, y1], [x2, y2]] of sensorReadings) {
    const distanceToBeacon = manhattanDistance([x1, y1], [x2, y2]);
    const relativePoint = [
      Math.abs(limits.minX - x1),
      Math.abs(limits.minY - y1),
    ];

    for (let col = 0; col < columns; col++) {
      if (
        manhattanDistance(relativePoint, [col, relativeRow]) <= distanceToBeacon
      ) {
        if (!grid[relativeRow]) {
          grid[relativeRow] = new Array(limits.maxX - limits.minX);
        }

        if (grid[relativeRow][col] === undefined) {
          grid[relativeRow][col] = "#";
          count += 1;
        }
      }
    }
  }

  return count;
};

const getPerimeterPoints = (sensorReadings, searchLimits) => {
  const perimeterPoints = [];

  // Get all points for outer perimiter of diamond
  for (const [[x1, y1], [x2, y2]] of sensorReadings) {
    const beaconDistance = manhattanDistance([x1, y1], [x2, y2]);

    for (let i = 0; i <= beaconDistance + 1; i++) {
      const nextPoints = [
        // top left edge
        [x1 - beaconDistance - 1 + i, y1 - i],
        // top right edge
        [x1 + beaconDistance + 1 - i, y1 - i],
        // bottom left edge
        [x1 - beaconDistance - 1 + i, y1 + i],
        // bottom right edge
        [x1 + beaconDistance + 1 - i, y1 + i],
      ];

      for (const [x, y] of nextPoints) {
        if (
          x >= 0 &&
          x <= searchLimits.maxX &&
          y >= 0 &&
          y <= searchLimits.maxY
        ) {
          // Add perimiter point if it's within search bounds
          perimeterPoints.push([x, y]);
        }
      }
    }
  }
  return perimeterPoints;
};

const checkPoints = (points, sensorReadings) => {
  // Find the distance from each sensor to it's closest beacon
  const sensorDetails = sensorReadings.reduce(
    (acc, [[x1, y1], [x2, y2]]) => [
      ...acc,
      [[x1, y1], manhattanDistance([x1, y1], [x2, y2])],
    ],
    []
  );

  // Find the point that's not covered by a sensor
  let covered;
  for (let [x, y] of points) {
    covered = false;
    for (const [point, distanceToBeacon] of sensorDetails) {
      if (manhattanDistance(point, [x, y]) <= distanceToBeacon) {
        covered = true;
      }
    }
    if (!covered) {
      return [x, y];
    }
  }
};

const part1 = (input) => {
  const sensorReadings = readLinesContainingNumbers(input).map((x) =>
    chunk(x, 2)
  );

  const limits = findLimits(sensorReadings);

  // Increase the X bounds by a large number (not sure how to decide these... I just increased until answer was stable)
  limits.minX = limits.minX - 2000000;
  limits.maxX = limits.maxX + 2000000;

  // Create sparse Array within limits
  const emptyGrid = new Array(limits.maxY - limits.minY + 1);

  const grid = addReadings(emptyGrid, limits, sensorReadings);

  const checkRowNumber = 10; // use 2000000 for part 1 input

  return checkExclusion(grid, limits, sensorReadings, checkRowNumber);
};

const part2 = (input) => {
  const sensorReadings = readLinesContainingNumbers(input).map((x) =>
    chunk(x, 2)
  );

  const searchLimits = {
    maxX: 20, // use 4000000 for part 2 input
    maxY: 20, // use 4000000 for part 2 input
  };

  const perimeterPoints = getPerimeterPoints(sensorReadings, searchLimits);

  const point = checkPoints(perimeterPoints, sensorReadings);

  return point[0] * 4000000 + point[1];
};

export { part1, part2 };
