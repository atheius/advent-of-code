import { readLines } from "../../../../helpers.js";

class Node {
  name;
  type;
  size;
  parent;
  children = [];

  constructor(name, type, parent, size = 0) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.size = size;
  }

  getAllSubDirectories(node = this) {
    const dirs = [];
    if (node.type === "dir") {
      dirs.push(node);
    }
    for (const child of node.children) {
      dirs.push(...this.getAllSubDirectories(child));
    }
    return dirs;
  }

  updateSize(node, size) {
    node.size += size;
    if (node.parent) {
      this.updateSize(node.parent, size);
    }
  }

  addChild(node) {
    this.updateSize(this, node.size);
    this.children.push(node);
  }
}

const createDirTree = (lines) => {
  let rootNode = new Node("/", "dir", null, 0);

  let currentNode = rootNode;
  for (const line of lines) {
    if (line[0] === "$") {
      const [command_part_1, command_part_2] = line.split("$ ")[1].split(" ");
      if (command_part_1 === "cd" && command_part_2 === "..") {
        currentNode = currentNode.parent;
      } else if (command_part_1 === "cd") {
        currentNode = currentNode.children.find(
          (node) => node.name === command_part_2
        );
      }
    } else {
      const type = line.split(" ")[0] === "dir" ? "dir" : "file";
      currentNode.addChild(
        new Node(
          line.split(" ")[1],
          type,
          currentNode,
          type === "file" ? Number.parseInt(line.split(" ")[0], 10) : 0
        )
      );
    }
  }

  return rootNode;
};

const part1 = (input) => {
  const lines = readLines(input).slice(1);

  const rootNode = createDirTree(lines);

  return rootNode
    .getAllSubDirectories()
    .reduce((total, dir) => (dir.size <= 100000 ? total + dir.size : total), 0);
};

const part2 = (input) => {
  const lines = readLines(input).slice(1);

  const rootNode = createDirTree(lines);

  const requiredSpace = 30000000 - (70000000 - rootNode.size);

  return rootNode
    .getAllSubDirectories()
    .reduce(
      (min, dir) =>
        dir.size >= requiredSpace && dir.size < min ? dir.size : min,
      Infinity
    );
};

export { part1, part2 };
