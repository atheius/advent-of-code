const parseInput = (input) => {
  const lines = input.split("\n");

  let indexMap;
  let rawCrates = [];
  let instructions = [];

  for (const line of lines) {
    if (!indexMap && !line.startsWith(" 1")) {
      // These are the crates...
      rawCrates.push(line);
    }
    if (indexMap && line !== "") {
      // These are the instructions...
      instructions.push(line.match(/\d+/g).map((x) => Number.parseInt(x, 10)));
    }
    if (line.startsWith(" 1")) {
      // Create an index map from the crate index line
      indexMap = line.split("").reduce((acc, char, idx) => {
        if (char !== " ") {
          acc[char] = idx;
        }
        return acc;
      }, {});
    }
  }

  const crates = {};

  for (const line of rawCrates) {
    for (const [key, value] of Object.entries(indexMap)) {
      if (!crates[key]) {
        crates[key] = [];
      }
      if (line[value] !== " ") {
        // Add crates in reverse order
        crates[key] = [line[value], ...crates[key]];
      }
    }
  }

  return [instructions, crates];
};

const part1 = (input) => {
  const [instructions, crates] = parseInput(input);

  const reArrangedCrates = { ...crates };

  for (const [numToMove, source, location] of instructions) {
    for (let i = 0; i < numToMove; i++) {
      reArrangedCrates[location].push(reArrangedCrates[source].pop());
    }
  }

  return Object.values(reArrangedCrates).reduce(
    (acc, stack) => acc + stack.pop(),
    ""
  );
};

const part2 = (input) => {
  const [instructions, crates] = parseInput(input);

  const reArrangedCrates = { ...crates };

  for (const [numToMove, source, location] of instructions) {
    const cratesToMove = [];
    for (let i = 0; i < numToMove; i++) {
      cratesToMove.push(reArrangedCrates[source].pop());
    }
    reArrangedCrates[location].push(...cratesToMove.reverse());
  }

  return Object.values(reArrangedCrates).reduce(
    (acc, stack) => acc + stack.pop(),
    ""
  );
};

export { part1, part2 };
