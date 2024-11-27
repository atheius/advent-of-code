import { readLinesOfDigits, transpose, max } from "../../../../helpers.js";

const part1 = (input) => {
  const treeMap = readLinesOfDigits(input);
  const treeMapTransposed = transpose(treeMap);

  let visible = 0;
  for (let row = 1; row < treeMap.length - 1; row++) {
    for (let tree = 1; tree < treeMap[0].length - 1; tree++) {
      // check left / right
      const maxLeft = max(treeMap[row].slice(0, tree));
      const maxRight = max(treeMap[row].slice(tree + 1));
      // check up / down
      const maxUp = max(treeMapTransposed[tree].slice(0, row));
      const maxDown = max(treeMapTransposed[tree].slice(row + 1));

      if (
        treeMap[row][tree] > maxLeft ||
        treeMap[row][tree] > maxRight ||
        treeMap[row][tree] > maxUp ||
        treeMap[row][tree] > maxDown
      ) {
        visible += 1;
      }
    }
  }

  const numOuterTrees = treeMap.length * 2 + (treeMap.length - 2) * 2;

  visible = visible + numOuterTrees;

  return visible;
};

const getTreeScore = (tree, values) => {
  let score = 0;
  for (const val of values) {
    score += 1;
    if (val >= tree) {
      break;
    }
  }
  return score;
};

const part2 = (input) => {
  const treeMap = readLinesOfDigits(input);
  const treeMapTransposed = transpose(treeMap);

  let scenicScores = [];
  for (let row = 1; row < treeMap.length - 1; row++) {
    for (let tree = 1; tree < treeMap[0].length - 1; tree++) {
      // check left / right
      let currentTreeValue = treeMap[row][tree];
      const left = getTreeScore(
        currentTreeValue,
        treeMap[row].slice(0, tree).reverse()
      );
      const right = getTreeScore(
        currentTreeValue,
        treeMap[row].slice(tree + 1)
      );

      // check up / down
      currentTreeValue = treeMapTransposed[tree][row];
      const up = getTreeScore(
        currentTreeValue,
        treeMapTransposed[tree].slice(0, row).reverse()
      );
      const down = getTreeScore(
        currentTreeValue,
        treeMapTransposed[tree].slice(row + 1)
      );

      scenicScores.push(left * right * up * down);
    }
  }

  return max(scenicScores);
};

export { part1, part2 };
