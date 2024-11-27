import {
  readLines,
  readCommaSeperatedNumbers,
  min,
  max,
} from "../../../../helpers.js";

const getCubes = (input) =>
  readLines(input).map((line) => readCommaSeperatedNumbers(line));

const cubeEdges = [
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const getSurfaceArea = (cubes) => {
  const serializedCubes = cubes.map(([x, y, z]) => `${x},${y},${z}`);
  let numEdgesNotCovered = 0;
  for (const cube of cubes) {
    for (let edge of cubeEdges) {
      const [x, y, z] = [
        cube[0] + edge[0],
        cube[1] + edge[1],
        cube[2] + edge[2],
      ];
      if (serializedCubes.indexOf(`${x},${y},${z}`) === -1) {
        numEdgesNotCovered += 1;
      }
    }
  }
  return numEdgesNotCovered;
};

const floodFill = (start, serializedAirCubes, filledCubes = []) => {
  const queue = [];
  queue.push(start);

  while (queue.length) {
    const nextCube = queue.pop();

    // Check all cube neighbours
    for (let edge of cubeEdges) {
      const [x, y, z] = [
        nextCube[0] + edge[0],
        nextCube[1] + edge[1],
        nextCube[2] + edge[2],
      ];
      if (
        // Is an air cube
        serializedAirCubes.indexOf(`${x},${y},${z}`) > -1 &&
        // Not an already filled cube
        filledCubes.indexOf(`${x},${y},${z}`) === -1
      ) {
        queue.push([x, y, z]);
        filledCubes.push(`${x},${y},${z}`);
      }
    }
  }

  return filledCubes;
};

const findLimits = (cubes) => {
  const allX = cubes.map((cube) => cube[0]);
  const allY = cubes.map((cube) => cube[1]);
  const allZ = cubes.map((cube) => cube[2]);
  return {
    minX: min(allX) - 1,
    maxX: max(allX) + 1,
    minY: min(allY) - 1,
    maxY: max(allY) + 1,
    minZ: min(allZ) - 1,
    maxZ: max(allZ) + 1,
  };
};

const getAirCubes = ({ minX, maxX, minY, maxY, minZ, maxZ }, lavaCubes) => {
  const serializedLavaCubes = lavaCubes.map(([x, y, z]) => `${x},${y},${z}`);

  const airCubes = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        if (!serializedLavaCubes.includes(`${x},${y},${z}`)) {
          airCubes.push([x, y, z]);
        }
      }
    }
  }

  return airCubes;
};

const part1 = (input) => {
  const cubes = getCubes(input);
  return getSurfaceArea(cubes);
};

const part2 = (input) => {
  const lavaCubes = getCubes(input);

  // Find the limits of the lava cube points
  const limits = findLimits(lavaCubes);

  // These are all the cubes within the limits which are not lava
  const airCubes = getAirCubes(limits, lavaCubes);
  const airCubesSerialised = airCubes.map(([x, y, z]) => `${x},${y},${z}`);

  // Flood fill the air cubes to find out which ones are reachable
  const filledCubesSerialised = floodFill(airCubes[0], airCubesSerialised);

  const lavaSurfaceArea = getSurfaceArea(lavaCubes);

  const trappedSurfaceArea = getSurfaceArea(
    airCubes.filter(
      ([x, y, z]) => filledCubesSerialised.indexOf(`${x},${y},${z}`) === -1
    )
  );

  // Return the reachable surface area
  return lavaSurfaceArea - trappedSurfaceArea;
};

export { part1, part2 };
