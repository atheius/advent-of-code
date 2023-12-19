import { readLines, sum, clone } from "../../../../helpers.js";

const parseInput = (input) => {
  const [workflowsRaw, partsRaw] = input.trim().split("\n\n");

  // Parse workflows e.g.
  // { in: { conditions: [ { category: 'x', operator: '<', value: 0, nextState: 'out' } ], nextState: 'out' }, ... }
  const workflows = readLines(workflowsRaw).reduce((acc, x) => {
    const [state, conditionsRaw] = x.split("{");
    const parsedConditions = conditionsRaw
      .substring(0, conditionsRaw.length - 1)
      .split(",");

    const nextState = parsedConditions.pop();

    const conditions = parsedConditions.map((x) => {
      const [condition, nextState] = x.split(":");
      const [category, value] = condition.split(/[<>]/);
      return {
        category: category,
        operator: condition.match(/[<>]/)[0],
        value: parseInt(value),
        nextState,
      };
    });

    return {
      ...acc,
      [state]: {
        conditions,
        nextState,
      },
    };
  }, {});

  // Parse parts e.g. { x: 0, m: 0, a: 0, s: 0 }
  const parts = readLines(partsRaw)
    .map((x) =>
      x
        .substring(1, x.length - 1)
        .split(",")
        .map((x) => parseInt(x.split("=")[1], 10))
    )
    .map(([x, m, a, s]) => ({
      x,
      m,
      a,
      s,
    }));

  return {
    workflows,
    parts,
  };
};

const getNextState = (workflow, part) => {
  const { nextState, conditions } = workflow;
  for (const condition of conditions) {
    const { category, operator, value, nextState } = condition;
    if (operator === "<") {
      if (part[category] < value) {
        return nextState;
      }
    } else if (operator === ">") {
      if (part[category] > value) {
        return nextState;
      }
    }
  }
  return nextState;
};

const getAcceptedRanges = (workflows) => {
  const queue = [
    {
      state: "in",
      workflow: workflows.in,
      range: {
        x: {
          min: 1,
          max: 4000,
        },
        m: {
          min: 1,
          max: 4000,
        },
        a: {
          min: 1,
          max: 4000,
        },
        s: {
          min: 1,
          max: 4000,
        },
      },
    },
  ];

  const accepted = [];

  while (queue.length) {
    const { state, workflow, range } = queue.shift();

    if (state === "A") {
      // Store each accepted range
      accepted.push(range);
      continue;
    }

    if (state === "R") {
      continue;
    }

    const { conditions, nextState } = workflow;
    const nextDefaultRange = clone(range);

    for (const condition of conditions) {
      const {
        category,
        operator,
        value,
        nextState: conditionalNextState,
      } = condition;
      if (operator === "<") {
        const nextRange = clone(nextDefaultRange);

        nextRange[category].max = value - 1;

        queue.push({
          state: conditionalNextState,
          workflow: workflows[conditionalNextState],
          range: nextRange,
        });

        nextDefaultRange[category].min = value;
      } else if (operator === ">") {
        const nextRange = clone(nextDefaultRange);

        nextRange[category].min = value + 1;

        queue.push({
          state: conditionalNextState,
          workflow: workflows[conditionalNextState],
          range: nextRange,
        });

        nextDefaultRange[category].max = value;
      }
    }

    queue.push({
      state: nextState,
      workflow: workflows[nextState],
      range: nextDefaultRange,
    });
  }

  return accepted;
};

const part1 = (input) => {
  const { workflows, parts } = parseInput(input);

  let accepted = [];
  for (const part of parts) {
    let state = "in";
    while (state !== "A" && state !== "R") {
      state = getNextState(workflows[state], part);
    }
    if (state === "A") {
      accepted.push(part);
    }
  }

  return sum(accepted.map((x) => sum(Object.values(x))));
};

const part2 = (input) => {
  const { workflows } = parseInput(input);

  // Check all possible routes through the workflow (using ranges)
  const accepted = getAcceptedRanges(workflows);

  // Get the total number of distinct accepted parts
  return sum(
    accepted.map(({ x, m, a, s }) => {
      return (
        (x.max - x.min + 1) *
        (m.max - m.min + 1) *
        (a.max - a.min + 1) *
        (s.max - s.min + 1)
      );
    })
  );
};

export { part1, part2 };
