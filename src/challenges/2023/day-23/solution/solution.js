import { readLinesOfCharacters } from "../../../../helpers.js";

const getAdjacentPoints = ([y, x]) => [
  [[y - 1, x], "north"],
  [[y + 1, x], "south"],
  [[y, x - 1], "west"],
  [[y, x + 1], "east"],
];

const inBounds = (grid, [y, x]) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

const part1 = (input) => {
  const map = readLinesOfCharacters(input);

  const start = [0, 1];
  const endY = map.length - 1;
  const endX = map[map.length - 1].findIndex((char) => char === ".");
  const end = [endY, endX];

  const routes = [];

  const queue = [[start, []]];

  while (queue.length) {
    const next = queue.shift();

    const [[y, x], route] = next;

    const nextRoute = [...route, [y, x]];

    if (route.find((point) => point[0] === y && point[1] === x)) {
      // Skip if point is in previous route
      continue;
    }

    if (y === end[0] && x === end[1]) {
      routes.push(nextRoute);
      continue;
    }

    const adjacentPoints = getAdjacentPoints([y, x])
      // Point is in bounds
      .filter(([point]) => inBounds(map, point))
      // Point is not a wall
      .filter(([[y, x]]) => map[y][x] !== "#")
      // Point is not in previous route
      .filter(
        ([[y, x]]) => !route.find((point) => point[0] === y && point[1] === x)
      )
      // Point is not going up a slope
      .filter(([[y, x], nextDirection]) => {
        const char = map[y][x];
        if (char === "^" && nextDirection === "south") {
          return false;
        }
        if (char === "v" && nextDirection === "north") {
          return false;
        }
        if (char === "<" && nextDirection === "east") {
          return false;
        }
        if (char === ">" && nextDirection === "west") {
          return false;
        }
        return true;
      });

    for (const [adjacentPoint] of adjacentPoints) {
      const char = map[adjacentPoint[0]][adjacentPoint[1]];

      if (char === "^") {
        queue.push([
          [adjacentPoint[0] - 1, adjacentPoint[1]],
          [...nextRoute, adjacentPoint],
        ]);
        continue;
      }

      if (char === "v") {
        queue.push([
          [adjacentPoint[0] + 1, adjacentPoint[1]],
          [...nextRoute, adjacentPoint],
        ]);
        continue;
      }

      if (char === "<") {
        queue.push([
          [adjacentPoint[0], adjacentPoint[1] - 1],
          [...nextRoute, adjacentPoint],
        ]);
        continue;
      }

      if (char === ">") {
        queue.push([
          [adjacentPoint[0], adjacentPoint[1] + 1],
          [...nextRoute, adjacentPoint],
        ]);
        continue;
      }

      queue.push([adjacentPoint, nextRoute]);
    }
  }

  // Sort routes by length
  routes.sort((a, b) => b.length - a.length);

  return routes[0].length - 1;
};

const getAdjacentJunctions = (map, junctions, start) => {
  // Store [y,x,steps] for each adjacent junction
  let adjacentJunctions = [];

  const queue = [{ point: start, steps: 0, route: [] }];
  while (queue.length) {
    const { point, steps, route } = queue.shift();

    const isJunction = !!junctions.find(
      ([y, x]) => y === point[0] && x === point[1]
    );

    const isStart = start[0] === point[0] && start[1] === point[1];

    if (!isStart && isJunction) {
      adjacentJunctions.push([...point, steps]);
      continue;
    }

    const nextSteps = steps + 1;
    const nextRoute = [...route, point];

    const adjacentPoints = getAdjacentPoints(point)
      .map(([point]) => point)
      .filter((point) => inBounds(map, point))
      .filter(([y, x]) => map[y][x] !== "#")
      .filter(
        ([y, x]) => !route.find((point) => point[0] === y && point[1] === x)
      );

    for (const adjacent of adjacentPoints) {
      queue.push({ point: adjacent, steps: nextSteps, route: nextRoute });
    }
  }

  return adjacentJunctions;
};

const getLongestPath = (junctionGraph, start, end) => {
  let longestPath = 0;
  const queue = [[start, [], 0]];
  while (queue.length) {
    queue.sort((a, b) => b[2] - a[2]);
    const [next, route, steps] = queue.shift();

    if (next[0] === end[0] && next[1] === end[1]) {
      if (steps > longestPath) {
        longestPath = steps;
      }
      continue;
    }

    for (const junction of junctionGraph[next]) {
      if (
        !route.find(
          (point) => point[0] === junction[0] && point[1] === junction[1]
        )
      ) {
        const [y, x, junctionSteps] = junction;
        queue.push([[y, x], [...route, next], steps + junctionSteps]);
      }
    }
  }

  return longestPath;
};

const part2 = (input) => {
  const map = readLinesOfCharacters(input);

  const start = [0, 1];
  const endY = map.length - 1;
  const endX = map[map.length - 1].findIndex((char) => char === ".");
  const end = [endY, endX];

  const junctions = [start, end];

  // Find all the "junctions" (points with 3 or more paths leading to them)
  for (const [y, row] of map.entries()) {
    for (const [x] of row.entries()) {
      if (map[y][x] === ".") {
        const adjacentPoints = getAdjacentPoints([y, x])
          .filter(([point]) => inBounds(map, point))
          .map(([point]) => map[point[0]][point[1]])
          .filter((char) => [".", "<", ">", "^", "v"].includes(char));
        if (adjacentPoints.length > 2) {
          junctions.push([y, x]);
        }
      }
    }
  }

  // Build a graph of each junction and the number of steps required to get there
  const junctionGraph = junctions.reduce(
    (acc, junction) => ({
      ...acc,
      [junction]: getAdjacentJunctions(map, junctions, junction),
    }),
    {}
  );

  // Longest path is an NP-hard problem... so brute force it!
  const longestRoute = getLongestPath(junctionGraph, start, end);

  return longestRoute;
};

export { part1, part2 };
