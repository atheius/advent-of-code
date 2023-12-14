import clone from "just-clone";

const readLines = (input) => input.trim().split("\n");

const readLinesOfCharacters = (input) =>
  input
    .trim()
    .split("\n")
    .map((x) => x.split(""));

const readLinesOfNumbers = (input) =>
  readLines(input).map((x) => parseInt(x.trim(), 10));

const readLinesOfInstructions = (input) =>
  readLines(input)
    .map((x) => x.split(" "))
    .map(([x, y]) => [x, y ? Number.parseInt(y, 10) : 0]);

const readLinesOfDigits = (input) =>
  readLines(input).map((x) => x.split("").map((y) => parseInt(y)));

const readCommaSeperatedNumbers = (input) =>
  input.split(",").map((x) => parseInt(x, 10));

const readLinesContainingNumbers = (input) => {
  return readLines(input).map((x) => {
    const matches = x.matchAll(/(-?\d+)/g);
    return [...matches].map((m) => Number.parseInt(m[1], 10));
  });
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const sum = (x) => x.reduce((a, b) => a + b, 0);

const product = (x) => x.reduce((a, b) => a * b, 1);

const min = (x) => Math.min(...x);

const max = (x) => Math.max(...x);

const sortAscending = (items) => items.sort((a, b) => a - b);

const sortDescending = (items) => items.sort((a, b) => b - a);

const symmetricDifference = (a, b) =>
  a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)));

const difference = (a, b) => a.filter((x) => !b.includes(x));

const intersect = (a, b) => [...new Set([...a].filter((i) => b.has(i)))];

const transpose = (x) => x[0].map((_, i) => x.map((row) => row[i]));

const rotateGridClockwise = (grid) =>
  grid[0].map((_, index) => grid.map((row) => row[index]).reverse());

const rotateGridCounterClockwise = (grid) =>
  grid[0].map((_, index) => grid.map((row) => row[row.length - 1 - index]));

const union = (a, b) => [...new Set([...a, ...b])];

const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

const rotate = (arr, n) => {
  n = n % arr.length;
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
};

const greatestCommonDivisor = (a, b) =>
  b === 0 ? a : greatestCommonDivisor(b, a % b);

const lowestCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);

const hasCommonElement = (a, b) => a.some((x) => b.includes(x));

const powerset = (arr) =>
  arr.reduce(
    (subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])),
    [[]]
  );

// Returns a new list, composed of n-tuples of consecutive elements (sliding window)
const aperture = (size, arr) =>
  arr.flatMap((_, i) =>
    i <= arr.length - size ? [arr.slice(i, i + size)] : []
  );

const zip = (a, b) => a.map((x, y) => [x, b[y]]);

// Returns all indices of substring in string
const getSubstringLocations = (searchStr, str) => {
  let searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0,
    index,
    indices = [];
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

const manhattanDistance = ([x1, y1], [x2, y2]) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const coordinateInList = (coord, listOfCoords) =>
  listOfCoords.filter((x) => x[0] === coord[0] && x[1] === coord[1]).length;

// This function allows negative mod
const mod = (n, m) => ((n % m) + m) % m;

const createGrid = (height, width, char = ".") =>
  Array(height)
    .fill()
    .map(() => Array(width).fill(char));

const printGrid = (grid) => {
  for (const row of grid) {
    console.log("| " + row.join("") + " |");
  }
};

const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    if (!cache[stringifiedArgs]) {
      cache[stringifiedArgs] = fn(...args);
    }
    return cache[stringifiedArgs];
  };
};

export {
  aperture,
  cartesian,
  chunk,
  clone,
  coordinateInList,
  createGrid,
  difference,
  getSubstringLocations,
  hasCommonElement,
  intersect,
  manhattanDistance,
  max,
  min,
  mod,
  powerset,
  printGrid,
  product,
  readCommaSeperatedNumbers,
  readLines,
  readLinesContainingNumbers,
  readLinesOfCharacters,
  readLinesOfDigits,
  readLinesOfInstructions,
  readLinesOfNumbers,
  rotate,
  sortAscending,
  sortDescending,
  sum,
  symmetricDifference,
  transpose,
  rotateGridClockwise,
  rotateGridCounterClockwise,
  union,
  zip,
  memoize,
  greatestCommonDivisor,
  lowestCommonMultiple,
};
