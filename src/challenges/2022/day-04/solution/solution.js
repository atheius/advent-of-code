import { readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input)
    .map((line) => line.split(","))
    .map((ranges) =>
      ranges.reduce(
        (acc, curr) => [
          ...acc,
          ...curr
            .split(",")
            .map((splitRange) =>
              splitRange.split("-").map((number) => Number.parseInt(number))
            ),
        ],
        []
      )
    );

const fullOverlap = (x) =>
  (x[0][0] <= x[1][0] && x[0][1] >= x[1][1]) ||
  (x[0][0] >= x[1][0] && x[0][1] <= x[1][1]);

const someOverlap = (x) =>
  (x[0][0] <= x[1][0] && x[0][1] <= x[1][1] && x[0][1] >= x[1][0]) ||
  (x[0][0] >= x[1][0] && x[0][1] >= x[1][1] && x[0][0] <= x[1][1]);

const part1 = (input) => {
  const parsedInput = parseInput(input);

  return parsedInput.reduce((acc, curr) => {
    if (fullOverlap(curr)) {
      acc += 1;
    }
    return acc;
  }, 0);
};

const part2 = (input) => {
  const parsedInput = parseInput(input);

  return parsedInput.reduce((acc, curr) => {
    if (fullOverlap(curr) || someOverlap(curr)) {
      acc += 1;
    }
    return acc;
  }, 0);
};

export { part1, part2 };
