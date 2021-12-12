import {
  readLines,
  difference,
  sum,
  transpose,
  union,
} from "../../../../helpers.js";

const parseInput = (input) => {
  const splitInput = readLines(input).map((line) =>
    line.replace(/\s+/g, " ").trim()
  );

  const fullDraw = splitInput[0].split(",");

  const boardLines = splitInput
    .slice(2)
    .filter((x) => x !== "")
    .reduce((acc, curr) => [...acc, curr.split(" ")], []);

  const boards = [];
  for (let i = 0, j = 0; i < boardLines.length / 5; i++, j += 5) {
    boards[i] = boardLines.slice(j, j + 5);
  }

  return { fullDraw, boards };
};

/**
 * Check if this board has a full set of numbers accross
 * a row or column
 * @param {*} board
 * @param {*} draw
 * @returns
 */
const isWinningBoard = (board, draw) => {
  const transposedBoard = transpose(board);
  for (let i = 0; i < board.length; i++) {
    if (
      difference(board[i], draw).length === 0 ||
      difference(transposedBoard[i], draw).length === 0
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Find a winning (or last to win) board
 * @param {*} boards
 * @param {*} draw
 * @param {*} winFirst
 * @returns
 */
const findBoard = (boards, draw, winFirst = true) => {
  let boardsFiltered = boards;
  for (let i = 4; i < draw.length; i++) {
    for (let j = 0; j < boards.length; j++) {
      if (isWinningBoard(boards[j], draw.slice(0, i))) {
        if (winFirst) {
          // This is the first board to win
          return { board: boards[j], draw: draw.slice(0, i) };
        }
        if (boardsFiltered.length === 1) {
          // This is the last board to win
          return { board: boards[j], draw: draw.slice(0, i) };
        }
        boardsFiltered.splice(j, 1);
      }
    }
  }
};

/**
 * Final processing on a board to sum the
 * unmarked numbers, and multiply by the
 * last number drawn.
 * @param {*} board
 * @param {*} draw
 * @returns
 */
const sumUnmarked = (board, draw) => {
  let unmarked = [];

  const transposedBoard = transpose(board);

  for (let i = 0; i < board.length; i++) {
    const unionPart = union(
      difference(board[i], draw),
      difference(transposedBoard[i], draw)
    );
    if (unionPart.length > 0) {
      unmarked = union(unmarked, unionPart);
    }
  }

  return sum(unmarked.map((x) => parseInt(x, 10))) * draw.slice(-1);
};

const part1 = (input) => {
  const { fullDraw, boards } = parseInput(input);
  const { board, draw } = findBoard(boards, fullDraw);
  const answer = sumUnmarked(board, draw);
  return answer;
};

const part2 = (input) => {
  const { fullDraw, boards } = parseInput(input);
  const { board, draw } = findBoard(boards, fullDraw, false);
  const answer = sumUnmarked(board, draw);
  return answer;
};

export { part1, part2 };
