import { readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((x) => [x.split(" ")[0], parseInt(x.split(" ")[1], 10)]);

const part1 = (input) => {
  const directions = parseInput(input);

  let horizontal = 0;
  let depth = 0;

  for (let i = 0; i < directions.length; i++) {
    const [direction, num] = directions[i];
    if (direction === "forward") {
      horizontal += num;
    } else if (direction === "down") {
      depth += num;
    } else if (direction === "up") {
      depth -= num;
    }
  }

  return horizontal * depth;
};

const part2 = (input) => {
  const directions = parseInput(input);

  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (let i = 0; i < directions.length; i++) {
    const [direction, num] = directions[i];
    if (direction === "forward") {
      horizontal += num;
      depth += aim * num;
    } else if (direction === "down") {
      aim += num;
    } else if (direction === "up") {
      aim -= num;
    }
  }

  return horizontal * depth;
};

export { part1, part2 };
