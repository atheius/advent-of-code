import { readLines, aperture } from "../../../../helpers.js";

const getFirstUniqueWindowIdx = (windows) => {
  for (let i = 0; i < windows.length; i++) {
    if (new Set(windows[i]).size === windows[0].length) {
      return i;
    }
  }
};

const part1 = (input) => {
  const parsedInput = readLines(input)[0].split("");
  return getFirstUniqueWindowIdx(aperture(4, parsedInput)) + 4;
};

const part2 = (input) => {
  const parsedInput = readLines(input)[0].split("");
  return getFirstUniqueWindowIdx(aperture(14, parsedInput)) + 14;
};

export { part1, part2 };
