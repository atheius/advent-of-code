import { product, readLines, zip } from "../../../../helpers.js";

const parseInput = (input, joinedInput = false) => {
  const [times, distances] = readLines(input).map((line) =>
    line
      .split(":")[1]
      .trim()
      .split(/\s+/)
      .map((x) => parseInt(x))
  );

  if (joinedInput) {
    return [parseInt(times.join("")), parseInt(distances.join(""))];
  }

  return zip(times, distances);
};

const calculateWins = (time, distance) => {
  let wins = 0;
  for (let currentTime = 1; currentTime < time; currentTime++) {
    if (currentTime * (time - currentTime) > distance) {
      wins += 1;
    }
  }
  return wins;
};

const part1 = (input) =>
  product(
    parseInput(input).reduce(
      (wins, [time, distance]) => [...wins, calculateWins(time, distance)],
      []
    )
  );

const part2 = (input) => calculateWins(...parseInput(input, true));

export { part1, part2 };
