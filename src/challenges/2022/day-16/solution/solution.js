import { max, readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input)
    .map((line) => line.split(";"))
    .map((part) => [
      ...part[0].match(/[A-Z]{2}/g),
      Number.parseInt(part[0].split("=")[1], 10),
      [...part[1].matchAll(/[A-Z]{2}/g)].map((match) => match[0]),
    ]);

class Node {
  constructor(value) {
    this.value = value;
    this.neighbours = [];
  }

  addAdjacent(node) {
    if (this.neighbours.indexOf(node) === -1) {
      this.neighbours.push(node);
    }
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    }
    const vertex = new Node(value);
    this.nodes.set(value, vertex);
    return vertex;
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);
    sourceNode.addAdjacent(destinationNode);
    return [sourceNode, destinationNode];
  }

  shortestPath(source, destination) {
    // Breadth First Search (see: https://en.wikipedia.org/wiki/Breadth-first_search)

    const queue = [[source, 0]];
    const visited = new Set([source]);
    let res = Infinity;

    // Keep searching the queue of nodes
    while (queue.length) {
      const [node, steps] = queue.shift();

      // Have we reached the end?
      if (node === destination) {
        res = steps;
        break;
      }

      // Check each neighbour...
      for (const neighbour of this.nodes.get(node).neighbours) {
        if (!visited.has(neighbour.value)) {
          // Add to the queue if we haven't visited before
          queue.push([neighbour.value, steps + 1]);
          visited.add(neighbour.value);
        }
      }
    }

    return res;
  }
}

const createGraph = (scanOutput) => {
  const graph = new Graph();
  for (const [node, _, neighbours] of scanOutput) {
    for (const neighbour of neighbours) {
      graph.addEdge(node, neighbour);
    }
  }
  return graph;
};

// Recursive function to check all possible moves (probably sub-optimal for this problem)
const nextStep = (
  source,
  shortestPathMap,
  flowRateMap,
  valves,
  currentFlow,
  remainingTime
) => {
  const nextMoves = {};
  for (let nextValve of valves) {
    const pathLength = shortestPathMap[`${source}${nextValve}`];
    const remainingValves = valves.filter((valve) => valve !== nextValve);
    const nextRemainingTime = remainingTime - pathLength - 1;
    const totalFlow =
      currentFlow + flowRateMap[nextValve] * (remainingTime - pathLength - 1);

    if (remainingTime > 0) {
      nextMoves[nextValve] = {
        remainingTime: nextRemainingTime,
        totalFlow,
        remainingValves,
        nextStep: nextStep(
          nextValve,
          shortestPathMap,
          flowRateMap,
          remainingValves,
          totalFlow,
          nextRemainingTime
        ),
      };
    }
  }
  return nextMoves;
};

const findMaxFlow = (move, maxFlow = 0) => {
  let nextFlow = move.totalFlow;

  let nestedFlow;
  if (move.nextStep) {
    for (let nextMove of Object.values(move.nextStep)) {
      nestedFlow = findMaxFlow(nextMove, nextFlow);
      if (nestedFlow > nextFlow) {
        nextFlow = nestedFlow;
      }
    }
  }

  return max([nextFlow, maxFlow]);
};

const part1 = (input) => {
  const scanOutput = parseInput(input);

  const graph = createGraph(scanOutput);

  const nonZeroValves = scanOutput
    .map(([valve, flowRate]) => {
      if (flowRate > 0) {
        return valve;
      }
      return null;
    })
    .filter((x) => x)
    .sort((a, b) => a - b);

  // Store a map of valves to flow rate
  const flowRateMap = scanOutput.reduce((acc, [valve, flowRate]) => {
    acc[valve] = flowRate;
    return acc;
  }, {});

  // Store a map of the shortest paths between nodes
  const shortestPathMap = {};
  for (let source of ["AA", ...nonZeroValves]) {
    for (let destination of ["AA", ...nonZeroValves]) {
      if (source !== destination) {
        shortestPathMap[`${source}${destination}`] = graph.shortestPath(
          source,
          destination
        );
      }
    }
  }

  // Create a map of all possible moves
  const nextSteps = nextStep(
    "AA", // Start from AA
    shortestPathMap,
    flowRateMap,
    nonZeroValves,
    0,
    30
  );

  // Find the max flow rate
  const maxFlow = findMaxFlow({
    remainingTime: 30,
    totalFlow: 0,
    nextStep: nextSteps,
  });

  return maxFlow;
};

const part2 = (input) => {
  return null;
};

export { part1, part2 };
