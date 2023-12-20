import { readLines, lowestCommonMultiple } from "../../../../helpers.js";

const parseInput = (input) => {
  const lines = readLines(input);
  const start = lines.filter((line) => line.startsWith("broadcaster"))[0];
  const nodes = lines.filter((line) => !line.startsWith("broadcaster"));
  const broadcaster = {
    name: "start",
    type: "broadcaster",
    children: start.split("->")[1].trim().split(", "),
  };
  return [
    broadcaster,
    ...nodes.map((node) => {
      const split = node.split("->");
      return {
        name: split[0].trim().substring(1),
        type: split[0].trim().match(/[%&]/)[0],
        children: split[1].trim().split(", "),
      };
    }),
  ];
};

class Node {
  constructor(name, type, parents = []) {
    this.name = name;
    this.type = type;

    // Store the current value (0 = off, 1 = on or 0 = low, 1 = high)
    this.value = 0;

    // Store the number of pulses sent
    this.numLowPulses = 0;
    this.numHighPulses = 0;

    this.parents = parents;
    this.children = [];
  }

  addParent(node) {
    this.parents.push(node);
  }

  getParents() {
    return this.parents;
  }

  addChild(node) {
    this.children.push(node);
  }

  getChildren() {
    return this.children;
  }

  pulse(pulse = 0) {
    if (this.name === "dh" && pulse === 0) {
      console.log("name", this.name, "received pulse", pulse);
      assert(false);
    }

    if (pulse === 1) {
      this.numHighPulses += 1;
    } else {
      if (["dh", "db"].includes(this.name)) {
        console.log("name", this.name, "received pulse - low");
      }
      this.numLowPulses += 1;
    }

    if (this.type === "%") {
      if (pulse === 1) {
        // High pulse does nothing
        return;
      }
      // Low pulse flips on / off value
      this.value = this.value === 1 ? 0 : 1;
    }

    if (this.type === "&") {
      this.value = this.getParents()
        .map((parent) => parent.value)
        .every((value) => value === 1)
        ? 0
        : 1;
    }

    for (const child of this.getChildren()) {
      // Send pulse to children
      child.pulse(this.value);
    }
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addVertex(name, type = null, parent = null) {
    if (this.nodes.has(name)) {
      const node = this.nodes.get(name);
      if (type) {
        node.type = type;
      }
      if (parent) {
        node.addParent(parent);
      }
      return node;
    }
    const vertex = new Node(name, type, parent ? [parent] : []);
    this.nodes.set(name, vertex);
    return vertex;
  }

  addEdge(source, destinations = []) {
    const sourceNode = this.addVertex(source.name, source.type);

    const destinationNodes = [];
    for (const name of destinations) {
      destinationNodes.push(this.addVertex(name, null, sourceNode));
      sourceNode.addChild(this.nodes.get(name));
    }

    return [sourceNode, destinationNodes];
  }
}

const part1 = (input) => {
  const parsedInput = parseInput(input);
  const graph = new Graph();
  for (const { name, type, children } of parsedInput) {
    graph.addEdge({ name, type }, children);
  }
  for (let i = 0; i < 1000; i++) {
    graph.nodes.get("start").pulse();
  }
  const totalPulses = [...graph.nodes].reduce(
    (acc, [, node]) => {
      acc[0] += node.numLowPulses;
      acc[1] += node.numHighPulses;
      return acc;
    },
    [0, 0]
  );
  return totalPulses[0] * totalPulses[1];
};

const part2 = (input) => {
  return null;
};

export { part1, part2 };
