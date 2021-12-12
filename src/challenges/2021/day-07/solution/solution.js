import { readCommaSeperatedNumbers, sum } from "../../../../helpers.js";

const triangleNumber = (x) => (Math.pow(x, 2) + x) / 2;

const smallest = (items) => items.sort((a, b) => a - b)[0];

const part1 = (input) => {
  const positions = readCommaSeperatedNumbers(input);
  const options = [];
  for (let i = 0; i <= Math.max(...positions); i++) {
    options.push(sum(positions.map((x) => Math.abs(x - i))));
  }
  return smallest(options);
};

const part2 = (input) => {
  const positions = readCommaSeperatedNumbers(input);
  const options = [];
  for (let i = 0; i <= Math.max(...positions); i++) {
    options.push(sum(positions.map((x) => triangleNumber(Math.abs(x - i)))));
  }
  return smallest(options);
};

export { part1, part2 };
