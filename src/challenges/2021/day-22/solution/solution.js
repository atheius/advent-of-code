import { readLines, sum } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => {
    return [
      line.split(" ")[0] === "on",
      line
        .split(" ")[1]
        .split(",")
        .map((x) => x.split("=")[1].split("..").map(Number)),
    ];
  });

const runInitialisation = (procedure) => {
  // Create empty 3D array for reactor
  const reactor = Array(101)
    .fill(null)
    .map(() =>
      Array(101)
        .fill(null)
        .map(() => Array(101).fill(0))
    );

  // Run each step in procedure
  for (let [
    switchOn,
    [[xStart, xEnd], [yStart, yEnd], [zStart, zEnd]],
  ] of procedure) {
    for (let x = xStart; x <= xEnd && x >= -50 && x <= 50; x += 1) {
      for (let y = yStart; y <= yEnd && y >= -50 && y <= 50; y += 1) {
        for (let z = zStart; z <= zEnd && z >= -50 && z <= 50; z += 1) {
          reactor[x + 50][y + 50][z + 50] = switchOn ? 1 : 0;
        }
      }
    }
  }

  return reactor;
};

export class Cube {
  constructor([switchOn, [[xStart, xEnd], [yStart, yEnd], [zStart, zEnd]]]) {
    this.switchOn = switchOn;
    this.xStart = xStart;
    this.xEnd = xEnd;
    this.yStart = yStart;
    this.yEnd = yEnd;
    this.zStart = zStart;
    this.zEnd = zEnd;
    this.count = 1;
  }

  /**
   * Check if a cube is equal
   * @param {*} checkCube
   * @returns
   */
  isEqual(checkCube) {
    if (
      this.xStart === checkCube.xStart &&
      this.xEnd === checkCube.xEnd &&
      this.yStart === checkCube.yStart &&
      this.yEnd === checkCube.yEnd &&
      this.zStart === checkCube.zStart &&
      this.zEnd === checkCube.zEnd
    ) {
      return true;
    }
    return false;
  }

  /**
   * Get the volume of this cube
   * @returns
   */
  getVolume() {
    return (
      1 *
      (Math.abs(this.xEnd - this.xStart) + 1) *
      (Math.abs(this.yEnd - this.yStart) + 1) *
      (Math.abs(this.zEnd - this.zStart) + 1)
    );
  }

  /**
   * Check whether this cube overlaps with a given cube
   * @param {*} checkCube
   * @returns
   */
  getOverlap(checkCube) {
    if (
      this.xEnd < checkCube.xStart ||
      checkCube.xEnd < this.xStart ||
      this.yEnd < checkCube.yStart ||
      checkCube.yEnd < this.yStart ||
      this.zEnd < checkCube.zStart ||
      checkCube.zEnd < this.zStart
    ) {
      return null;
    }
    const xOverlap = [
      Math.max(this.xStart, checkCube.xStart),
      Math.min(this.xEnd, checkCube.xEnd),
    ];
    const yOverlap = [
      Math.max(this.yStart, checkCube.yStart),
      Math.min(this.yEnd, checkCube.yEnd),
    ];
    const zOverlap = [
      Math.max(this.zStart, checkCube.zStart),
      Math.min(this.zEnd, checkCube.zEnd),
    ];
    return new Cube([false, [xOverlap, yOverlap, zOverlap]]);
  }
}

/**
 * Cube area is too big to create an initial empty array,
 * so instead return cubes (with counts) so we can calculate
 * the total volume.
 * @param {*} procedure
 * @returns
 */
const runReboot = (procedure) => {
  const cubes = [];

  for (const nextStep of procedure) {
    const nextCube = new Cube(nextStep);

    // Here we find the intersection/overlaps
    // with the new cube and all existing cubes
    const overlapCubes = [];
    const cubeLength = cubes.length;
    for (let i = 0; i < cubeLength; i += 1) {
      const overlapCube = nextCube.getOverlap(cubes[i]);
      if (overlapCube === null) {
        continue;
      }
      overlapCube.count = 0;
      // Decrement by the count of the overlapping cube
      // This effectively removes the intersections so we avoid
      // counting them twice
      overlapCube.count -= cubes[i].count;
      overlapCubes.push(overlapCube);
    }

    // Update the cube counts based on the overlaps we found
    overlapCubes.forEach((overlapCube) => {
      const existingCube = cubes.find((c) => c.isEqual(overlapCube));
      if (existingCube) {
        existingCube.count += overlapCube.count;
      } else {
        cubes.push(overlapCube);
      }
    });

    // Add the whole cube (when the switch is on)
    if (nextCube.switchOn === true) {
      cubes.push(nextCube);
    }
  }

  return cubes;
};

const part1 = (input) => {
  const procedure = parseInput(input);
  // Return the sum of all items in array (1 = lit)
  return runInitialisation(procedure).reduce(
    (yAcc, y) => sum([yAcc, y.reduce((zAcc, z) => sum([zAcc, ...z]), 0)]),
    0
  );
};

const part2 = (input) => {
  const procedure = parseInput(input);
  const cubes = runReboot(procedure);
  // Calculate the total volume of the cubes
  return cubes.reduce(
    (total, currentCube) => total + currentCube.getVolume() * currentCube.count,
    0
  );
};

export { part1, part2 };
