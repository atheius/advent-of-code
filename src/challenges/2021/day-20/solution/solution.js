import { readLines, sum } from "../../../../helpers.js";
import chalk from "chalk";
import * as fs from "fs";

const binToDec = (bin) => parseInt(bin, 2);

const parseInput = (input) => {
  const lines = readLines(input);
  const enhancementAlgorithm = lines[0]
    .split("")
    .map((x) => (x === "#" ? 1 : 0));
  const inputImage = lines
    .slice(2)
    .map((x) => x.split("").map((x) => (x === "#" ? 1 : 0)));
  return { enhancementAlgorithm, inputImage };
};

const getPixelValue = (x, y, map, enhancementAlgorithm) => {
  const pixels = [];
  const maxY = map.length - 1;
  const maxX = map[0].length - 1;

  // top left
  if (y - 1 >= 0 && y <= maxY && x - 1 >= 0 && x <= maxX) {
    pixels.push(map[y - 1][x - 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // top middle
  if (y - 1 >= 0 && y <= maxY && x >= 0 && x <= maxX) {
    pixels.push(map[y - 1][x]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // top right
  if (y - 1 >= 0 && y <= maxY && x >= 0 && x + 1 <= maxX) {
    pixels.push(map[y - 1][x + 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // left
  if (y >= 0 && y <= maxY && x - 1 >= 0 && x <= maxX) {
    pixels.push(map[y][x - 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // middle
  if (y >= 0 && y <= maxY && x >= 0 && x <= maxX) {
    pixels.push(map[y][x]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // right
  if (y >= 0 && y <= maxY && x >= 0 && x + 1 <= maxX) {
    pixels.push(map[y][x + 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // bottom left
  if (y >= 0 && y + 1 <= maxY && x - 1 >= 0 && x <= maxX) {
    pixels.push(map[y + 1][x - 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // bottom middle
  if (y >= 0 && y + 1 <= maxY && x >= 0 && x <= maxX) {
    pixels.push(map[y + 1][x]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }
  // bottom right
  if (y >= 0 && y + 1 <= maxY && x >= 0 && x + 1 <= maxX) {
    pixels.push(map[y + 1][x + 1]);
  } else {
    pixels.push(enhancementAlgorithm[0]);
  }

  return enhancementAlgorithm[binToDec(pixels.join(""))];
};

const printImage = (image, padding = 0) => {
  for (let y = 0 - padding; y < image.length + padding; y += 1) {
    let rowString = "";
    if (y < 0 || y > image.length - 1) {
      rowString = rowString
        .padStart(image.length + padding, "-")
        .padEnd(image.length + 2 * padding, "-");
    } else {
      rowString = image[y].join("").replaceAll("0", ".").replaceAll("1", "#");
      rowString = rowString
        .padStart(image.length + padding, "-")
        .padEnd(image.length + 2 * padding, "-");
    }
    console.log(chalk.greenBright(rowString));
  }
  fs.appendFileSync("./output-image.txt", "\n\n\n");
};

const padImage = (inputImage, padding = 10) => {
  const paddedImage = Array(inputImage.length + padding * 2)
    .fill()
    .map(() => Array(inputImage.length + padding * 2).fill(0));

  for (let y = 0; y < inputImage.length; y += 1) {
    for (let x = 0; x < inputImage[0].length; x += 1) {
      paddedImage[y + padding][x + padding] = inputImage[y][x];
    }
  }

  return paddedImage;
};

const part1 = (input) => {
  const { enhancementAlgorithm, inputImage } = parseInput(input);

  // Pad the first image with enough 0s so we account for the edges
  const paddedInputImage = padImage(inputImage, 10);

  // Assume the image is square
  const height = paddedInputImage.length;
  const width = height;

  const images = [paddedInputImage];

  // Run the enhancement twice
  for (let z = 0; z < 2; z += 1) {
    // Initialise array for the next image
    let nextImage = Array(height)
      .fill()
      .map(() => Array(width).fill(0));
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        nextImage[y][x] = getPixelValue(x, y, images[z], enhancementAlgorithm);
      }
    }
    images.push(nextImage);
  }

  const litPixels = images[images.length - 1].reduce((acc, row, idx) => {
    // ignore first and last 2 rows
    if (idx > 2 && idx !== images[images.length - 1].length - 2) {
      return sum([acc, ...row.slice(2, row.length - 3)]);
    }
    return acc;
  }, 0);

  images.forEach((img) => {
    printImage(img);
    console.log("\n------\n");
  });

  return litPixels;
};

const part2 = (input) => {
  const { enhancementAlgorithm, inputImage } = parseInput(input);

  // Pad the first image with enough 0s so we account for the edges
  const padding = 100;
  const paddedInputImage = padImage(inputImage, padding);

  // Assume the image is square
  const height = paddedInputImage.length;
  const width = height;

  const images = [paddedInputImage];

  // Run the enhancement 50 times
  for (let z = 0; z < 50; z += 1) {
    // Initialise array for the next image
    let nextImage = Array(height)
      .fill()
      .map(() => Array(width).fill(0));
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        nextImage[y][x] = getPixelValue(x, y, images[z], enhancementAlgorithm);
      }
    }
    images.push(nextImage);
  }

  const litPixels = images[images.length - 1].reduce((acc, row, idx) => {
    // Ignore some the border padding noise
    if (
      idx > padding / 2 &&
      idx < images[images.length - 1].length - padding / 2
    ) {
      return sum([acc, ...row.slice(10, row.length - 10)]);
    }
    return acc;
  }, 0);

  return litPixels;
};

export { part1, part2 };
