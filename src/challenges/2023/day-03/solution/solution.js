import { readLinesOfCharacters, sum } from "../../../../helpers.js";

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const getCoordsOfSymbols = (grid, isGear = false) =>
  grid.flatMap((row, y) =>
    row.reduce((acc, char, x) => {
      if (char !== "." && !digits.includes(char)) {
        if (isGear && char === "*") {
          acc.push([y, x]);
        } else {
          acc.push([y, x]);
        }
      }
      return acc;
    }, [])
  );

const getNumsWithCoords = (grid) => {
  const nums = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x <= grid[0].length; x++) {
      if (digits.includes(grid[y][x])) {
        let currentNum = "";
        let currentNumCoords = [];

        currentNum += grid[y][x];
        currentNumCoords.push([y, x]);

        let nextChar = grid[y][x + 1];
        while (digits.includes(nextChar)) {
          currentNum += nextChar;
          currentNumCoords.push([y, x + 1]);
          x++;
          nextChar = grid[y][x + 1];
        }

        nums.push([currentNum, currentNumCoords]);
      }
    }
  }
  return nums;
};

const isAdjacent = ([y1, x1], [y2, x2]) => {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return dx <= 1 && dy <= 1;
};

const part1 = (input) => {
  const parsedInput = readLinesOfCharacters(input);

  const partNumbersWithCoords = getNumsWithCoords(parsedInput);
  const symbolCoords = getCoordsOfSymbols(parsedInput);

  return sum(
    partNumbersWithCoords
      // filter part numbers with adjacent symbols
      .filter(([, partNumberCoords]) =>
        partNumberCoords.some((partNumberCoord) =>
          symbolCoords.some((symbolCoord) =>
            isAdjacent(partNumberCoord, symbolCoord)
          )
        )
      )
      .map(([partNumber]) => parseInt(partNumber, 10))
  );
};

const part2 = (input) => {
  const parsedInput = readLinesOfCharacters(input);

  const gearsWithCoords = getCoordsOfSymbols(parsedInput, true);
  const partNumbersWithCoords = getNumsWithCoords(parsedInput);

  return gearsWithCoords.reduce((gearRatio, gearCoord) => {
    // check for adjacent part numbers
    const adjacentParts = partNumbersWithCoords
      .filter(([, partNumberCoords]) =>
        partNumberCoords.some((partNumberCoord) =>
          isAdjacent(partNumberCoord, gearCoord)
        )
      )
      .map(([num]) => parseInt(num, 10));

    return adjacentParts.length === 2
      ? gearRatio + adjacentParts[0] * adjacentParts[1]
      : gearRatio;
  }, 0);
};

export { part1, part2 };
