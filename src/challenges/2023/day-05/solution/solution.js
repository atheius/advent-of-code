import { readLines, chunk } from "../../../../helpers.js";

const parseInput = (input) => {
  const lines = readLines(input).filter((x) => x !== "");

  const [seedLine, ...content] = lines;

  const ret = {};

  ret.seeds = seedLine
    .split("seeds: ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  let currentLine = "";
  for (const line of content) {
    if (line.includes(":")) {
      currentLine = line.split(" ")[0];
      ret[currentLine] = [];
    } else {
      ret[currentLine].push(line.split(" ").map((x) => parseInt(x)));
    }
  }

  return ret;
};

const getMappedNumber = (map, number, reverse = false) => {
  for (const range of map) {
    let [destinationRangeStart, sourceRangeStart, rangeNum] = range;

    if (reverse) {
      // reverse source and destination
      [sourceRangeStart, destinationRangeStart, rangeNum] = range;
    }

    if (number >= sourceRangeStart && number < sourceRangeStart + rangeNum) {
      return number - sourceRangeStart + destinationRangeStart;
    }
  }

  return number;
};

const isValidSeed = (seed, seedRanges) => {
  for (const [start, num] of seedRanges) {
    if (seed >= start && seed <= start + num) {
      return true;
    }
  }
  return false;
};

const part1 = (input) => {
  const { seeds, ...seedMaps } = parseInput(input);

  return Math.min(
    ...seeds.map((seed) =>
      Object.keys(seedMaps).reduce(
        (mappedSeed, map) => getMappedNumber(seedMaps[map], mappedSeed),
        seed
      )
    )
  );
};

const part2 = (input) => {
  const { seeds, ...seedMaps } = parseInput(input);

  const seedRanges = chunk(seeds, 2);

  // brute force search in reverse from location 0 until we find a valid seed
  // ... very slow but it works eventually XD
  let currentLocation = 0;
  while (true) {
    currentLocation++;
    const seed = Object.keys(seedMaps)
      .toReversed()
      .reduce(
        (mappedSeed, map) => getMappedNumber(seedMaps[map], mappedSeed, true),
        currentLocation
      );
    if (isValidSeed(seed, seedRanges)) {
      return currentLocation;
    }
  }
};

export { part1, part2 };
