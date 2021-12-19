const getTargetArea = (input) => {
  const parsedInput = input
    .trim()
    .split("target area: ")[1]
    .split(", ")
    .map((item, idx) => item.split(`${idx === 0 ? "x" : "y"}=`)[1].split(".."));
  return parsedInput;
};

/**
 * The algorithm for a projectile step
 * @param {*}
 * @returns
 */
const step = ({ x, y, xVelocity, yVelocity }) => {
  const newX = x + xVelocity;
  const newY = y + yVelocity;

  let newXVelocity = xVelocity;
  if (xVelocity > 0) {
    newXVelocity -= 1;
  } else if (xVelocity < 0) {
    newXVelocity += 1;
  }

  const newYVelocity = yVelocity - 1;

  return {
    x: newX,
    y: newY,
    xVelocity: newXVelocity,
    yVelocity: newYVelocity,
  };
};

/**
 * Brute force search for target hits
 * @param {*} targetArea - The target area to search
 * @returns { hits, maxY }
 */
const findTargetHits = (targetArea) => {
  let maxY = 0;
  let hits = new Set();
  for (let xVelocity = -200; xVelocity < 200; xVelocity += 1) {
    for (let yVelocity = -200; yVelocity < 200; yVelocity += 1) {
      let continueSearch = true;
      let nextX = 0;
      let nextY = 0;
      let nextXVelocity = xVelocity;
      let nextYVelocity = yVelocity;
      let count = 0;
      let searchMaxY = 0;
      while (continueSearch) {
        const nextStep = step({
          x: nextX,
          y: nextY,
          xVelocity: nextXVelocity,
          yVelocity: nextYVelocity,
        });
        nextX = nextStep.x;
        nextY = nextStep.y;
        nextXVelocity = nextStep.xVelocity;
        nextYVelocity = nextStep.yVelocity;
        if (nextY > searchMaxY) {
          searchMaxY = nextY;
        }
        if (
          nextX >= targetArea[0][0] &&
          nextX <= targetArea[0][1] &&
          nextY >= targetArea[1][0] &&
          nextY <= targetArea[1][1]
        ) {
          hits.add(xVelocity.toString() + yVelocity.toString());
          if (searchMaxY > maxY) {
            // Biggest Y?
            maxY = searchMaxY;
          }
        }
        if (
          (nextX > targetArea[0][1] && nextY > targetArea[1][1]) ||
          count > 500
        ) {
          // Gone too far
          continueSearch = false;
        }
        count += 1;
      }
    }
  }
  return { hits, maxY };
};

const part1 = (input) => {
  const targetArea = getTargetArea(input);
  const { maxY } = findTargetHits(targetArea);
  return maxY;
};

const part2 = (input) => {
  const targetArea = getTargetArea(input);
  const { hits } = findTargetHits(targetArea);
  return hits.size;
};

export { part1, part2 };
