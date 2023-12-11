import {
  readLinesOfCharacters,
  transpose,
  manhattanDistance,
  sum,
} from "../../../../helpers.js";

const findEmptyRows = (image) => {
  const emptyRows = [];
  for (let y = 0; y < image.length; y++) {
    let rowEmpty = true;
    for (let x = 0; x < image[0].length; x++) {
      if (image[y][x] === "#") {
        rowEmpty = false;
      }
    }
    if (rowEmpty) {
      emptyRows.push(y);
    }
  }
  return emptyRows;
};

const getGalaxyCoordinates = (image) => {
  const galaxyCoordinates = [];
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[0].length; x++) {
      if (image[y][x] === "#") {
        galaxyCoordinates.push([y, x]);
      }
    }
  }
  return galaxyCoordinates;
};

const getAllGalaxyPairs = (galaxies) => {
  const galaxyPairs = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      galaxyPairs.push([galaxies[i], galaxies[j]]);
    }
  }
  return galaxyPairs;
};

const getScaledGalaxy = (galaxy, emptyRows, emptyCols, scale) => {
  const numEmptyRows = emptyRows.filter((row) => row < galaxy[0]).length;
  const numEmptyCols = emptyCols.filter((col) => col < galaxy[1]).length;
  return [
    galaxy[0] + numEmptyRows * (scale - 1),
    galaxy[1] + numEmptyCols * (scale - 1),
  ];
};

const getGalaxyDistances = (image, scale) => {
  const emptyRows = findEmptyRows(image);
  const emptyCols = findEmptyRows(transpose(image));

  const galaxies = getGalaxyCoordinates(image).map((galaxy) =>
    // scale each galaxy
    getScaledGalaxy(galaxy, emptyRows, emptyCols, scale)
  );

  // get shortest distance between each pair of galaxies
  return getAllGalaxyPairs(galaxies).map((galaxies) =>
    manhattanDistance(...galaxies)
  );
};

const part1 = (input) =>
  sum(getGalaxyDistances(readLinesOfCharacters(input), 2));

const part2 = (input, scale = 1000000) =>
  sum(getGalaxyDistances(readLinesOfCharacters(input), scale));

export { part1, part2 };
