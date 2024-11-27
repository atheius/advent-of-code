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

const union = (a, b) => [...new Set([...a, ...b])];

const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

// Returns a new list, composed of n-tuples of consecutive elements (sliding window)
const aperture = (size, arr) =>
  arr.flatMap((_, i) =>
    i <= arr.length - size ? [arr.slice(i, i + size)] : []
  );

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

export {
  aperture,
  cartesian,
  chunk,
  clone,
  difference,
  getSubstringLocations,
  intersect,
  max,
  min,
  product,
  readCommaSeperatedNumbers,
  readLines,
  readLinesContainingNumbers,
  readLinesOfCharacters,
  readLinesOfDigits,
  readLinesOfInstructions,
  readLinesOfNumbers,
  sortAscending,
  sortDescending,
  sum,
  symmetricDifference,
  transpose,
  union,
};
