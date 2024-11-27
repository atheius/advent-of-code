import { readLines, sum } from "../../../../helpers.js";

const decimalToSnafu = (num) => {
  // Parse number and convert to base 5
  const original = Number.parseInt(num, 10)
    .toString(5)
    .split("")
    .map((x) => Number.parseInt(x, 10));

  // Create a new array of digits (allow extra space for spillover)
  let converted = [0, ...original];

  // Use base 5 number, but add 1 to next highest digit if digit is a 3 or a 4
  for (let idx = converted.length - 1; idx >= 0; idx--) {
    if (converted[idx] >= 3) {
      converted[idx - 1] += 1;
    }
    if (converted[idx] > 4) {
      // Rollover digit to 0
      converted[idx] = 0;
    }
  }

  // Remove the leading 0
  if (converted[0] === 0) {
    converted.shift();
  }

  // Convert to SNAFU number
  return converted
    .map((x) => {
      if (x === 4) {
        return "-";
      }
      if (x === 3) {
        return "=";
      }
      return x;
    })
    .join("");
};

const snafuToDecimal = (snafu) =>
  snafu
    .split("")
    .reverse()
    .reduce((num, x, idx) => {
      if (x === "=") {
        return num + -2 * Math.pow(5, idx);
      }
      if (x === "-") {
        return num + -1 * Math.pow(5, idx);
      }
      return num + Number.parseInt(x, 10) * Math.pow(5, idx);
    }, 0);

const part1 = (input) =>
  decimalToSnafu(sum(readLines(input).map(snafuToDecimal)));

const part2 = (input) => {
  // No part 2 for day 25
  return null;
};

export { part1, part2 };
