import clone from "just-clone";

const readLines = (input) => input.trim().split("\n");

const readLinesOfNumbers = (input) =>
  readLines(input).map((x) => parseInt(x.trim(), 10));

const readLinesOfDigits = (input) =>
  readLines(input).map((x) => x.split("").map((y) => parseInt(y)));

const readCommaSeperatedNumbers = (input) =>
  input.split(",").map((x) => parseInt(x, 10));

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

export {
  cartesian,
  chunk,
  clone,
  difference,
  intersect,
  max,
  min,
  product,
  readCommaSeperatedNumbers,
  readLines,
  readLinesOfDigits,
  readLinesOfNumbers,
  sortAscending,
  sortDescending,
  sum,
  symmetricDifference,
  transpose,
  union,
};
