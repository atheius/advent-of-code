import { readLinesOfCharacters } from "../../../../helpers.js";

const findStartAndEndPositions = (heatmap) => {
  let start;
  let end;
  for (const row of heatmap.keys()) {
    if (heatmap[row].indexOf("S") > -1) {
      start = [row, heatmap[row].indexOf("S")];
    }
    if (heatmap[row].indexOf("E") > -1) {
      end = [row, heatmap[row].indexOf("E")];
    }
  }
  return { start, end };
};

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

  shortestPath(sources, destination) {
    // Breadth First Search (see: https://en.wikipedia.org/wiki/Breadth-first_search)

    const queue = [...sources.map((source) => [source, 0])];
    const visited = new Set(sources);
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

const convertValue = (x) => "SabcdefghijklmnopqrstuvwxyzE".indexOf(x);

const canClimb = (currentPoint, neighbourPoint) =>
  convertValue(neighbourPoint) - convertValue(currentPoint) <= 1;

const createGraph = (heatmap) => {
  const graph = new Graph();
  for (const row of heatmap.keys()) {
    for (const col of heatmap[row].keys()) {
      const currentPoint = heatmap[row][col];
      let up, left, right, down;

      if (heatmap[row - 1]) {
        up = heatmap[row - 1][col];
        if (canClimb(currentPoint, up)) {
          graph.addEdge([row, col].join(","), `${row - 1},${col}`);
        }
      }

      left = heatmap[row][col - 1];
      if (left) {
        if (canClimb(currentPoint, left)) {
          graph.addEdge([row, col].join(","), `${row},${col - 1}`);
        }
      }

      right = heatmap[row][col + 1];
      if (right) {
        if (canClimb(currentPoint, right)) {
          graph.addEdge([row, col].join(","), `${row},${col + 1}`);
        }
      }

      if (heatmap[row + 1]) {
        down = heatmap[row + 1][col];
        if (down) {
          if (canClimb(currentPoint, down)) {
            graph.addEdge([row, col].join(","), `${row + 1},${col}`);
          }
        }
      }
    }
  }

  return graph;
};

const part1 = (input) => {
  const heatmap = readLinesOfCharacters(input);
  const { start, end } = findStartAndEndPositions(heatmap);
  const heatmapGraph = createGraph(heatmap);
  return heatmapGraph.shortestPath([start.join(",")], end.join(","));
};

const findLowestPoints = (heatmap) => {
  const lowestPoints = [];
  for (const row of heatmap.keys()) {
    for (const col of heatmap[row].keys()) {
      if (heatmap[row][col] === "a") {
        lowestPoints.push([row, col]);
      }
    }
  }
  return lowestPoints;
};

const part2 = (input) => {
  const heatmap = readLinesOfCharacters(input);

  const { end } = findStartAndEndPositions(heatmap);
  const lowestPoints = findLowestPoints(heatmap);

  const heatmapGraph = createGraph(heatmap);

  // Check the shortest path from all possible sources
  const shortestPath = heatmapGraph.shortestPath(
    lowestPoints.map((point) => point.join(",")),
    end.join(",")
  );

  return shortestPath;
};

export { part1, part2 };
