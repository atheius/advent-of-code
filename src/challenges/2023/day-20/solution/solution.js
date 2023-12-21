import { readLines, lowestCommonMultiple } from "../../../../helpers.js";

const parseInput = (input) => {
  const lines = readLines(input);
  const start = lines.filter((line) => line.startsWith("broadcaster"))[0];
  const rawNodes = lines.filter((line) => !line.startsWith("broadcaster"));
  const broadcaster = {
    name: "start",
    type: "broadcaster",
    children: start.split("->")[1].trim().split(", "),
  };
  const nodes = [
    broadcaster,
    ...rawNodes.map((node) => {
      const split = node.split("->");
      return {
        name: split[0].trim().substring(1),
        type: split[0].trim().match(/[%&]/)[0],
        children: split[1].trim().split(", "),
      };
    }),
  ]
    .map((node) => ({ ...node, value: 0 }))
    .reduce((acc, node) => {
      acc[node.name] = node;
      return acc;
    }, {});

  for (const node of Object.values(nodes)) {
    for (const child of node.children) {
      if (nodes[child] && nodes[child].type === "&") {
        if (!nodes[child].pulseMap) {
          nodes[child].pulseMap = {};
        }
        nodes[child].pulseMap[node.name] = 0;
      }
    }
  }

  return nodes;
};

const executePulse = (node, pulse = 0) => {
  const { type = null, value, children, pulseMap } = node;

  let nextValue = value;

  if (type === "%") {
    if (pulse === 1) {
      // High pulse does nothing
      return {
        nextValue,
        nextPulses: [],
      };
    }
    // Low pulse flips on / off value
    nextValue = value === 1 ? 0 : 1;
  }

  if (type === "&") {
    nextValue = Object.values(pulseMap).every((value) => value === 1) ? 0 : 1;
  }

  const nextPulses = [];
  for (const child of children) {
    nextPulses.push([child, nextValue]);
  }

  return {
    nextValue,
    nextPulses,
  };
};

const process = (nodes, buttonPresses = 1000, keyNodes = []) => {
  let numHighPulses = 0;
  let numLowPulses = 0;

  const cycleMap = keyNodes.reduce(
    (acc, node) => ({ ...acc, [node.name]: [] }),
    {}
  );

  for (let i = 0; i < buttonPresses; i++) {
    const queue = [[null, "start", 0]];
    while (queue.length) {
      const [src, dest, pulse] = queue.shift();

      if (pulse === 1) {
        numHighPulses += 1;
      } else {
        numLowPulses += 1;
      }

      const node = nodes[dest];

      if (!node) {
        continue;
      }

      if (Object.keys(cycleMap).includes(node.name)) {
        if (pulse === 0) {
          // Record when a key node receives a low pulse
          cycleMap[node.name].push(i);
        }
      }

      if (node.type === "&") {
        node.pulseMap[src] = pulse;
      }

      const { nextValue, nextPulses } = executePulse(node, pulse);

      node.value = nextValue;

      queue.push(...nextPulses.map((pulse) => [node.name, ...pulse]));
    }
  }

  return {
    numHighPulses,
    numLowPulses,
    cycleMap,
  };
};

const part1 = (input) => {
  const nodes = parseInput(input);
  const { numHighPulses, numLowPulses } = process(nodes);
  return numHighPulses * numLowPulses;
};

const part2 = (input) => {
  const nodes = parseInput(input);

  // I built a graph using graphviz (see graph.png) to confirm that rx is only changed by
  // one conjunction (jm) which is changed by 4 other conjunctions. So we need to find when
  // the cycle time of when they each (independently) receive a low pulse, then find the
  // least common multiple of those cycles to know when jm receives a high pulse from
  // each 'key' node dh, sg, lm, db.

  const finalConjunction = Object.values(nodes).find(({ children }) =>
    children.includes("rx")
  );

  const keyNodes = Object.values(nodes).filter(({ children }) =>
    children.includes(finalConjunction.name)
  );

  const { cycleMap } = process(nodes, 20000, keyNodes);

  const cycleLengths = Object.values(cycleMap).map((x) => x[1] - x[0]);

  return cycleLengths.reduce(lowestCommonMultiple);
};

export { part1, part2 };
