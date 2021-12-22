import { readLines } from "../../../../helpers.js";

/**
 * Node class for Binary Tree
 */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/**
 * Calculate the magnitude of a number
 * @param {*} root
 * @returns
 */
const magnitude = (root) => {
  if (Number.isInteger(root.value)) {
    return root.value;
  }
  return 3 * magnitude(root.left) + 2 * magnitude(root.right);
};

/**
 * Function to update the next neighbour to the
 * left or right after an "explode" operation
 * @param {*} startNode
 * @param {*} direction
 * @returns
 */
const updateNeighbour = (startNode, direction) => {
  const inverseDirection = direction === "left" ? "right" : "left";
  let previousParentNode = startNode;
  let nextParentNode = startNode.parent;
  while (nextParentNode) {
    // See if we can go left / right
    if (
      nextParentNode[direction] &&
      nextParentNode[direction] !== previousParentNode
    ) {
      // Now go all the way in the inverse direction
      let foundDeepestNodeInDirection = false;
      let nextNode = nextParentNode[direction];
      while (foundDeepestNodeInDirection === false) {
        if (nextNode[inverseDirection]) {
          nextNode = nextNode[inverseDirection];
        } else {
          foundDeepestNodeInDirection = true;
          nextNode.value += startNode[direction].value;
          return true;
        }
      }
    }
    previousParentNode = nextParentNode;
    nextParentNode = nextParentNode.parent;
  }
  return false;
};

/**
 * Check whether to explode / split
 * @param {*} type
 * @param {*} node
 * @param {*} depth
 * @returns
 */
const checkCondition = (type, node, depth) => {
  if (type === "explode") {
    return (
      depth > 4 &&
      node.left &&
      Number.isInteger(node.left.value) &&
      node.right &&
      Number.isInteger(node.right.value)
    );
  } else {
    return Number.isInteger(node.value) && node.value >= 10;
  }
};

/**
 * This is the main logic for a "reduce" operation
 * @param {*} root
 * @returns
 */
const reduceTree = (root) => {
  let stillReducing = true;
  let conditionType = "explode";

  while (stillReducing) {
    stillReducing = false;

    let stack = [[root, 1]];

    // Check conditions (in order)
    // 1. Check explode
    // 2. Check split (after all explosions have finished)
    while (stack.length > 0) {
      const [node, depth] = stack.pop();

      if (node === null || node === undefined) {
        continue;
      }

      if (checkCondition(conditionType, node, depth)) {
        if (conditionType === "explode") {
          // Explode the pair
          updateNeighbour(node, "left");
          updateNeighbour(node, "right");
          node.value = 0;
          node.left = null;
          node.right = null;
          stillReducing = true;
          continue;
        } else {
          // Split the pair
          node.left = new Node(Math.floor(node.value / 2));
          node.left.parent = node;
          node.right = new Node(Math.ceil(node.value / 2));
          node.right.parent = node;
          node.value = null;
          stillReducing = true;
          // Go back to exploding
          conditionType = "explode";
          continue;
        }
      }

      stack.push([node.right, depth + 1]);
      stack.push([node.left, depth + 1]);
    }

    if (stillReducing === false && conditionType === "explode") {
      // Move on to split
      conditionType = "split";
      stillReducing = true;
    }
  }

  return root;
};

/**
 * Add two BST's together
 * @param {*} a
 * @param {*} b
 * @returns
 */
const add = (a, b) => {
  const root = new Node();
  root.left = a;
  root.right = b;
  root.left.parent = root;
  root.right.parent = root;
  reduceTree(root);
  return root;
};

/**
 * Parse nodes into a Binary Search Tree
 * @param {*} fish_num
 * @param {*} parent
 * @returns
 */
const buildTree = (fish_num, parent = null) => {
  const node = new Node();
  node.parent = parent;

  if (Number.isInteger(fish_num)) {
    node.value = fish_num;
    return node;
  }

  node.left = buildTree(fish_num[0], node);
  node.right = buildTree(fish_num[1], node);

  reduceTree(node);

  return node;
};

const part1 = (input) =>
  magnitude(
    readLines(input)
      .map(JSON.parse)
      .map(buildTree)
      .reduce((total, nextNum) => (total ? add(total, nextNum) : nextNum), null)
  );

const part2 = (input) => {
  const nums = readLines(input).map(JSON.parse);
  const totals = [];
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = 0; j < nums.length; j += 1) {
      totals.push(magnitude(add(buildTree(nums[i]), buildTree(nums[j]))));
    }
  }
  return Math.max(...totals);
};

export { part1, part2 };
