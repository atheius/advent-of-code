import { readLines, sum } from "../../../../helpers.js";

const digitsPattern =
  /(?=(one|two|three|four|five|six|seven|eight|nine|zero|\d))/gi;

const digitMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const part1 = (input) =>
  sum(
    readLines(input).map((line) => {
      const numbers = line.match(/\d/g);

      return parseInt(
        numbers[0] +
          (numbers.length > 0 ? numbers[numbers.length - 1] : numbers[0]),
        10
      );
    })
  );

const part2 = (input) =>
  sum(
    readLines(input).map((line) => {
      const numbers = [...line.matchAll(digitsPattern)]
        .map((match) => match[1])
        .map((num) => (num in digitMap ? digitMap[num] : num));

      return parseInt(
        numbers[0] +
          (numbers.length > 0 ? numbers[numbers.length - 1] : numbers[0]),
        10
      );
    })
  );

export { part1, part2 };
