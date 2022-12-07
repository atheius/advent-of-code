import { readLines } from "../../../../helpers.js";

class Node {
  name;
  type;
  size;

  parent;
  depth;
  children = [];

  constructor(name, type, parent, depth, size = 0) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.depth = depth;
    this.size = size;
  }

  addChild(node) {
    this.children.push(node);
  }
}

/**
 * Recursive function to update node sizes
 * @param {*} node
 * @param {*} size
 */
const updateParentSize = (node, size) => {
  node.size += size;
  if (node.parent) {
    updateParentSize(node.parent, size);
  }
};

/**
 * Recursive function to find all directories
 * @param {*} node
 * @returns A list of directories
 */
const findAllDirectories = (node) => {
  const dirs = [];
  if (node.type === "dir") {
    dirs.push(node);
  }
  for (const child of node.children) {
    dirs.push(...findAllDirectories(child));
  }
  return dirs;
};

/**
 * Prints the directory tree structure
 * @param {*} node
 */
const printDirTree = (node) => {
  console.log(
    new Array(node.depth).fill("-").join(""),
    node.name,
    node.size,
    `(${node.type})`
  );
  for (const child of node.children) {
    if (child.type === "dir") {
      printDirTree(child);
    } else {
      console.log(
        new Array(child.depth).fill("-").join(""),
        child.name,
        child.size,
        `(${child.type})`
      );
    }
  }
};

const createDirTree = (lines) => {
  let rootNode = new Node("/", "dir", null, 0);
  let currentDir;
  let currentNode = rootNode;

  for (const line of lines) {
    if (line[0] === "$") {
      const command = line.split("$ ")[1];
      if (command.split(" ")[0] === "cd") {
        const move = command.split(" ")[1];
        if (move === "..") {
          currentDir = currentNode.parent.name;
          currentNode = currentNode.parent;
        } else {
          currentDir = move;
          for (const child of currentNode.children) {
            if (child.name === currentDir) {
              currentNode = child;
            }
          }
        }
      }
    } else {
      if (line.split(" ")[0] === "dir") {
        currentNode.addChild(
          new Node(
            line.split(" ")[1],
            "dir",
            currentNode,
            currentNode.depth + 1
          )
        );
      } else {
        const [size, name] = line.split(" ");
        updateParentSize(currentNode, Number.parseInt(size, 10));
        currentNode.addChild(
          new Node(
            name,
            "file",
            currentNode,
            currentNode.depth + 1,
            Number.parseInt(size, 10)
          )
        );
      }
    }
  }

  return rootNode;
};

const part1 = (input) => {
  const lines = readLines(input).slice(1);

  const rootNode = createDirTree(lines);

  return findAllDirectories(rootNode).reduce(
    (total, dir) => (dir.size <= 100000 ? total + dir.size : total),
    0
  );
};

const part2 = (input) => {
  const lines = readLines(input).slice(1);

  const rootNode = createDirTree(lines);

  const requiredSpace = 30000000 - (70000000 - rootNode.size);

  return findAllDirectories(rootNode).reduce(
    (min, dir) =>
      dir.size >= requiredSpace && dir.size < min ? dir.size : min,
    Infinity
  );
};

export { part1, part2 };
