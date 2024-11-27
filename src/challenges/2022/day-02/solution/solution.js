import { readLines, sum } from "../../../../helpers.js";

const scoreMap = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
};

const part1 = (input) => {
  const strategyGuide = readLines(input).map((strategy) => strategy.split(" "));

  const resultMap = {
    A: {
      X: 3,
      Y: 6,
      Z: 0,
    },
    B: {
      X: 0,
      Y: 3,
      Z: 6,
    },
    C: {
      X: 6,
      Y: 0,
      Z: 3,
    },
  };

  return sum(
    strategyGuide.map(
      ([opponent, you]) => scoreMap[you] + resultMap[opponent][you]
    )
  );
};

const part2 = (input) => {
  const strategyGuide = readLines(input).map((strategy) => strategy.split(" "));

  const strategyMap = {
    X: {
      // Play to lose
      A: scoreMap["Z"],
      B: scoreMap["X"],
      C: scoreMap["Y"],
    },
    Y: {
      // Play to draw
      A: scoreMap["X"] + 3,
      B: scoreMap["Y"] + 3,
      C: scoreMap["Z"] + 3,
    },
    Z: {
      // Play to win
      A: scoreMap["Y"] + 6,
      B: scoreMap["Z"] + 6,
      C: scoreMap["X"] + 6,
    },
  };

  return sum(
    strategyGuide.map(([opponent, you]) => strategyMap[you][opponent])
  );
};

export { part1, part2 };
