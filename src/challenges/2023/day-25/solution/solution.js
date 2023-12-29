import { mincut } from "@graph-algorithm/minimum-cut";
import { readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input)
    .map((line) => {
      const [from, tos] = line.split(":");
      return tos
        .trim()
        .split(" ")
        .map((to) => [from, to]);
    })
    .flat();

const part1 = (input) => {
  const connections = parseInput(input);

  const numNodes = new Set(connections.flat());

  // Find the minimum cuts to create two graphs
  const minCuts = [...mincut(connections)].map((x) => x.toString());

  const nodeMap = connections
    .filter(
      ([from, to]) =>
        !minCuts.includes([from, to].toString()) &&
        !minCuts.includes([to, from].toString())
    )
    .reduce((nodes, [from, to]) => {
      if (!nodes[from]) {
        nodes[from] = [];
      }
      if (!nodes[to]) {
        nodes[to] = [];
      }
      if (!nodes[from].includes(to)) {
        nodes[from].push(to);
      }
      if (!nodes[to].includes(from)) {
        nodes[to].push(from);
      }
      return nodes;
    }, {});

  const group = new Set();
  const queue = [Object.keys(nodeMap)[0]];
  while (queue.length) {
    const node = queue.shift();
    if (group.has(node)) {
      continue;
    }
    group.add(node);
    if (nodeMap[node]) {
      queue.push(...nodeMap[node]);
    }
  }

  return group.size * (numNodes.size - group.size);
};

export { part1 };
