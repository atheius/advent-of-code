import { readLines, sum } from "../../../../helpers.js";
import chalk from "chalk";

const blockChar = "█";
const spaceChar = " ";

const parseInput = (input) => {
  const lines = readLines(input);
  const points = lines
    .slice(0, lines.indexOf(""))
    .map((point) => point.split(",").map((x) => parseInt(x, 10)));
  const instructions = lines
    .slice(lines.indexOf("") + 1, lines.length)
    .map((x) => {
      const instructionString = x.replace("fold along ", "");
      return {
        axis: instructionString.split("=")[0],
        num: parseInt(instructionString.split("=")[1], 10),
      };
    });
  return {
    points,
    instructions,
  };
};

const createDotMap = (points) => {
  const { height, width } = points.reduce(
    ({ height, width }, [x, y]) => ({
      height: y > height ? y : height,
      width: x > width ? x : width,
    }),
    {
      height: 0,
      width: 0,
    }
  );
  const dotMap = Array(height + 1)
    .fill(null)
    .map(() => Array(width + 1).fill(spaceChar));
  points.forEach(([x, y]) => {
    dotMap[y][x] = blockChar;
  });
  return dotMap;
};

const foldDotMap = ({ axis, num }, dotMap) => {
  const [height, width] = [dotMap.length, dotMap[0].length];
  let foldedMap = dotMap.slice(0, num);

  if (axis === "y") {
    // Fold on Y axis
    foldedMap = dotMap.slice(0, num);
    const maxY = 2 * num + 1 > height ? height : 2 * num + 1;
    for (let y = num; y < maxY; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (dotMap[y][x] === blockChar) {
          foldedMap[num - (y - num)][x] = blockChar;
        }
      }
    }
  } else {
    // Fold on X axis
    foldedMap = dotMap.map((row) => (row ? row.slice(0, num) : []));
    const maxX = 2 * num + 1 > width ? width : 2 * num + 1;
    for (let y = 0; y < height; y += 1) {
      for (let x = num; x < maxX; x += 1) {
        if (dotMap[y][x] === blockChar) {
          foldedMap[y][num - (x - num)] = blockChar;
        }
      }
    }
  }

  return foldedMap;
};

const part1 = (input) => {
  const { points, instructions } = parseInput(input);

  let nextDotMap = createDotMap(points);
  for (let i = 0; i < 1; i += 1) {
    nextDotMap = foldDotMap(instructions[i], nextDotMap);
  }

  const numDots = nextDotMap.reduce(
    (total, row) => total + sum(row.map((x) => (x === spaceChar ? 0 : 1))),
    0
  );

  return numDots;
};

const part2 = (input, print = true) => {
  const { points, instructions } = parseInput(input);

  let nextDotMap = createDotMap(points);
  for (let i = 0; i < instructions.length; i += 1) {
    nextDotMap = foldDotMap(instructions[i], nextDotMap);
  }

  nextDotMap.reduce(
    (total, row) => total + sum(row.map((x) => (x === spaceChar ? 0 : 1))),
    0
  );

  if (print) {
    for (let x = 0; x < nextDotMap.length; x += 1) {
      console.log(chalk.white(nextDotMap[x].join("")));
    }
  }

  return 0;
};

export { part1, part2 };
