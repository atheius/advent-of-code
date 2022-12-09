import { readLines } from "../../../../helpers.js";

const moveHead = (head, direction) => {
  const newHead = [...head];
  if (direction === "L") {
    newHead[0] -= 1;
  }
  if (direction === "R") {
    newHead[0] += 1;
  }
  if (direction === "U") {
    newHead[1] += 1;
  }
  if (direction === "D") {
    newHead[1] -= 1;
  }
  return newHead;
};

const moveTail = (head, tail) => {
  const dx = Math.sign(head[0] - tail[0]);
  const dy = Math.sign(head[1] - tail[1]);
  return [tail[0] + dx, tail[1] + dy];
};

const isTouching = (head, tail) =>
  Math.abs(head[0] - tail[0]) <= 1 && Math.abs(head[1] - tail[1]) <= 1;

const part1 = (input) => {
  const instructions = readLines(input)
    .map((x) => x.split(" "))
    .map(([position, steps]) => [position, Number.parseInt(steps, 10)]);

  let head = [0, 0];
  let tail = [0, 0];
  const tailPositions = new Set(["0,0"]);

  for (const [direction, steps] of instructions) {
    for (let step = 0; step < steps; step++) {
      head = moveHead(head, direction);
      if (!isTouching(head, tail)) {
        tail = moveTail(head, tail);
        tailPositions.add(`${tail[0]},${tail[1]}`);
      }
    }
  }
  return tailPositions.size;
};

const part2 = (input) => {
  const instructions = readLines(input)
    .map((x) => x.split(" "))
    .map(([position, steps]) => [position, Number.parseInt(steps, 10)]);

  let head = [0, 0];
  let tails = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  const tailPositions = new Set(["0,0"]);
  for (const [direction, steps] of instructions) {
    for (let step = 0; step < steps; step++) {
      head = moveHead(head, direction);
      for (let tailIdx = 0; tailIdx < tails.length; tailIdx++) {
        if (
          !isTouching(tailIdx === 0 ? head : tails[tailIdx - 1], tails[tailIdx])
        ) {
          tails[tailIdx] = moveTail(
            tailIdx === 0 ? head : tails[tailIdx - 1],
            tails[tailIdx]
          );
          if (tailIdx === 8) {
            tailPositions.add(`${tails[tailIdx][0]},${tails[tailIdx][1]}`);
          }
        }
      }
    }
  }

  return tailPositions.size;
};

export { part1, part2 };
