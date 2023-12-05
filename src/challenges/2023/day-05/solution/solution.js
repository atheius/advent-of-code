import { readLines, chunk } from "../../../../helpers.js";

const seedMaps = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];

const parseInput = (input) => {
  const ret = {};
  const lines = readLines(input).filter((x) => x !== "");

  ret.seeds = lines[0]
    .split("seeds: ")[1]
    .split(" ")
    .map((x) => parseInt(x));

  lines.shift();

  let currentLine = "";
  for (const line of lines) {
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
    let destinationRangeStart;
    let sourceRangeStart;
    let rangeNum;

    if (!reverse) {
      [destinationRangeStart, sourceRangeStart, rangeNum] = range;
    } else {
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
  const almanac = parseInput(input);

  const mappedSeeds = [];

  for (const seed of almanac.seeds) {
    let next = seed;
    for (const map of seedMaps) {
      next = getMappedNumber(almanac[map], next);
    }
    mappedSeeds.push(next);
  }

  return Math.min(...mappedSeeds);
};

const part2 = (input) => {
  const almanac = parseInput(input);

  const seedRanges = chunk(almanac.seeds, 2).sort((a, b) => a[0] - b[0]);

  // search in reverse from location 0 until we find a valid seed
  // ... very slow but it works eventually XD

  let found = false;
  let currentLocation = 0;
  while (!found) {
    let next = currentLocation;
    for (const map of seedMaps.toReversed()) {
      next = getMappedNumber(almanac[map], next, true);
    }
    if (isValidSeed(next, seedRanges)) {
      found = true;
    } else {
      currentLocation++;
    }
  }

  return currentLocation;
};

export { part1, part2 };
