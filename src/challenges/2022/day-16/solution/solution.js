import {
  powerset,
  readLines,
  hasCommonElement,
  max,
} from "../../../../helpers.js";

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

// Create a map of each path that can be traversed in 26 minutes and it's max flow
const getPathFlowMap = (valves, shortestPathMap, flowRateMap, maxTime = 26) => {
  const start = "AA";

  const paths = [];
  for (const valve of valves) {
    const remainingTime = maxTime - shortestPathMap[`${start}${valve}`] - 1;
    paths.push([
      [start, valve],
      remainingTime,
      flowRateMap[valve] * remainingTime,
    ]);
  }

  for (const [path, pathRemainingTime, pathFlow] of paths) {
    const remainingValves = valves.filter((x) => !path.includes(x));
    for (const nextValve of remainingValves) {
      const remainingTime =
        pathRemainingTime -
        shortestPathMap[`${path[path.length - 1]}${nextValve}`] -
        1;
      if (remainingTime > 0) {
        paths.push([
          [...path, nextValve],
          remainingTime,
          pathFlow + flowRateMap[nextValve] * remainingTime,
        ]);
      }
    }
  }

  const pathFlowMap = {};
  for (const [path, _, flow] of paths) {
    const ascendingPath = path.sort();
    if (!pathFlowMap[ascendingPath] || flow > pathFlowMap[ascendingPath]) {
      pathFlowMap[ascendingPath] = flow;
    }
  }

  return pathFlowMap;
};

// Find all partitions of valves both you and the elephant can turn
const getPartitions = (valves) => {
  const combinations = powerset(valves);
  const partitions = [];
  for (let i = 0; i < combinations.length; i++) {
    for (let j = 0; j < combinations.length; j++) {
      if (
        i !== j &&
        combinations[i].length >= Math.floor(valves.length / 2) - 1 &&
        combinations[j].length >= Math.floor(valves.length / 2) - 1 &&
        !hasCommonElement(combinations[i], combinations[j])
      ) {
        partitions.push([combinations[i], combinations[j]]);
      }
    }
  }
  return partitions;
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

  // Create a map of all possible paths to maximum flow rate
  const pathFlowMap = getPathFlowMap(
    nonZeroValves,
    shortestPathMap,
    flowRateMap,
    30
  );

  return max(Object.values(pathFlowMap));
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

  // Create a map of all possible paths to maximum flow rate
  const pathFlowMap = getPathFlowMap(
    nonZeroValves,
    shortestPathMap,
    flowRateMap
  );

  // Get all possible partitions of you and elephant
  const partitions = getPartitions(nonZeroValves);

  // For each partition get the max flow
  let max = 0;
  for (const partition of partitions) {
    const a = pathFlowMap[["AA", ...partition[0].sort()]];
    const b = pathFlowMap[["AA", ...partition[1].sort()]];
    if (a + b > max) {
      max = a + b;
    }
  }

  return max;
};

export { part1, part2 };
