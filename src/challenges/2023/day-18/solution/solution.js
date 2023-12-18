import { readLines, getAreaOfPolygon } from "../../../../helpers.js";

const directionMap = {
  0: "R",
  1: "D",
  2: "L",
  3: "U",
};

const parseInput = (input) =>
  readLines(input).map((line) => {
    const [direction, num] = line.split(" ");
    return [direction, parseInt(num)];
  });

const parseInputFromColour = (input) =>
  readLines(input).map((line) => {
    const [, , colour] = line.split(" ");
    return [
      // Read the last digit as direction
      directionMap[colour.substring(colour.length - 2, colour.length - 1)],
      // Read the number as hex and convert it to decimal
      parseInt(colour.substring(2, colour.length - 2), 16),
    ];
  });

const getPerimeter = (instructions) => {
  const currentPosition = [0, 0];
  const perimeter = [];
  let perimeterLength = 0;

  for (const [direction, num] of instructions) {
    perimeterLength += num;
    if (direction === "R") {
      perimeter.push([currentPosition[0], currentPosition[1] + num]);
      currentPosition[1] += num;
    }
    if (direction === "L") {
      perimeter.push([currentPosition[0], currentPosition[1] - num]);
      currentPosition[1] -= num;
    }
    if (direction === "U") {
      perimeter.push([currentPosition[0] - num, currentPosition[1]]);
      currentPosition[0] -= num;
    }
    if (direction === "D") {
      perimeter.push([currentPosition[0] + num, currentPosition[1]]);
      currentPosition[0] += num;
    }
  }

  return { perimeterLength, perimeter };
};

const getArea = (perimeterCoords, perimeterLength) => {
  // Use the Shoelace formula to calculate the area of the polygon
  const area = getAreaOfPolygon(perimeterCoords);

  // Because the polygon is on a grid and the coordinates are the middle of squares,
  // we need to use Pick's Theorem to calculate the internal area...
  // A = i + b/2 - 1
  // i = A - b/2 + 1
  const internalArea = area - perimeterLength / 2 + 1;

  // Then add the perimeter trench...
  return internalArea + perimeterLength;
};

const part1 = (input) => {
  const parsedInput = parseInput(input);
  const { perimeter, perimeterLength } = getPerimeter(parsedInput);
  return getArea(perimeter, perimeterLength);
};

const part2 = (input) => {
  const parsedInput = parseInputFromColour(input);
  const { perimeter, perimeterLength } = getPerimeter(parsedInput);
  return getArea(perimeter, perimeterLength);
};

export { part1, part2 };
