import { readLines, mod, lowestCommonMultiple } from "../../../../helpers.js";

const parseInput = (input) => {
  const [directions, ...lines] = readLines(input).filter((line) => line !== "");

  const pathMap = lines
    .map((line) => line.split(" = "))
    .map(([start, paths]) => [
      start,
      paths.replaceAll(")", "").replaceAll("(", "").split(", "),
    ])
    .reduce(
      (map, [start, [left, right]]) => ({
        ...map,
        [start]: [left, right],
      }),
      {}
    );

  return [directions.trim().split(""), pathMap];
};

const getSteps = (startNode, directions, nodeMap, part2 = false) => {
  let steps = 0;
  let currentNode = startNode;

  while (part2 ? !currentNode.endsWith("Z") : currentNode !== "ZZZ") {
    if (directions[mod(steps, directions.length)] === "L") {
      currentNode = nodeMap[currentNode][0];
    } else {
      currentNode = nodeMap[currentNode][1];
    }
    steps += 1;
  }

  return steps;
};

const part1 = (input) => getSteps("AAA", ...parseInput(input));

const part2 = (input) => {
  const [directions, pathMap] = parseInput(input);
  const startPositions = Object.keys(pathMap).filter((key) =>
    key.endsWith("A")
  );
  return (
    startPositions
      .map((startNode) => getSteps(startNode, directions, pathMap, true))
      // find the lowest common multiple of all the step counts
      .reduce((lcm, value) => lowestCommonMultiple(lcm, value))
  );
};

export { part1, part2 };
