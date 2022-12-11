import { product } from "../../../../helpers.js";

const parseInstructions = (input) =>
  input
    .trim()
    .split("\n\n")
    .map((monkeyGroup) =>
      monkeyGroup
        .split("\n")
        .map((line) => line.trim())
        .slice(1)
    )
    .map((info) => ({
      items: info[0]
        .split("Starting items: ")[1]
        .split(", ")
        .map((x) => Number.parseInt(x, 10)),
      operation: info[1]
        .split("Operation: ")[1]
        .split("new = ")[1]
        .split(" ")
        .map((x) => (isNaN(x) ? x : Number.parseInt(x, 10))),
      test: {
        divisible: Number.parseInt(info[2].split("Test: divisible by ")[1], 10),
        isTrue: Number.parseInt(
          info[3].split("If true: throw to monkey ")[1],
          10
        ),
        isFalse: Number.parseInt(
          info[4].split("If false: throw to monkey ")[1]
        ),
      },
      inspectedItems: 0,
    }));

const runOperation = (worrylevel, operation) => {
  operation = operation.map((x) => (x === "old" ? worrylevel : x));
  if (operation[1] === "+") {
    return operation[0] + operation[2];
  }
  if (operation[1] === "*") {
    return operation[0] * operation[2];
  }
};

const calculateMonkeyBusiness = (monkeys, part) => {
  // Find a common multiple we can mod worryLevel by and not affect division (part 2)
  const commonMultiple = product(monkeys.map((x) => x.test.divisible));

  const rounds = part === 1 ? 20 : 10000;

  let currentRound = 0;
  let worryLevel;
  while (currentRound < rounds) {
    for (const currentMonkey of monkeys) {
      let thrownItems = 0;

      for (const item of currentMonkey.items) {
        worryLevel = runOperation(item, currentMonkey.operation);

        if (part === 1) {
          worryLevel = Math.floor(worryLevel / 3);
        } else {
          worryLevel = worryLevel % commonMultiple;
        }

        if (worryLevel % currentMonkey.test.divisible === 0) {
          monkeys[currentMonkey.test.isTrue].items.push(worryLevel);
        } else {
          monkeys[currentMonkey.test.isFalse].items.push(worryLevel);
        }

        thrownItems += 1;
        currentMonkey.inspectedItems += 1;
      }
      // Remove items that have been thrown to other monkeys
      currentMonkey.items = currentMonkey.items.slice(thrownItems);
    }
    currentRound += 1;
  }

  const sortedMonkeys = monkeys.sort(
    (a, b) => b.inspectedItems - a.inspectedItems
  );

  return sortedMonkeys[0].inspectedItems * sortedMonkeys[1].inspectedItems;
};

const part1 = (input) => {
  const monkeys = parseInstructions(input);
  const monkeyBusiness = calculateMonkeyBusiness(monkeys, 1);
  return monkeyBusiness;
};

const part2 = (input) => {
  const monkeys = parseInstructions(input);
  const monkeyBusiness = calculateMonkeyBusiness(monkeys, 2);
  return monkeyBusiness;
};

export { part1, part2 };
