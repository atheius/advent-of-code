import { readLines, max, sortDescending, sum } from "../../../../helpers.js";

const group = (input) =>
  input.reduce(
    (acc, curr) => {
      if (curr === "") {
        return [...acc, 0];
      }
      acc[acc.length - 1] += Number.parseInt(curr, 10);
      return acc;
    },
    [0]
  );

const part1 = (input) => max(group(readLines(input)));

const part2 = (input) =>
  sum(sortDescending(group(readLines(input))).slice(0, 3));

export { part1, part2 };
