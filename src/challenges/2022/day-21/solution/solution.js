import { readLines } from "../../../../helpers.js";
import { Equation, parse } from "algebra.js";

const pattern = / [\+\-*\/] /g;

const parseInput = (input) =>
  readLines(input).map((x) => {
    const split = x.split(": ");
    if (Number.isInteger(Number.parseInt(split[1], 10))) {
      return [split[0], Number.parseInt(split[1], 10)];
    } else {
      return [
        split[0],
        [
          split[1].split(pattern)[0],
          split[1].match(pattern)[0].trim(),
          split[1].split(pattern)[1],
        ],
      ];
    }
  });

const findNext = (monkey, allMonkeys) => {
  const nextMonkey = allMonkeys.find((x) => x[0] === monkey);
  if (Array.isArray(nextMonkey[1])) {
    const [monkeyA, operation, monkeyB] = nextMonkey[1];
    return (
      "(" +
      findNext(monkeyA, allMonkeys) +
      operation +
      findNext(monkeyB, allMonkeys) +
      ")"
    );
  }
  return nextMonkey[1].toString();
};

const part1 = (input) => {
  const resultString = findNext("root", parseInput(input));
  return eval(resultString);
};

const part2 = (input) => {
  const monkeys = parseInput(input);

  const rootIndex = monkeys.findIndex((x) => x[0] === "root");
  const humanIndex = monkeys.findIndex((x) => x[0] === "humn");

  // Change root monkey operation to equals
  monkeys[rootIndex] = [
    "root",
    [monkeys[rootIndex][1][0], "=", monkeys[rootIndex][1][2]],
  ];

  // Change human value to "x"
  monkeys[humanIndex] = ["humn", "x"];

  // This is the left and right side of the equation
  const equationParts = findNext("root", monkeys).slice(1, -1).split("=");

  // We can cheat and use Algebra.js to calculate the value of x for us...
  const resultString = new Equation(
    parse(equationParts[0]),
    parse(equationParts[1])
  )
    .solveFor("x")
    .toString();

  // Now just eval the string (have to round down because of approximation error when evaluating)
  return Math.floor(eval(resultString));
};

export { part1, part2 };
