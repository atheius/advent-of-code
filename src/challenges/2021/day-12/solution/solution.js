import { readLines } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => [line.split("-")[0], line.split("-")[1]]);

class Node {
  constructor(value) {
    this.value = value;
    this.adjacents = [];
    this.caveType = null;
    if (!["start", "end"].includes(this.value)) {
      this.caveType = this.value === this.value.toUpperCase() ? "big" : "small";
    }
  }

  addAdjacent(node) {
    this.adjacents.push(node);
  }

  getAdjacents() {
    return this.adjacents;
  }
}

class Graph {
  constructor(edgeDirection = "UNDIRECTED") {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
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

    if (this.edgeDirection === "UNDIRECTED") {
      destinationNode.addAdjacent(sourceNode);
    }

    return [sourceNode, destinationNode];
  }

  findAllPaths(source, destination, allowSmallCaveTwice = false, path = []) {
    const sourceNode = this.nodes.get(source);
    const newPath = [...path];

    newPath.push(sourceNode);

    if (source === destination) {
      return [newPath.map((x) => x.value)];
    }

    const paths = [];

    sourceNode.getAdjacents().forEach((node) => {
      const smallCaves = newPath.filter((x) => x.caveType === "small");
      const uniqueSmallCaves = smallCaves.reduce(
        (acc, curr) => acc.add(curr.value),
        new Set()
      );
      const canVisitSmallCave =
        smallCaves.length === uniqueSmallCaves.size ? true : false;

      if (
        !newPath.includes(node) ||
        node.caveType === "big" ||
        (node.caveType === "small" && allowSmallCaveTwice && canVisitSmallCave)
      ) {
        const nextPaths = this.findAllPaths(
          node.value,
          destination,
          allowSmallCaveTwice,
          newPath
        );
        nextPaths.forEach((nextPath) => paths.push(nextPath));
      }
    });

    return paths;
  }
}

const part1 = (input) => {
  const mapInput = parseInput(input);

  const caveGraph = new Graph();

  mapInput.forEach((input) => {
    caveGraph.addEdge(input[0], input[1]);
  });

  const paths = caveGraph.findAllPaths("start", "end");

  return paths.length;
};

const part2 = (input) => {
  const mapInput = parseInput(input);

  const caveGraph = new Graph();

  mapInput.forEach((input) => {
    caveGraph.addEdge(input[0], input[1]);
  });

  const paths = caveGraph.findAllPaths("start", "end", true);

  return paths.length;
};

export { part1, part2 };
