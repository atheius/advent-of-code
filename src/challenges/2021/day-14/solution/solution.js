import { readLines } from "../../../../helpers.js";

const parseInput = (input) => {
  const lines = readLines(input);
  const polymerTemplate = lines[0].split("");
  const pairInsertionRules = lines
    .slice(2)
    .map((rule) => rule.split(" -> "))
    .reduce((acc, curr) => {
      return { ...acc, [curr[0]]: curr[1] };
    }, {});
  return {
    polymerTemplate,
    pairInsertionRules,
  };
};

const getCounts = (input) => {
  const counts = {};
  for (let [key, value] of Object.entries(input)) {
    if (!counts[key[0]]) {
      counts[key[0]] = value;
    } else {
      counts[key[0]] += value;
    }
  }
  return counts;
};

const runStep = (input, rules) => {
  const nextInput = Object.keys(rules).reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {}
  );
  for (let [key, value] of Object.entries(input)) {
    nextInput[key[0] + rules[key]] += value;
    nextInput[rules[key] + key[1]] += value;
  }
  return nextInput;
};

const runProcess = (polymerTemplate, pairInsertionRules, steps) => {
  const lastElement = polymerTemplate.slice(-1);

  const pairFrequencies = Object.keys(pairInsertionRules).reduce(
    (acc, curr) => ({ ...acc, [curr]: 0 }),
    {}
  );

  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    pairFrequencies[polymerTemplate[i] + polymerTemplate[i + 1]] += 1;
  }

  let currentInput = pairFrequencies;
  for (let i = 0; i < steps; i++) {
    currentInput = runStep(currentInput, pairInsertionRules);
  }

  const counts = getCounts(currentInput);

  counts[lastElement] += 1;

  return {
    min: Math.min(...Object.values(counts)),
    max: Math.max(...Object.values(counts)),
  };
};

const part1 = (input) => {
  const { polymerTemplate, pairInsertionRules } = parseInput(input);
  const { max, min } = runProcess(polymerTemplate, pairInsertionRules, 10);
  return max - min;
};

const part2 = (input) => {
  const { polymerTemplate, pairInsertionRules } = parseInput(input);
  const { max, min } = runProcess(polymerTemplate, pairInsertionRules, 40);
  return max - min;
};

export { part1, part2 };
