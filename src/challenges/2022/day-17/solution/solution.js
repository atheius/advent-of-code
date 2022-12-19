import {
  readLinesOfCharacters,
  getSubstringLocations,
} from "../../../../helpers.js";

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < 5; row++) {
    grid[row] = Array(7).fill(".");
  }
  return grid;
};

const addRock = (grid, rockType, rockStart, jet = 0) => {
  if (rockType === 0) {
    grid[rockStart][2 + jet] = "#";
    grid[rockStart][3 + jet] = "#";
    grid[rockStart][4 + jet] = "#";
    grid[rockStart][5 + jet] = "#";
    return grid;
  }

  if (rockType === 1) {
    grid[rockStart + 2][3 + jet] = "#";
    grid[rockStart + 1][2 + jet] = "#";
    grid[rockStart + 1][3 + jet] = "#";
    grid[rockStart + 1][4 + jet] = "#";
    grid[rockStart][3 + jet] = "#";
    return grid;
  }

  if (rockType === 2) {
    grid[rockStart][2 + jet] = "#";
    grid[rockStart][3 + jet] = "#";
    grid[rockStart][4 + jet] = "#";
    grid[rockStart + 1][4 + jet] = "#";
    grid[rockStart + 2][4 + jet] = "#";
    return grid;
  }

  if (rockType === 3) {
    grid[rockStart][2 + jet] = "#";
    grid[rockStart + 1][2 + jet] = "#";
    grid[rockStart + 2][2 + jet] = "#";
    grid[rockStart + 3][2 + jet] = "#";
    return grid;
  }

  if (rockType === 4) {
    grid[rockStart][2 + jet] = "#";
    grid[rockStart][3 + jet] = "#";
    grid[rockStart + 1][2 + jet] = "#";
    grid[rockStart + 1][3 + jet] = "#";
    return grid;
  }
};

const findLastHeight = (grid) => {
  for (let row = grid.length - 1; row >= 0; row--) {
    if (grid[row].includes("#")) {
      return row + 1;
    }
  }
};

const dropRock = (grid, jets, rockType, rockStart, currentJet) => {
  let keepFalling = true;
  let jetsOn = true;
  let i = 0;
  let j = currentJet;
  let currentX = 0;
  let previousX = 0;

  while (keepFalling) {
    if (rockType === 0) {
      if (jetsOn) {
        if (currentX + jets[j] + 2 >= 0 && currentX + jets[j] + 5 <= 6) {
          previousX = currentX;
          currentX = currentX + jets[j];
        }
        j = (j + 1) % jets.length;
      }

      if (
        rockStart - i < 0 ||
        grid[rockStart - i][2 + currentX] === "#" ||
        grid[rockStart - i][3 + currentX] === "#" ||
        grid[rockStart - i][4 + currentX] === "#" ||
        grid[rockStart - i][5 + currentX] === "#"
      ) {
        if (!jetsOn) {
          grid = addRock(grid, rockType, rockStart - i + 1, currentX);
          keepFalling = false;
          continue;
        }
        currentX = previousX;
      }
    }

    if (rockType === 1) {
      if (jetsOn) {
        if (currentX + jets[j] + 2 >= 0 && currentX + jets[j] + 4 <= 6) {
          previousX = currentX;
          currentX = currentX + jets[j];
        }
        j = (j + 1) % jets.length;
      }

      if (
        rockStart - i < 0 ||
        grid[rockStart + 2 - i][3 + currentX] === "#" ||
        grid[rockStart + 1 - i][2 + currentX] === "#" ||
        grid[rockStart + 1 - i][3 + currentX] === "#" ||
        grid[rockStart + 1 - i][4 + currentX] === "#" ||
        grid[rockStart - i][3 + currentX] === "#"
      ) {
        if (!jetsOn) {
          grid = addRock(grid, rockType, rockStart - i + 1, currentX);
          keepFalling = false;
          continue;
        }
        currentX = previousX;
      }
    }

    if (rockType === 2) {
      if (jetsOn) {
        if (currentX + jets[j] + 2 >= 0 && currentX + jets[j] + 4 <= 6) {
          previousX = currentX;
          currentX = currentX + jets[j];
        }
        j = (j + 1) % jets.length;
      }

      if (
        rockStart - i < 0 ||
        grid[rockStart - i][2 + currentX] === "#" ||
        grid[rockStart - i][3 + currentX] === "#" ||
        grid[rockStart - i][4 + currentX] === "#" ||
        grid[rockStart + 1 - i][4 + currentX] === "#" ||
        grid[rockStart + 2 - i][4 + currentX] === "#"
      ) {
        if (!jetsOn) {
          grid = addRock(grid, rockType, rockStart - i + 1, currentX);
          keepFalling = false;
          continue;
        }
        currentX = previousX;
      }
    }

    if (rockType === 3) {
      if (jetsOn) {
        if (currentX + jets[j] + 2 >= 0 && currentX + jets[j] + 2 <= 6) {
          previousX = currentX;
          currentX = currentX + jets[j];
        }
        j = (j + 1) % jets.length;
      }

      if (
        rockStart - i < 0 ||
        grid[rockStart - i][2 + currentX] === "#" ||
        grid[rockStart + 1 - i][2 + currentX] === "#" ||
        grid[rockStart + 2 - i][2 + currentX] === "#" ||
        grid[rockStart + 3 - i][2 + currentX] === "#"
      ) {
        if (!jetsOn) {
          grid = addRock(grid, rockType, rockStart - i + 1, currentX);
          keepFalling = false;
          continue;
        }
        currentX = previousX;
      }
    }

    if (rockType === 4) {
      if (jetsOn) {
        if (currentX + jets[j] + 2 >= 0 && currentX + jets[j] + 3 <= 6) {
          previousX = currentX;
          currentX = currentX + jets[j];
        }
        j = (j + 1) % jets.length;
      }

      if (
        rockStart - i < 0 ||
        grid[rockStart - i][2 + currentX] === "#" ||
        grid[rockStart - i][3 + currentX] === "#" ||
        grid[rockStart + 1 - i][2 + currentX] === "#" ||
        grid[rockStart + 1 - i][3 + currentX] === "#"
      ) {
        if (!jetsOn) {
          grid = addRock(grid, rockType, rockStart - i + 1, currentX);
          keepFalling = false;
          continue;
        }
        // can't go any further accross so go back to previous x position
        currentX = previousX;
      }
    }

    if (jetsOn) {
      i += 1;
    }

    jetsOn = !jetsOn;
  }
  return {
    grid,
    lastHeight: findLastHeight(grid),
    currentJet: j,
  };
};

const printGrid = (grid) => {
  for (let row = grid.length - 1; row >= 0; row--) {
    console.log("| " + grid[row].join("") + " |");
  }
};

const generateGridString = (grid) => {
  let fullString = "";
  for (let row = grid.length - 1; row >= 0; row--) {
    fullString = fullString + grid[row].join("");
  }
  return fullString;
};

const part1 = (input) => {
  const jets = readLinesOfCharacters(input)[0].map((x) => (x === "<" ? -1 : 1));

  const grid = createGrid();

  let lastHeight = 0;
  let nextGrid = grid;
  let rockType = -1;
  let rockStart = 3;
  let nextJet = 0;
  let lastDrop;

  let i = 0;
  while (i < 2022) {
    rockType = (rockType + 1) % 5;

    lastDrop = dropRock(nextGrid, jets, rockType, rockStart, nextJet);

    nextGrid = lastDrop.grid;
    nextJet = lastDrop.currentJet;
    rockStart = lastDrop.lastHeight + 3;
    lastHeight = lastDrop.lastHeight;

    // Expand the grid to allow for new rocks
    const currentGridHeight = nextGrid.length;
    for (let x = currentGridHeight; x < rockStart + 4; x++) {
      nextGrid.push(Array(7).fill("."));
    }

    i += 1;
  }

  return lastHeight;
};

const checkForCycle = (grid, currentIteration, lastHeight, allHeights) => {
  // Convert the grid to a string of characters
  const rockString = generateGridString(grid.slice(0, lastHeight));

  // Pick a substring of size 100 from the middle and see how many times it repeats
  const indices = getSubstringLocations(
    rockString.substring(rockString.length / 2, rockString.length / 2 + 100),
    rockString
  );

  const cycleLength = Math.floor(currentIteration / indices.length);
  const cycleHeight = allHeights[cycleLength * 2] - allHeights[cycleLength];

  return { cycleLength, cycleHeight };
};

const part2 = (input) => {
  const jets = readLinesOfCharacters(input)[0].map((x) => (x === "<" ? -1 : 1));

  const grid = createGrid();

  let heightOffset = 0;
  let lastHeight = 0;
  let nextGrid = grid;
  let rockType = -1;
  let rockStart = 3;
  let nextJet = 0;
  let lastDrop;

  let allRecordedHeights = [];
  let targetIteration = 1000000000000;
  const checkCycleIteration = targetIteration * 0.000001; // Stop and check for a cycles here

  let i = 0;
  while (i < targetIteration) {
    rockType = (rockType + 1) % 5;

    // Stop during the simulation (use an arbitrary large number) and check for a cycle
    if (i === checkCycleIteration) {
      const { cycleLength, cycleHeight } = checkForCycle(
        grid,
        i,
        lastDrop.lastHeight,
        allRecordedHeights
      );

      // Calculate the height of remaining cycles
      heightOffset =
        Math.floor((targetIteration - i) / cycleLength) * cycleHeight;

      // Set the new iteration number
      i = targetIteration - ((targetIteration - i) % cycleLength);

      const remainingCycles = targetIteration - i;

      if (remainingCycles === 0) {
        continue;
      }
    }

    lastDrop = dropRock(nextGrid, jets, rockType, rockStart, nextJet);

    nextGrid = lastDrop.grid;
    nextJet = lastDrop.currentJet;
    rockStart = lastDrop.lastHeight + 3;
    lastHeight = lastDrop.lastHeight;

    allRecordedHeights.push(lastHeight);

    // Expand the grid to allow for new rocks
    const currentGridHeight = nextGrid.length;
    for (let x = currentGridHeight; x < rockStart + 4; x++) {
      nextGrid.push(Array(7).fill("."));
    }

    i += 1;
  }

  return lastHeight + heightOffset;
};

export { part1, part2 };
