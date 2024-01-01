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
  for (const [idx, row] of Object.entries(grid)) {
    console.log(idx.padStart(2, "0"), "| " + row.join(" ") + " |");
  }
};

// Calculate the area of a polygon using Shoelace formula
// https://en.wikipedia.org/wiki/Shoelace_formula
const getAreaOfPolygon = (polygonCoordinates) =>
  Math.abs(
    polygonCoordinates.reduce(
      (acc, [y, x], idx) =>
        (acc +=
          // Use modulo to wraparound and include the first coordinate again at the end
          x * polygonCoordinates[(idx + 1) % polygonCoordinates.length][0] -
          polygonCoordinates[(idx + 1) % polygonCoordinates.length][1] * y),
      0
    )
  ) / 2;

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

// https://stackoverflow.com/a/66511107
// prettier-ignore
const minHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};
// prettier-ignore
const maxHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]<h[j+1][0])j++;if(j>=h.length||k>=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k>h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};

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
  getAreaOfPolygon,
  minHeap,
  maxHeap,
};
