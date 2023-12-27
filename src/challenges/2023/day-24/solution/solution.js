import { readLines, sum } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => {
    const [position, velocity] = line.split("@");
    const [x, y, z] = position.split(", ").map((x) => parseInt(x));
    const [vx, vy, vz] = velocity.split(", ").map((x) => parseInt(x));
    return [
      [x, y, z],
      [vx, vy, vz],
    ];
  });

const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

const minus = ([x1, y1, z1], [x2, y2, z2]) => [x1 - x2, y1 - y2, z1 - z2];

const plus = ([x1, y1, z1], [x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2];

const multiply = ([x, y, z], n) => [x * n, y * n, z * n];

const divide = ([x, y, z], n) => [x / n, y / n, z / n];

const convertToBigInt = ([x, y, z]) => [BigInt(x), BigInt(y), BigInt(z)];

/*
 * Algorithm to find the intersection between a line and a plane
 * https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
 */
const findLinePlaneIntersection = (p0, n, [position, direction]) => {
  const d = dot(minus(p0, position), n) / dot(direction, n);
  return {
    position: plus(position, multiply(direction, d)),
    time: d,
  };
};

/*
 * Line intersect by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
 */
const lineIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
};

const xyWithinBounds = ({ x, y }, [min, max]) =>
  x >= min && x <= max && y >= min && y <= max;

const part1 = (input, bounds = [200000000000000, 400000000000000]) => {
  const hailstones = parseInput(input);

  let intersections = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const vx1 = hailstones[i][1][0];
      const vy1 = hailstones[i][1][1];

      const vx2 = hailstones[j][1][0];
      const vy2 = hailstones[j][1][1];

      const x1 = hailstones[i][0][0];
      const y1 = hailstones[i][0][1];

      const x2 = x1 + vx1;
      const y2 = y1 + vy1;

      const x3 = hailstones[j][0][0];
      const y3 = hailstones[j][0][1];

      const x4 = x3 + vx2;
      const y4 = y3 + vy2;

      const intersection = lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4);

      if (!intersection) {
        continue;
      }

      // Intersection must be in the future
      if ((intersection.x - x1) / vx1 < 0 || (intersection.x - x3) / vx2 < 0) {
        continue;
      }

      // Intersection must be within the bounds
      if (xyWithinBounds(intersection, bounds)) {
        intersections += 1;
      }
    }
  }

  return intersections;
};

/*
 * Credit to this comment on Reddit for the methodology of the solution
 * https://www.reddit.com/r/adventofcode/comments/18q0kfc/comment/kes6ywf
 */
const part2 = (input) => {
  const hailstones = parseInput(input);

  // First hailstone used as reference
  const [shiftPosition, shiftVelocity] = hailstones[0];

  // Map hailstones relative to the first one
  const relativeHailstones = hailstones.map(([position, velocity]) => [
    // Note: In the real input we are dealing with very large numbers
    // so we need to use BigInts to avoid rounding errors...
    convertToBigInt(minus(position, shiftPosition)),
    convertToBigInt(minus(velocity, shiftVelocity)),
  ]);

  // The first hailstone is at 0,0,0 and does not move
  // Which means the rock needs to pass through 0,0,0

  // The rock must intersect with the next hailstone somewhere in
  // the plane defined by the origin (0,0,0) and any two points on
  // the next hailstones trajectory

  const hailstone1 = relativeHailstones[1];

  // Get the normal vector of hailstone 1
  const hailstone1Position1 = hailstone1[0];
  const hailstone1Position2 = plus(hailstone1[0], hailstone1[1]);
  const n = cross(hailstone1Position1, hailstone1Position2);

  // Take two more hailstones and find the intersections their lines with the plane
  const intersection1 = findLinePlaneIntersection(
    convertToBigInt([0, 0, 0]),
    n,
    relativeHailstones[2]
  );

  const intersection2 = findLinePlaneIntersection(
    convertToBigInt([0, 0, 0]),
    n,
    relativeHailstones[3]
  );

  const timeDiff = intersection2.time - intersection1.time;

  // This is the relative rock velocity (velocity = distance / time)
  const rockVelocity = divide(
    minus(intersection2.position, intersection1.position),
    timeDiff
  );

  // This is the relative rock position (distance = velocity * time)
  const rockPosition = minus(
    intersection1.position,
    multiply(rockVelocity, intersection1.time)
  );

  // Convert back to absolute position / velocity
  const rock = [
    plus(rockPosition, convertToBigInt(shiftPosition)),
    plus(rockVelocity, convertToBigInt(shiftVelocity)),
  ];

  return sum(rock[0].map((x) => Number(x)));
};

export { part1, part2 };
