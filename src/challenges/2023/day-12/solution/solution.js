import { readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => {
    const [a, b] = line.split(" ");
    return [a, b.split(",").map((x) => parseInt(x))];
  });

const cache = new Map();

const countPossibleArrangements = (row, pattern) => {
  // remove . from start / end of row
  row = row.replace(/^\.+|\.+$/g, "");

  if (row === "") {
    return pattern.length ? 0 : 1;
  }

  if (!pattern.length) {
    return row.includes("#") ? 0 : 1;
  }

  const key = [row, pattern].join(" ");
  if (cache.has(key)) {
    return cache.get(key);
  }

  let arrangements = 0;
  // get the next broken springs
  const broken = row.match(/^#+(?=\.|$)/);
  if (broken) {
    if (broken[0].length === pattern[0]) {
      arrangements += countPossibleArrangements(
        row.slice(pattern[0]),
        pattern.slice(1)
      );
    }
  } else if (row.includes("?")) {
    // keep going
    arrangements += countPossibleArrangements(row.replace("?", "."), pattern);
    arrangements += countPossibleArrangements(row.replace("?", "#"), pattern);
  }

  cache.set(key, arrangements);
  return arrangements;
};

const part1 = (input) => {
  const conditionRecords = parseInput(input);

  let numberOfPossibleArrangements = 0;
  for (const [condition, pattern] of conditionRecords) {
    const arrangements = countPossibleArrangements(condition, pattern);
    numberOfPossibleArrangements += arrangements;
  }

  return numberOfPossibleArrangements;
};

const part2 = (input) => {
  const conditionRecords = parseInput(input).map(([condition, pattern]) => [
    [condition, condition, condition, condition, condition].join("?"),
    [...pattern, ...pattern, ...pattern, ...pattern, ...pattern],
  ]);

  let numberOfPossibleArrangements = 0;
  for (const [condition, pattern] of conditionRecords) {
    const arrangements = countPossibleArrangements(condition, pattern);
    numberOfPossibleArrangements += arrangements;
  }

  return numberOfPossibleArrangements;
};

export { part1, part2 };
