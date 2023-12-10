import { readLinesOfCharacters } from "../../../../helpers.js";

const parseInput = (input) => readLinesOfCharacters(input);

const findStartPosition = (map) => {
  for (const row of map) {
    if (row.includes("S")) {
      return [map.indexOf(row), row.indexOf("S")];
    }
  }
};

const getCharAtPosition = (map, [y, x]) => {
  if (y < 0 || y >= map.length) {
    return "";
  }
  if (x < 0 || x >= map[y].length) {
    return "";
  }
  return map[y][x];
};

const isPositionEqual = ([y1, x1], [y2, x2]) => y1 === y2 && x1 === x2;

const getSurroundingPoints = ([y, x]) => ({
  north: [y - 1, x],
  east: [y, x + 1],
  south: [y + 1, x],
  west: [y, x - 1],
});

const isValidMove = (map, previous, current, next, direction) => {
  const currentChar = getCharAtPosition(map, current);
  const nextChar = getCharAtPosition(map, next);

  if (previous && isPositionEqual(previous, next)) {
    // Can't move backwards
    return false;
  }

  if (direction === "north") {
    return (
      ["S", "|", "L", "J"].includes(currentChar) &&
      ["S", "|", "7", "F"].includes(nextChar)
    );
  }

  if (direction === "east") {
    return (
      ["S", "-", "F", "L"].includes(currentChar) &&
      ["S", "-", "J", "7"].includes(nextChar)
    );
  }

  if (direction === "south") {
    return (
      ["S", "|", "7", "F"].includes(currentChar) &&
      ["S", "|", "L", "J"].includes(nextChar)
    );
  }

  if (direction === "west") {
    return (
      ["S", "-", "7", "J"].includes(currentChar) &&
      ["S", "-", "L", "F"].includes(nextChar)
    );
  }
};

const getNextStep = (map, previous, current) => {
  const { north, east, south, west } = getSurroundingPoints(current);

  if (isValidMove(map, previous, current, north, "north")) {
    return north;
  }

  if (isValidMove(map, previous, current, east, "east")) {
    return east;
  }

  if (isValidMove(map, previous, current, south, "south")) {
    return south;
  }

  if (isValidMove(map, previous, current, west, "west")) {
    return west;
  }
};

const getRoute = (map) => {
  const route = [findStartPosition(map)];

  let keepGoing = true;
  while (keepGoing) {
    route.push(
      getNextStep(map, route[route.length - 2] || null, route[route.length - 1])
    );
    keepGoing = !isPositionEqual(route[route.length - 1], route[0]);
  }

  return route;
};

const routeIncludesPoint = (route, point) => {
  for (const p of route) {
    if (isPositionEqual(p, point)) {
      return true;
    }
  }
  return false;
};

const clearMap = (map, route) => {
  const clearedMap = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    clearedMap.push([]);
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      clearedMap[y].push(routeIncludesPoint(route, [y, x]) ? char : ".");
    }
  }
  return clearedMap;
};

const part1 = (input) => (getRoute(parseInput(input)).length - 1) / 2;

const part2 = (input) => {
  const map = parseInput(input);
  const route = getRoute(map);

  // clear the map of excess pipes and find the number of enclosed tiles
  return clearMap(map, route).reduce(
    (total, row, y) =>
      total +
      row.reduce((enclosedTiles, _, x) => {
        if (!routeIncludesPoint(route, [y, x])) {
          const walls = row
            // Check left of current position
            .slice(0, x)
            .join("")
            // Remove anything that's not a wall
            .replaceAll(".", "")
            .replaceAll("-", "")
            // Start becomes a wall
            .replaceAll("S", "|")
            // Two pipe joins become a wall
            .replaceAll("L7", "|")
            .replaceAll("FJ", "|")
            .split("");

          if (walls.length % 2 === 1) {
            // if it's an odd number of wall then it's enclosed
            enclosedTiles += 1;
          }
        }
        return enclosedTiles;
      }, 0),
    0
  );
};

export { part1, part2 };
