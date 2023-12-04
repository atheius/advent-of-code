import { intersect, readLines, sum } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input)
    .map((line) => line.split(":"))
    .map(([, card]) =>
      card.split("|").map((nums) =>
        nums
          .trim()
          .split(/\s+/)
          .map((x) => parseInt(x, 10))
      )
    );

const intersectLength = (a, b) => intersect(new Set(a), new Set(b)).length;

const part1 = (input) =>
  sum(
    parseInput(input).map(([winning, numbers]) =>
      intersectLength(winning, numbers)
        ? Math.pow(2, intersectLength(winning, numbers) - 1)
        : 0
    )
  );

const part2 = (input) => {
  // also track count and score
  const parsedInput = parseInput(input).map((x) => [...x, 1, 0]);

  const cards = [...parsedInput];

  return sum(
    parsedInput
      .reduce((cards, [winning, numbers, count], cardIdx) => {
        const winningNumbers = intersectLength(winning, numbers);
        if (winningNumbers) {
          cards[cardIdx][3] = Math.pow(2, winningNumbers - 1);
          for (let copyNum = 1; copyNum <= count; copyNum++) {
            for (let i = 1; i <= winningNumbers; i++) {
              cards[cardIdx + i][2] += 1;
            }
          }
        }
        return cards;
      }, cards)
      .map((x) => x[2])
  );
};

export { part1, part2 };
