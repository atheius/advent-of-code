import { readLinesOfDigits, sum, transpose } from "../../../../helpers.js";

const mostCommon = (x) => (sum(x) >= x.length / 2 ? 1 : 0);

const leastCommon = (x) => (sum(x) < x.length / 2 ? 1 : 0);

const filterBitCriteria = (inputs, criteria) => {
  let filteredInputs = inputs;
  let idx = 0;
  while (filteredInputs.length > 1) {
    filteredInputs = filteredInputs.filter(
      (item) => item[idx] === criteria(transpose(filteredInputs)[idx])
    );
    idx += 1;
  }
  return filteredInputs[0];
};

const part1 = (input) => {
  const inputs = readLinesOfDigits(input);

  const transposed = transpose(inputs);
  const gammaRate = parseInt(transposed.map(mostCommon).join(""), 2);
  const epsilonRate = parseInt(transposed.map(leastCommon).join(""), 2);

  return gammaRate * epsilonRate;
};

const part2 = (input) => {
  const inputs = readLinesOfDigits(input);

  const oxygenGeneratorRating = parseInt(
    filterBitCriteria(inputs, mostCommon).join(""),
    2
  );

  const c02ScrubberRating = parseInt(
    filterBitCriteria(inputs, leastCommon).join(""),
    2
  );

  return oxygenGeneratorRating * c02ScrubberRating;
};

export { part1, part2 };
