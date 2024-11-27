import { readLines, clone } from "../../../../helpers.js";

const moveSeaCucumbers = (lastGrid) => {
  const nextGrid = clone(lastGrid);
  const numRows = nextGrid.length;
  const numColumns = nextGrid[0].length;

  for (const direction of ["east", "south"]) {
    let changes = [];
    for (let row = 0; row < numRows; row++) {
      for (let column = 0; column < numColumns; column++) {
        if (
          (direction === "east" && nextGrid[row][column] === ">") ||
          (direction === "south" && nextGrid[row][column] === "v")
        ) {
          const nextRow = direction === "east" ? row : (row + 1) % numRows;

          const nextColumn =
            direction === "east" ? (column + 1) % numColumns : column;

          if (nextGrid[nextRow][nextColumn] === ".") {
            changes.push({
              previous: [row, column],
              next: [nextRow, nextColumn],
            });
          }
        }
      }
    }
    changes.forEach(({ previous, next }) => {
      nextGrid[previous[0]][previous[1]] = ".";
      nextGrid[next[0]][next[1]] = direction === "east" ? ">" : "v";
    });
  }
  return nextGrid;
};

const part1 = (input) => {
  const parsedInput = readLines(input).map((x) => x.split(""));

  let previousGrid = parsedInput;
  let nextGrid = previousGrid;

  let x = 0;
  let stoppedMoving = false;

  while (stoppedMoving === false) {
    x += 1;
    previousGrid = nextGrid;
    nextGrid = moveSeaCucumbers(previousGrid);
    if (JSON.stringify(previousGrid) === JSON.stringify(nextGrid)) {
      stoppedMoving = true;
    }
  }

  return x;
};

export { part1 };
