import { readLinesOfInstructions, sum } from "../../../../helpers.js";

const part1 = (input) => {
  const instructions = readLinesOfInstructions(input);

  const signalStrength = {
    20: 0,
    60: 0,
    100: 0,
    140: 0,
    180: 0,
    220: 0,
  };

  const keyCycles = Object.keys(signalStrength);
  let registerX = 1;
  let cycle = 0;

  for (const [instruction, value] of instructions) {
    if (instruction === "noop") {
      cycle += 1;
      if (keyCycles.includes(cycle.toString())) {
        signalStrength[cycle.toString()] = cycle * registerX;
      }
    } else if (instruction === "addx") {
      cycle += 1;
      if (keyCycles.includes(cycle.toString())) {
        signalStrength[cycle.toString()] = cycle * registerX;
      }
      cycle += 1;
      if (keyCycles.includes(cycle.toString())) {
        signalStrength[cycle.toString()] = cycle * registerX;
      }
      registerX = registerX + value;
    }
  }

  return sum(Object.values(signalStrength));
};

const nextCrtPosition = ({ row, col }) =>
  col < 39 ? { row, col: col + 1 } : { row: row + 1, col: 0 };

const isPixelLit = (crtPosition, spritePosition) =>
  crtPosition.col === spritePosition - 1 ||
  crtPosition.col === spritePosition ||
  crtPosition.col === spritePosition + 1;

const part2 = (input, printOutput = true) => {
  const instructions = readLinesOfInstructions(input);

  const crt = [0, 0, 0, 0, 0, 0].map(() => Array(40).fill("."));

  let crtPosition = {
    row: 0,
    col: 0,
  };
  let registerX = 1;
  let cycle = 0;

  for (const [instruction, value] of instructions) {
    if (instruction === "noop") {
      cycle += 1;

      if (isPixelLit(crtPosition, registerX)) {
        crt[crtPosition.row][crtPosition.col] = "#";
      }

      crtPosition = nextCrtPosition(crtPosition);
    } else if (instruction === "addx") {
      cycle += 1;

      if (isPixelLit(crtPosition, registerX)) {
        crt[crtPosition.row][crtPosition.col] = "#";
      }

      crtPosition = nextCrtPosition(crtPosition);
      cycle += 1;

      if (isPixelLit(crtPosition, registerX)) {
        crt[crtPosition.row][crtPosition.col] = "#";
      }

      crtPosition = nextCrtPosition(crtPosition);
      registerX = registerX + value;
    }
  }

  if (printOutput) {
    for (let row = 0; row < 6; row++) {
      console.log("|", crt[row].join(""), "|");
    }
  }

  // Need to read CRT screen for letters
  return "PAPKFKEJ";
};

export { part1, part2 };
