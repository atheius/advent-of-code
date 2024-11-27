import { sum, mod, chunk } from "../../../../helpers.js";

const parseInstructions = (input) => {
  const split = input.split("\n\n");
  return {
    grid: split[0].split("\n").map((x) => x.split("")),
    instructions: split[1].match(/[a-zA-Z]+|[0-9]+/g).map((x) => {
      if (Number.isInteger(Number.parseInt(x, 10))) {
        return Number.parseInt(x, 10);
      }
      return x;
    }),
  };
};

// Map my values for north/east/south/west for left/right/up/down
const facingMap = {
  0: 3,
  1: 0,
  2: 1,
  3: 2,
};

const getNextStep = (map, direction, [row, col], numSteps) => {
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  let blocked = false;
  let step = 1;
  let lastStep = [row, col];
  let currentPosition = [row, col];
  let nextPosition;
  while (step <= numSteps && !blocked) {
    const [currentRow, currentCol] = currentPosition;

    switch (direction) {
      case 0:
        nextPosition = [mod(currentRow - 1, mapHeight), currentCol];
        break;
      case 1:
        nextPosition = [currentRow, mod(currentCol + 1, mapWidth)];
        break;
      case 2:
        nextPosition = [mod(currentRow + 1, mapHeight), currentCol];
        break;
      case 3:
        nextPosition = [currentRow, mod(currentCol - 1, mapWidth)];
        break;
    }

    const [nextRow, nextCol] = nextPosition;

    switch (map[nextRow][nextCol]) {
      case ".":
        // We can take a step forward
        step += 1;
        lastStep = nextPosition;
        currentPosition = nextPosition;
        break;
      case "#":
        // The path is blocked
        blocked = true;
        break;
      default:
        currentPosition = nextPosition;
        break;
    }
  }
  return lastStep;
};

const part1 = (input) => {
  const { instructions, grid } = parseInstructions(input);

  const startPosition = [0, grid[0].indexOf(".")];
  const startDirection = 1; // 0 = Up, 1 = Right, 2 = Down, 3 = Left

  let currentDirection = startDirection;
  let currentPosition = startPosition;
  for (const instruction of instructions) {
    if (["R", "L"].includes(instruction)) {
      // Change direction
      currentDirection =
        instruction === "L"
          ? mod(currentDirection - 1, 4)
          : mod(currentDirection + 1, 4);
    } else {
      // Move a number of steps forward
      currentPosition = getNextStep(
        grid,
        currentDirection,
        currentPosition,
        instruction
      );
    }
  }

  const [row, col] = currentPosition;

  const facing = facingMap[currentDirection.toString()];
  const rowValue = 1000 * (row + 1);
  const colValue = 4 * (col + 1);

  return sum([rowValue, colValue, facing]);
};

const getSquares = (grid, cubeSize = 4) => {
  const squares = [];

  let chunks = [];
  for (const row of grid) {
    chunks.push(chunk(row.join("").trim().split(""), cubeSize));
  }

  for (let i = 0; i < grid.length; i += cubeSize) {
    for (let j = 0; j < chunks[i].length; j++) {
      const square = [];
      for (let x = 0; x < cubeSize; x++) {
        square.push(chunks[i + x][j]);
      }
      squares.push(square);
    }
  }

  return squares;
};

const getNextPosition = (cubeSize, square, [row, col], direction) => {
  if (direction === 0 && row - 1 >= 0) {
    return [square, [row - 1, col], direction];
  }
  if (direction === 1 && col + 1 < cubeSize) {
    return [square, [row, col + 1], direction];
  }
  if (direction === 2 && row + 1 < cubeSize) {
    return [square, [row + 1, col], direction];
  }
  if (direction === 3 && col - 1 >= 0) {
    return [square, [row, col - 1], direction];
  }

  // These are hardcoded wrap locations for the example cube
  const testCubeMap = {
    0: {
      0: [1, [0, col], 2],
      1: [5, [3 - row, 3], 3],
      2: [3, [0, col], 2],
      3: [2, [0, row], 2],
    },
    1: {
      0: [0, [0, 3 - col], 3],
      1: [2, [row, 0], 1],
      2: [4, [3, 3 - col], 0],
      3: [5, [3, row], 0],
    },
    2: {
      0: [0, [col, 0], 1],
      1: [3, [row, 0], 1],
      2: [4, [3 - col, 0], 1],
      3: [1, [row, 3], 3],
    },
    3: {
      0: [0, [3, col], 1],
      1: [5, [0, 3 - row], 2],
      2: [4, [0, col], 2],
      3: [2, [row, 3], 3],
    },
    4: {
      0: [3, [3, col], 0],
      1: [5, [0, row], 1],
      2: [1, [3, 3 - col], 0],
      3: [2, [3, 3 - row], 0],
    },
    5: {
      0: [3, [3 - col, 3], 3],
      1: [0, [3 - row, 3], 3],
      2: [1, [row, 0], 1],
      3: [4, [row, 3], 3],
    },
  };

  // These are hardcoded wrap locations for the solution
  const solutionCubeMap = {
    0: {
      // 0 = Up, 1 = Right, 2 = Down, 3 = Left
      0: [5, [col, 0], 1],
      1: [1, [row, 0], 1],
      2: [2, [0, col], 2],
      3: [3, [49 - row, 0], 1],
    },
    1: {
      0: [5, [49, col], 0],
      1: [4, [49 - row, 49], 3],
      2: [2, [col, 49], 3],
      3: [0, [row, 49], 3],
    },
    2: {
      0: [0, [49, col], 0],
      1: [1, [49, row], 0],
      2: [4, [0, col], 2],
      3: [3, [0, row], 2],
    },
    3: {
      0: [2, [col, 0], 1],
      1: [4, [row, 0], 1],
      2: [5, [0, col], 2],
      3: [0, [49 - row, 0], 1],
    },
    4: {
      0: [2, [49, col], 0],
      1: [1, [49 - row, 49], 3],
      2: [5, [col, 49], 3],
      3: [3, [row, 49], 3],
    },
    5: {
      0: [3, [49, col], 0],
      1: [4, [49, row], 0],
      2: [1, [0, col], 2],
      3: [0, [0, row], 2],
    },
  };

  if (cubeSize === 4) {
    return testCubeMap[square][direction];
  }

  return solutionCubeMap[square][direction];
};

const getNextStep3D = (
  cubeSize,
  squares,
  currentSquareNum,
  direction,
  [row, col],
  numSteps
) => {
  let blocked = false;

  let step = 1;

  let lastDirection = direction;
  let lastSquare = currentSquareNum;
  let lastPosition = [row, col];

  let nextSquare;
  let nextPosition;
  let nextDirection;

  while (step <= numSteps && !blocked) {
    // Get the next position based on square/direction...
    [nextSquare, nextPosition, nextDirection] = getNextPosition(
      cubeSize,
      lastSquare,
      lastPosition,
      lastDirection
    );

    const [nextRow, nextCol] = nextPosition;

    switch (squares[nextSquare][nextRow][nextCol]) {
      case ".":
        // We can take a step forward
        step += 1;
        lastSquare = nextSquare;
        lastPosition = nextPosition;
        lastDirection = nextDirection;
        break;
      case "#":
        // The path is blocked
        blocked = true;
        break;
    }
  }
  return [lastSquare, lastPosition, lastDirection];
};

const part2 = (input) => {
  const { instructions, grid } = parseInstructions(input);

  const cubeSize = grid.length === 12 ? 4 : 50;

  // Get the 6 squares from the grid (each side of the cube)
  const squares = getSquares(grid, cubeSize);

  // Hardcode the top left corner of each square
  const squareCorners =
    cubeSize === 4
      ? [
          [0, 8],
          [4, 0],
          [4, 4],
          [4, 8],
          [8, 8],
          [8, 12],
        ]
      : [
          [0, 50],
          [0, 100],
          [50, 50],
          [100, 0],
          [100, 50],
          [150, 0],
        ];

  const startPosition = [0, 0]; // Start at top-left of square 0
  const startDirection = 1; // 0 Up, 1 = Right, 2 = Down, 3 = Left

  let square = 0;
  let direction = startDirection;
  let position = startPosition;
  for (const instruction of instructions) {
    if (["R", "L"].includes(instruction)) {
      // Change direction
      direction =
        instruction === "L" ? mod(direction - 1, 4) : mod(direction + 1, 4);
    } else {
      // Move a number of steps "forward" (on a 3D cube)
      [square, position, direction] = getNextStep3D(
        cubeSize,
        squares,
        square,
        direction,
        position,
        instruction // number of steps
      );
    }
  }

  const row = squareCorners[square][0] + position[0] + 1;
  const col = squareCorners[square][1] + position[1] + 1;

  const facing = facingMap[direction.toString()];
  const rowValue = 1000 * row;
  const colValue = 4 * col;

  return sum([rowValue, colValue, facing]);
};

export { part1, part2 };
