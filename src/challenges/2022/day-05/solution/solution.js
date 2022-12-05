import { transpose } from "../../../../helpers.js";

const parseInput = (input) => {
  const [rawCrateMap, rawInstructions] = input.split("\n\n");

  const instructions = rawInstructions
    .split("\n")
    .filter((x) => x !== "")
    .map((i) => i.match(/\d+/g).map((x) => Number.parseInt(x, 10)));

  const crates = transpose(
    rawCrateMap.split("\n").map((line) =>
      line
        .split("")
        .slice(1)
        // Crate is on every 4th character in line
        .filter((_, index) => index % 4 === 0)
    )
  ).map((x) => x.filter((crate) => crate != " ").reverse());

  return [instructions, crates];
};

const part1 = (input) => {
  const [instructions, crates] = parseInput(input);

  const reArrangedCrates = [...crates];

  for (const [numToMove, source, location] of instructions) {
    for (let i = 0; i < numToMove; i++) {
      reArrangedCrates[location - 1].push(reArrangedCrates[source - 1].pop());
    }
  }

  return reArrangedCrates.reduce((acc, stack) => acc + stack.pop(), "");
};

const part2 = (input) => {
  const [instructions, crates] = parseInput(input);

  const reArrangedCrates = [...crates];

  for (const [numToMove, source, location] of instructions) {
    const cratesToMove = [];
    for (let i = 0; i < numToMove; i++) {
      cratesToMove.push(reArrangedCrates[source - 1].pop());
    }
    reArrangedCrates[location - 1].push(...cratesToMove.reverse());
  }

  return reArrangedCrates.reduce((acc, stack) => acc + stack.pop(), "");
};

export { part1, part2 };
