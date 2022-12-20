import { readLinesContainingNumbers } from "../../../../helpers.js";

const parseInput = (input) =>
  readLinesContainingNumbers(input).reduce(
    (acc, curr) => [...acc, ...curr],
    []
  );

const mixNumbers = (numbers, times = 1) => {
  const numbersWithPositions = numbers.map((number, idx) => [number, idx]);
  for (let t = 0; t < times; t++) {
    for (let x = 0; x < numbersWithPositions.length; x++) {
      const lastIndex = numbersWithPositions.findIndex((n) => n[1] === x);
      const number = numbersWithPositions[lastIndex][0];
      // Remove the number from the previous index
      numbersWithPositions.splice(lastIndex, 1);
      // Insert at the new index
      numbersWithPositions.splice(
        (lastIndex + number) % numbersWithPositions.length,
        0,
        // Store the number with the original index (x)
        [number, x]
      );
    }
  }
  return numbersWithPositions.map((a) => a[0]);
};

const addDecryptionKey = (numbers, key) =>
  numbers.map((number) => number * key);

const coordinateSum = (numbers) => {
  let sum = 0;
  for (let nextStep of [1000, 2000, 3000]) {
    let pointer = numbers.indexOf(0);
    pointer = (pointer + nextStep) % numbers.length;
    sum += numbers[pointer];
  }
  return sum;
};

const part1 = (input) => {
  const numbers = parseInput(input);
  const mixedNumbers = mixNumbers(numbers);
  return coordinateSum(mixedNumbers);
};

const part2 = (input) => {
  const numbers = addDecryptionKey(parseInput(input), 811589153);
  const mixedNumbers = mixNumbers(numbers, 10);
  return coordinateSum(mixedNumbers);
};

export { part1, part2 };
