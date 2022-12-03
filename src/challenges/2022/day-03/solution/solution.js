import { readLines, chunk, intersect, sum } from "../../../../helpers.js";

const priorityMap =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const part1 = (input) => {
  const parsedInput = readLines(input).map((x) => x.split(""));

  return sum(
    parsedInput.map((items) =>
      sum(
        intersect(
          // First compartment
          new Set(items.slice(0, Math.ceil(items.length / 2))),
          // Second compartment
          new Set(items.slice(Math.ceil(items.length / 2)))
        ).map((commonItems) => priorityMap.indexOf(commonItems) + 1)
      )
    )
  );
};

const part2 = (input) => {
  const groupedInput = chunk(
    readLines(input).map((x) => new Set(x.split(""))),
    3
  );

  return sum(
    groupedInput.map(
      (elves) =>
        priorityMap.indexOf(
          // Find common item to each group of elves
          intersect(intersect(elves[0], elves[1]), elves[2])[0]
        ) + 1
    )
  );
};

export { part1, part2 };
