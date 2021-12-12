import {
  readLines,
  difference,
  symmetricDifference,
} from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((x) => {
    const split = x.split("|");
    return [split[0].trim().split(" "), split[1].trim().split(" ")];
  });

const findUniqueDigits = (searchList, count = false) =>
  searchList.reduce(
    (acc, input) => {
      if (input.length == 2) {
        return count ? (acc += 1) : { ...acc, 1: input };
      }
      if (input.length === 3) {
        return count ? (acc += 1) : { ...acc, 7: input };
      }
      if (input.length === 4) {
        return count ? (acc += 1) : { ...acc, 4: input };
      }
      if (input.length === 7) {
        return count ? (acc += 1) : { ...acc, 8: input };
      }
      return acc;
    },
    count ? 0 : {}
  );

const findDigitsStage1 = (searchList, digits) =>
  searchList.reduce(
    (acc, item) => {
      if (
        difference(digits[8], item).length === 1 &&
        difference(item, digits[4]).length === 2
      ) {
        return { ...acc, 9: item };
      } else if (difference(digits[1], item).length === 1) {
        return { ...acc, 6: item };
      } else if (difference(digits[4], item).length === 1) {
        return { ...acc, 0: item };
      }
    },
    { ...digits }
  );

const findDigitsStage2 = (searchList, digits) =>
  searchList.reduce(
    (acc, item) => {
      if (difference(digits[6], item).length === 1) {
        return { ...acc, 5: item };
      } else if (difference(digits[1], item).length === 1) {
        return { ...acc, 2: item };
      } else if (difference(digits[1], item).length === 0) {
        return { ...acc, 3: item };
      }
    },
    { ...digits }
  );

const decodeDigit = (input, digits) => {
  for (const [number, digitValues] of Object.entries(digits)) {
    if (symmetricDifference(input, digitValues).length === 0) {
      return number;
    }
  }
};

const part1 = (input) => {
  const signalPatterns = parseInput(input);

  let count = 0;
  for (const [, outputs] of signalPatterns) {
    count += findUniqueDigits(
      outputs.map((x) => x.split("")),
      true
    );
  }

  return count;
};

const part2 = (input) => {
  const signalPatterns = parseInput(input);

  let total = 0;
  for (const [inputs, outputs] of signalPatterns) {
    let digits = findUniqueDigits(inputs.map((x) => x.split("")));

    digits = findDigitsStage1(
      inputs.filter((x) => x.length === 6).map((x) => x.split("")),
      digits
    );

    digits = findDigitsStage2(
      inputs.filter((x) => x.length === 5).map((x) => x.split("")),
      digits
    );

    const subTotal = parseInt(
      outputs
        .map((x) => x.split(""))
        .map((output) => decodeDigit(output, digits).toString())
        .join(""),
      10
    );

    total += subTotal;
  }

  return total;
};

export { part1, part2 };
