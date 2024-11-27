import { max, product, readLines, sum } from "../../../../helpers.js";

const pattern1 = /Each (\w+) robot costs (\d.*) (\w+)/;
const pattern2 = /Each (\w+) robot costs (\d.*) (\w+) and (\d.*) (\w+)/;

const getBlueprints = (input) =>
  readLines(input)
    .map((line) => line.split(": ")[1].split(". "))
    .map((sentence) => {
      return {
        [sentence[0].match(pattern1)[1]]: {
          [sentence[0].match(pattern1)[3]]: Number.parseInt(
            sentence[0].match(pattern1)[2],
            10
          ),
        },
        [sentence[1].match(pattern1)[1]]: {
          [sentence[1].match(pattern1)[3]]: Number.parseInt(
            sentence[1].match(pattern1)[2],
            10
          ),
        },
        [sentence[2].match(pattern2)[1]]: {
          [sentence[2].match(pattern2)[3]]: Number.parseInt(
            sentence[2].match(pattern2)[2],
            10
          ),
          [sentence[2].match(pattern2)[5]]: Number.parseInt(
            sentence[2].match(pattern2)[4],
            10
          ),
        },
        [sentence[3].match(pattern2)[1]]: {
          [sentence[3].match(pattern2)[3]]: Number.parseInt(
            sentence[3].match(pattern2)[2],
            10
          ),
          [sentence[3].match(pattern2)[5]]: Number.parseInt(
            sentence[3].match(pattern2)[4],
            10
          ),
        },
      };
    });

const calculateNextMaterials = (robots, materials, time) => {
  const newMaterials = { ...materials };

  for (const robot of Object.keys(robots)) {
    newMaterials[robot] = newMaterials[robot] + robots[robot] * time;
  }

  return newMaterials;
};

const canBuild = (robots, requirements) => {
  for (const material of Object.keys(requirements)) {
    if (robots[material] === 0) {
      return false;
    }
  }
  return true;
};

const calculateBuildTime = (robots, materials, requirements) => {
  let waitTime = 0;

  for (const [material, cost] of Object.entries(requirements)) {
    if (materials[material] < cost) {
      waitTime = max([
        waitTime,
        Math.ceil((cost - materials[material]) / robots[material]),
      ]);
    }
  }

  // Add 1 minute required to actually build
  return waitTime + 1;
};

const reduceMaterialsByRobotCost = (materials, robot) => {
  const nextMaterials = { ...materials };
  for (const material of Object.keys(materials)) {
    if (robot[material]) {
      nextMaterials[material] = nextMaterials[material] - robot[material];
    }
  }
  return nextMaterials;
};

// Return the max geodes of all possible states
// I could probably make it faster by being more greedy - build geode robots as soon as possible?)
const runSearch = (initState, blueprint, robotLimits) => {
  let bestGeodeNum = 0;
  const queue = [initState];
  let newStates = 0;

  while (queue.length) {
    const currentState = queue.pop();

    for (const nextRobot of ["ore", "clay", "obsidian", "geode"]) {
      if (
        canBuild(currentState.robots, blueprint[nextRobot]) &&
        currentState.robots[nextRobot] <= robotLimits[nextRobot]
      ) {
        const requiredBuildTime = calculateBuildTime(
          currentState.robots,
          currentState.materials,
          blueprint[nextRobot]
        );

        const remainingTime = currentState.time - max([1, requiredBuildTime]);

        if (remainingTime <= 0) {
          const finalState = {
            ...currentState,
            time: 0,
            materials: calculateNextMaterials(
              currentState.robots,
              currentState.materials,
              currentState.time
            ),
          };

          if (finalState.materials.geode > bestGeodeNum) {
            bestGeodeNum = finalState.materials.geode;
          }
        } else {
          const nextState = {
            time: remainingTime,
            robots: {
              ...currentState.robots,
              [nextRobot]: currentState.robots[nextRobot] + 1,
            },
            materials: reduceMaterialsByRobotCost(
              calculateNextMaterials(
                currentState.robots,
                currentState.materials,
                requiredBuildTime
              ),
              blueprint[nextRobot]
            ),
          };

          newStates += 1;
          queue.push(nextState);
        }
      }
    }
  }

  return bestGeodeNum;
};

const part1 = (input) => {
  const blueprints = getBlueprints(input);

  const qualityLevels = [];

  // Set some reasonable limits to reduce the numebr of paths...
  const robotLimits = {
    ore: 3,
    clay: 9,
    obsidian: 9,
    geode: Infinity,
  };

  // Find all possible moves (could be faster if made greedy - build geode robots as soon as possible?)
  for (const [idx, blueprint] of blueprints.entries()) {
    const initState = {
      time: 24,
      materials: {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      robots: {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      lastStates: [],
    };

    const bestGeodeNum = runSearch(initState, blueprint, robotLimits);

    qualityLevels.push(bestGeodeNum * (idx + 1));
  }

  return sum(qualityLevels);
};

const part2 = (input) => {
  const blueprints = getBlueprints(input);

  const bestGeodeNums = [];

  const robotLimits = {
    ore: 3,
    clay: 9,
    obsidian: 9,
    geode: Infinity,
  };

  // Now we only need to check the first 3 blueprints...
  for (const blueprint of blueprints.slice(0, 3)) {
    const initState = {
      time: 32,
      materials: {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      robots: {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      lastStates: [],
    };

    const bestGeodeNum = runSearch(initState, blueprint, robotLimits);

    bestGeodeNums.push(bestGeodeNum);
  }

  return product(bestGeodeNums);
};

export { part1, part2 };
