import { readLinesOfDigits } from "../../../../helpers.js";

const getNeighbours = (x, y, map) => {
  const neighbours = [];
  if (x - 1 >= 0) {
    neighbours.push([x - 1, y]);
  }
  if (x + 1 < map[y].length) {
    neighbours.push([x + 1, y]);
  }
  if (y - 1 >= 0) {
    neighbours.push([x, y - 1]);
  }
  if (y + 1 < map.length) {
    neighbours.push([x, y + 1]);
  }
  return neighbours;
};

const initQueue = (map) => {
  const queue = [];

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      // Starting position is never entered (so risk is not counted)
      const totalRisk = x + y === 0 ? 0 : Number.MAX_SAFE_INTEGER;
      queue.push([x, y, map[y][x], totalRisk]);
    }
  }
  return queue;
};

const findPath = (map, end) => {
  const queue = initQueue(map);
  let endNode = [];

  while (queue.length > 0) {
    if (queue.length % 10000 === 0) {
      console.log("Checks remaining: ", queue.length);
    }

    // Sort queue on total risk
    queue.sort((a, b) => a[3] - b[3]);

    const currentNode = queue.shift();

    const [x, y, risk, totalRisk] = currentNode;

    if (x === end[0] && y === end[1]) {
      endNode = currentNode;
      break;
    }

    // Check the risk level of each neighbour
    const neighbours = getNeighbours(x, y, map);
    for (let neighbour of neighbours) {
      const neighbourIdx = queue.findIndex((node) => {
        return node[0] == neighbour[0] && node[1] == neighbour[1];
      });

      if (neighbourIdx === -1) {
        continue;
      }

      const nextNeighbour = queue[neighbourIdx];

      // Set total risk level of neighbour
      queue[neighbourIdx][3] = Math.min(
        totalRisk + nextNeighbour[2],
        nextNeighbour[3]
      );
    }
  }

  const totalRisk = endNode[3];

  return totalRisk;
};

const part1 = (input) => {
  const map = readLinesOfDigits(input);
  const end = [map[map.length - 1].length - 1, map.length - 1];

  const result = findPath(map, end);

  return result;
};

const createRow = (seedRow) => {
  const newRow = [...seedRow];
  let count = 0;
  for (let i = 1; i < 5; i += 1) {
    for (let j = 0; j < seedRow.length; j += 1) {
      const nextNum = (newRow[count] + 1) % 10;
      newRow.push(nextNum === 0 ? 1 : nextNum);
      count += 1;
    }
  }
  return newRow;
};

const part2 = (input) => {
  const map = readLinesOfDigits(input);

  const fullMap = [];

  for (let i = 0; i < map[0].length * 5; i += 1) {
    if (i < map[0].length) {
      fullMap[i] = createRow(map[i]);
    } else {
      const nextSeed = [];
      const items =
        i >= map.length
          ? fullMap[i - map.length].slice(0, map[0].length)
          : map[i];
      items.forEach((num) => {
        const nextNum = (num + 1) % 10;
        nextSeed.push(nextNum === 0 ? 1 : nextNum);
      });
      fullMap[i] = createRow(nextSeed);
    }
  }

  const end = [fullMap[fullMap.length - 1].length - 1, fullMap.length - 1];

  const result = findPath(fullMap, end);

  return result;
};

export { part1, part2 };
