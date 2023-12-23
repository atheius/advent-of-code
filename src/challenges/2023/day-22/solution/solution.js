import { readLines, clone, intersect, max } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => {
    let parsed = line
      .split("~")
      .map((y) => y.split(",").map((z) => parseInt(z)));
    return {
      start: { x: parsed[0][0], y: parsed[0][1], z: parsed[0][2] },
      end: { x: parsed[1][0], y: parsed[1][1], z: parsed[1][2] },
    };
  });

const areBricksEqual = (brick1, brick2) =>
  JSON.stringify(brick1) === JSON.stringify(brick2);

const getPositionMap = (input) => {
  const positionMap = new Map();
  for (const brick of input) {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        for (let z = brick.start.z; z <= brick.end.z; z++) {
          positionMap.set(`${x},${y},${z}`, brick);
        }
      }
    }
  }
  return positionMap;
};

const stabaliseBricks = (bricks, positionMap) => {
  const settledPositions = clone(positionMap);

  let keepGoing = true;

  while (keepGoing) {
    keepGoing = false;

    for (const brick of bricks) {
      let fall = true;

      // Check the position below for a different brick
      for (let x = brick.start.x; x <= brick.end.x; x++) {
        for (let y = brick.start.y; y <= brick.end.y; y++) {
          for (let z = brick.start.z; z <= brick.end.z; z++) {
            if (z - 1 <= 0) {
              fall = false;
            } else {
              const key = `${x},${y},${z - 1}`;
              if (
                settledPositions.has(key) &&
                areBricksEqual(settledPositions.get(key), brick) === false
              ) {
                fall = false;
              }
            }
          }
        }
      }

      // If the brick can fall, move it down
      if (fall) {
        keepGoing = true;

        // Remove the brick from the position map
        for (let x = brick.start.x; x <= brick.end.x; x++) {
          for (let y = brick.start.y; y <= brick.end.y; y++) {
            for (let z = brick.start.z; z <= brick.end.z; z++) {
              settledPositions.delete(`${x},${y},${z}`);
            }
          }
        }

        brick.start.z--;
        brick.end.z--;

        // Add the new position
        for (let x = brick.start.x; x <= brick.end.x; x++) {
          for (let y = brick.start.y; y <= brick.end.y; y++) {
            for (let z = brick.start.z; z <= brick.end.z; z++) {
              settledPositions.set(`${x},${y},${z}`, brick);
            }
          }
        }
      }
    }
  }

  return settledPositions;
};

const getBrickDependencies = (bricks, settledMap) => {
  // Map bricks above and below each other
  const above = new Map();
  const below = new Map();

  for (const brick of bricks) {
    above.set(JSON.stringify(brick), new Set());
    below.set(JSON.stringify(brick), new Set());
  }

  for (const brick of bricks) {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        for (let z = brick.start.z; z <= brick.end.z; z++) {
          const key = `${x},${y},${z + 1}`;
          if (settledMap.has(key)) {
            const otherBrick = settledMap.get(key);
            if (areBricksEqual(otherBrick, brick) === false) {
              above.get(JSON.stringify(brick)).add(JSON.stringify(otherBrick));
              below.get(JSON.stringify(otherBrick)).add(JSON.stringify(brick));
            }
          }
        }
      }
    }
  }

  return { above, below };
};

const part1 = (input) => {
  const bricks = parseInput(input);

  const positionMap = getPositionMap(bricks);

  const settledMap = stabaliseBricks(bricks, positionMap);

  const { above, below } = getBrickDependencies(bricks, settledMap);

  let safeToRemoveCount = 0;
  // check brick dependencies for which ones are safe to remove
  for (const brick of bricks) {
    let safeToRemove = true;

    // Check for bricks above this one
    for (const brickAbove of above.get(JSON.stringify(brick))) {
      // If there is only one brick below then it's not safe to remove
      if (below.get(brickAbove).size === 1) {
        safeToRemove = false;
      }
    }

    if (safeToRemove) {
      safeToRemoveCount += 1;
    }
  }

  return safeToRemoveCount;
};

const part2 = (input) => {
  const bricks = parseInput(input);

  const positionMap = getPositionMap(bricks);

  const settledMap = stabaliseBricks(bricks, positionMap);

  const { above, below } = getBrickDependencies(bricks, settledMap);

  let totalBricksDisintegrated = 0;

  for (const brick of bricks) {
    const bricksDisintegrated = new Set();
    bricksDisintegrated.add(JSON.stringify(brick));

    let keepGoing = true;
    while (keepGoing) {
      keepGoing = false;
      for (const disintegratedBrick of bricksDisintegrated) {
        if (above.get(disintegratedBrick)) {
          // For each brick above this one
          for (const brickAbove of above.get(disintegratedBrick)) {
            if (
              bricksDisintegrated.has(brickAbove) === false &&
              // All the bricks below it have disintegrated
              Array.from(below.get(brickAbove)).every((x) =>
                bricksDisintegrated.has(x)
              )
            ) {
              bricksDisintegrated.add(brickAbove);
              keepGoing = true;
            }
          }
        }
      }
    }

    totalBricksDisintegrated += bricksDisintegrated.size - 1;
  }

  return totalBricksDisintegrated;
};

export { part1, part2 };
