import { max, min, readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input)
    .map((line) => line.split(";"))
    .map((part) => [
      ...part[0].match(/[A-Z]{2}/g),
      Number.parseInt(part[0].split("=")[1], 10),
      [...part[1].matchAll(/[A-Z]{2}/g)].map((match) => match[0]),
    ]);

const findNonZeroValves = (scanOutput) =>
  scanOutput
    .map(([valve, flowRate]) => {
      if (flowRate > 0) {
        return valve;
      }
      return null;
    })
    .filter((x) => x)
    .sort((a, b) => a - b);

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

const createShortestPathMap = (graph, nodes) => {
  const shortestPathMap = {};
  for (let source of nodes) {
    for (let destination of nodes) {
      if (source !== destination) {
        shortestPathMap[`${source}${destination}`] = graph.shortestPath(
          source,
          destination
        );
      }
    }
  }
  return shortestPathMap;
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

const findMaxFlow = (move, maxFlow = 0, path = []) => {
  let nextFlow = move.totalFlow;
  let nextSteps = [];

  if (move.nextStep) {
    for (let [key, nextMove] of Object.entries(move.nextStep)) {
      let next = findMaxFlow(nextMove, nextFlow);
      if (next.maxFlow > nextFlow) {
        nextFlow = next.maxFlow;
        nextSteps = [key, ...next.path];
      }
    }
  }

  if (nextFlow > maxFlow) {
    return { maxFlow: nextFlow, path: [...path, ...nextSteps] };
  }

  return { maxFlow, path };
};

// This function is a mess and doesn't work (brute force approach)...
const nextStepWithElephant = (
  source,
  elephantSource,
  shortestPathMap,
  flowRateMap,
  valves,
  currentFlow,
  remainingTime,
  remainingTimeElephant,
  depth = 1
) => {
  const nextMoves = {};
  for (let nextValve of valves) {
    const remainingValves = valves.filter((valve) => valve !== nextValve);
    const pathLength = shortestPathMap[`${source}${nextValve}`];
    const nextRemainingTime = remainingTime - pathLength - 1;
    const totalFlow =
      currentFlow + flowRateMap[nextValve] * (remainingTime - pathLength - 1);
    for (let nextElephantValve of remainingValves) {
      const nextRemainingValvesWithElephant = remainingValves.filter(
        (valve) => valve !== nextElephantValve
      );
      const elephantPathLength =
        shortestPathMap[`${elephantSource}${nextElephantValve}`];
      const nextRemainingTimeElephant =
        remainingTimeElephant - elephantPathLength - 1;
      const totalFlowWithElephant =
        totalFlow +
        flowRateMap[nextElephantValve] *
          (remainingTimeElephant - elephantPathLength - 1);

      if (remainingTime > 0) {
        nextMoves[nextValve + nextElephantValve] = {
          remainingTime: nextRemainingTime,
          remainingTimeElephant: nextRemainingTimeElephant,
          totalFlow: totalFlowWithElephant,
          remainingValves: nextRemainingValvesWithElephant,
          nextStep: nextStepWithElephant(
            nextValve,
            nextElephantValve,
            shortestPathMap,
            flowRateMap,
            nextRemainingValvesWithElephant,
            totalFlowWithElephant,
            nextRemainingTime,
            nextRemainingTimeElephant,
            depth + 1
          ),
        };
      }
    }
  }
  return nextMoves;
};

const part1 = (input) => {
  const scanOutput = parseInput(input);

  const graph = createGraph(scanOutput);

  const nonZeroValves = findNonZeroValves(scanOutput);

  // Store a map of valves to flow rate
  const flowRateMap = scanOutput.reduce((acc, [valve, flowRate]) => {
    acc[valve] = flowRate;
    return acc;
  }, {});

  // Store a map of the shortest paths between nodes
  const shortestPathMap = createShortestPathMap(graph, [
    "AA",
    ...nonZeroValves,
  ]);

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
  const { maxFlow, path } = findMaxFlow({
    totalFlow: 0,
    nextStep: nextSteps,
  });

  return maxFlow;
};

const part2 = (input) => {
  const scanOutput = parseInput(input);

  const graph = createGraph(scanOutput);

  const nonZeroValves = findNonZeroValves(scanOutput);

  // Store a map of valves to flow rate
  const flowRateMap = scanOutput.reduce((acc, [valve, flowRate]) => {
    acc[valve] = flowRate;
    return acc;
  }, {});

  // Store a map of the shortest paths between nodes
  const shortestPathMap = createShortestPathMap(graph, [
    "AA",
    ...nonZeroValves,
  ]);

  // Example solution...
  // JJ ((26-3) * 21 = 483) | DD ((26-2) * 20 = 480)
  // BB ((23-4) * 13 = 247) | HH ((24-5) * 22 = 418)
  // CC ((19-2) * 2 = 34)   | EE ((19-4) * 3 = 45)
  // Answer: 1707

  // Create a map of all possible moves
  const nextSteps = nextStepWithElephant(
    "AA", // Start from AA
    "AA", // Elephant start from AA
    shortestPathMap,
    flowRateMap,
    nonZeroValves,
    0,
    26,
    26
  );

  // console.log(nextSteps["JJDD"].nextStep["BBHH"].nextStep["CCEE"]);

  // Find the max flow rate
  const { maxFlow, path } = findMaxFlow({
    totalFlow: 0,
    nextStep: nextSteps,
  });

  // console.log(path);

  return maxFlow;
};

export { part1, part2 };
