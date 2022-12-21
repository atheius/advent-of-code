import { max, readLines, sum } from "../../../../helpers.js";

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

const checkRequiredMaterials = (materials, requirements) => {
  for (const [type, numRequired] of Object.entries(requirements)) {
    console.log("checking ", type, " num required", numRequired);
    if (materials[type] <= numRequired) {
      console.log("not enough");
      return false;
    }
  }
  return true;
};

const part1 = (input) => {
  const blueprints = getBlueprints(input);

  const blueprint = blueprints[0];

  console.dir(blueprint, { depth: null });

  // Each robot can collect 1 of its resource type per minute

  // Find all possible moves
  // Make it greedy - as soon as we can get a geode cracking robot then get one

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
  };

  const queue = [initState];

  let buildStrategy = [
    "geode",
    "geode",
    "obsidian",
    "clay",
    "obsidian",
    "clay",
    "clay",
    "clay",
  ];

  while (queue.length) {
    const currentState = queue.pop();

    console.log("===== NEXT STATE ======");
    console.log(currentState);

    if (currentState.time > 0) {
      let remainingTime;
      let nextRobots;
      let nextMaterials;

      let buildType;
      let requiredBuildTime;

      const buildStrategyNext = buildStrategy.pop();

      console.log(buildStrategyNext);

      if (
        canBuild(currentState.robots, blueprint.ore) &&
        buildStrategyNext === "ore"
      ) {
        // console.log("can build ore");
        buildType = "ore";
        requiredBuildTime = calculateBuildTime(
          currentState.robots,
          currentState.materials,
          blueprint.ore
        );
        // console.log("required build time: ", requiredBuildTime);
      } else if (
        canBuild(currentState.robots, blueprint.clay) &&
        buildStrategyNext === "clay"
      ) {
        // console.log("can build clay");
        buildType = "clay";
        requiredBuildTime = calculateBuildTime(
          currentState.robots,
          currentState.materials,
          blueprint.clay
        );
        // console.log("required build time: ", requiredBuildTime);
      } else if (
        canBuild(currentState.robots, blueprint.obsidian) &&
        buildStrategyNext === "obsidian"
      ) {
        // console.log("can build obsidian");
        buildType = "obsidian";
        requiredBuildTime = calculateBuildTime(
          currentState.robots,
          currentState.materials,
          blueprint.obsidian
        );
        // console.log("required build time: ", requiredBuildTime);
      } else if (
        canBuild(currentState.robots, blueprint.geode) &&
        buildStrategyNext === "geode"
      ) {
        // console.log("can build geode");
        buildType = "geode";
        requiredBuildTime = calculateBuildTime(
          currentState.robots,
          currentState.materials,
          blueprint.geode
        );
        // console.log("required build time: ", requiredBuildTime);
      }

      remainingTime = currentState.time - max([1, requiredBuildTime]);

      console.log("BUILD ROBOT: ", buildType);
      console.log("BUILD TIME: ", max([1, requiredBuildTime]));

      if (!buildType || remainingTime <= 0) {
        console.log("REMAINING TIME: ", currentState.time);
        // Calculate final materials
        nextMaterials = calculateNextMaterials(
          currentState.robots,
          currentState.materials,
          currentState.time
        );

        console.log("FINAL STATE", {
          ...currentState,
          time: 0,
          materials: nextMaterials,
        });
        continue;
      }

      console.log("REMAINING TIME: ", remainingTime);

      // Increase robots
      nextRobots = {
        ...currentState.robots,
        [buildType]: currentState.robots[buildType] + 1,
      };

      // Decrease materials
      for (const [material, _] of Object.entries(currentState.materials)) {
        if (blueprint[buildType][material]) {
          currentState.materials[material] =
            currentState.materials[material] - blueprint[buildType][material];
        }
      }

      nextMaterials = calculateNextMaterials(
        currentState.robots,
        currentState.materials,
        requiredBuildTime
      );

      const nextState = {
        time: remainingTime,
        robots: nextRobots,
        materials: nextMaterials,
      };

      queue.push(nextState);
    }
  }

  return null;
};

const part2 = (input) => {
  return null;
};

export { part1, part2 };
