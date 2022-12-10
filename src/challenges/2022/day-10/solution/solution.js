import { readLinesOfInstructions, sum } from "../../../../helpers.js";

const updateSignalStrength = (cycle, registerX, signalStrength) => {
  if (Object.keys(signalStrength).includes(cycle.toString())) {
    signalStrength[cycle.toString()] = cycle * registerX;
  }
  return signalStrength;
};

const part1 = (input) => {
  const instructions = readLinesOfInstructions(input);

  let signalStrength = {
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
      signalStrength = updateSignalStrength(cycle, registerX, signalStrength);
    } else if (instruction === "addx") {
      cycle += 1;
      signalStrength = updateSignalStrength(cycle, registerX, signalStrength);
      cycle += 1;
      signalStrength = updateSignalStrength(cycle, registerX, signalStrength);
      registerX = registerX + value;
    }
  }

  return sum(Object.values(signalStrength));
};

const nextCrtPosition = ({ row, col }) =>
  col < 39 ? { row, col: col + 1 } : { row: row + 1, col: 0 };

const updateCrt = (crtPosition, registerX, crt) => {
  if (crtPosition.col >= registerX - 1 && crtPosition.col <= registerX + 1) {
    crt[crtPosition.row][crtPosition.col] = "█";
  }
  return crt;
};

const part2 = (input, printOutput = true) => {
  const instructions = readLinesOfInstructions(input);

  let crt = [0, 0, 0, 0, 0, 0].map(() => Array(40).fill(" "));

  let crtPosition = {
    row: 0,
    col: 0,
  };
  let registerX = 1;
  let cycle = 0;

  for (const [instruction, value] of instructions) {
    if (instruction === "noop") {
      cycle += 1;
      crt = updateCrt(crtPosition, registerX, crt);
      crtPosition = nextCrtPosition(crtPosition);
    } else if (instruction === "addx") {
      cycle += 1;
      crt = updateCrt(crtPosition, registerX, crt);
      crtPosition = nextCrtPosition(crtPosition);
      cycle += 1;
      crt = updateCrt(crtPosition, registerX, crt);
      crtPosition = nextCrtPosition(crtPosition);
      registerX = registerX + value;
    }
  }

  if (printOutput) {
    console.log(" ------------------------------------------ ");
    for (let row = 0; row < 6; row++) {
      console.log("|", crt[row].join(""), "|");
    }
    console.log(" ------------------------------------------ ");
  }

  // Need to read CRT screen for letters
  return "PAPKFKEJ";
};

export { part1, part2 };
