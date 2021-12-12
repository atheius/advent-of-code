import { readCommaSeperatedNumbers, sum } from "../../../../helpers.js";

const rotateArray = (arr) => {
  arr.push(arr.shift());
  return arr;
};

const nextDay = (fishCounter) => {
  const resetFish = fishCounter[0] || 0;
  const nextDay = rotateArray([...fishCounter]);
  nextDay[6] += resetFish;
  return nextDay;
};

const createFishCounter = (fish, maxCycleTime) =>
  fish.reduce((acc, curr) => {
    acc[curr] += 1;
    return [...acc];
  }, new Array(maxCycleTime + 1).fill(0));

const part1 = (input) => {
  const numDays = 80;
  const maxCycleTime = 8;

  let fishCounter = createFishCounter(
    readCommaSeperatedNumbers(input),
    maxCycleTime
  );

  for (let i = 0; i < numDays; i++) {
    fishCounter = nextDay(fishCounter);
  }

  return sum(fishCounter);
};

const part2 = (input) => {
  const numDays = 256;
  const maxCycleTime = 8;

  let fishCounter = createFishCounter(
    readCommaSeperatedNumbers(input),
    maxCycleTime
  );

  for (let i = 0; i < numDays; i++) {
    fishCounter = nextDay(fishCounter);
  }

  return sum(fishCounter);
};

export { part1, part2 };
