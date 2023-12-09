import { aperture, readLines, sum } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => line.split(" ").map((x) => parseInt(x)));

const getNextHistoryValue = (line) => {
  const lines = [line];

  let next = line;
  while (!next.every((x) => x === 0)) {
    next = aperture(2, next).map(([x, y]) => y - x);
    lines.push(next);
  }

  return lines
    .toReversed()
    .splice(1)
    .reduce((nextNum, x) => x[x.length - 1] + nextNum, 0);
};

const part1 = (input) => sum(parseInput(input).map(getNextHistoryValue));

const part2 = (input) =>
  sum(
    parseInput(input)
      .map((x) => x.toReversed())
      .map(getNextHistoryValue)
  );

export { part1, part2 };
