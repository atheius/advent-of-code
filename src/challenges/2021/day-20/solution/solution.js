import { readLines, sum } from "../../../../helpers.js";

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

  const points = [
    [y - 1, x - 1],
    [y - 1, x],
    [y - 1, x + 1],
    [y, x - 1],
    [y, x],
    [y, x + 1],
    [y + 1, x - 1],
    [y + 1, x],
    [y + 1, x + 1],
  ];

  for (let point of points) {
    if (
      y >= 0 &&
      y <= map.length - 1 &&
      x >= 0 &&
      x <= map[0].length - 1 &&
      typeof map[point[0]] !== "undefined" &&
      typeof map[point[0]][point[1]] !== "undefined"
    ) {
      pixels.push(map[point[0]][point[1]]);
    } else {
      pixels.push(enhancementAlgorithm[0]);
    }
  }

  return enhancementAlgorithm[binToDec(pixels.join(""))];
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

const enhanceImage = (inputImage, enhancementAlgorithm, num) => {
  // Assume the image is square
  const height = inputImage.length;
  const width = height;
  const images = [inputImage];
  // Run the enhancement
  for (let z = 0; z < num; z += 1) {
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
  return images[images.length - 1];
};

const getLitPixels = (image, padding) =>
  image.reduce((acc, row, idx) => {
    // Ignore some of the border padding noise
    if (idx > padding / 2 - 1 && idx < image.length - padding / 2) {
      return sum([acc, ...row.slice(2, row.length - 2)]);
    }
    return acc;
  }, 0);

const part1 = (input) => {
  const { enhancementAlgorithm, inputImage } = parseInput(input);

  // Pad the first image with enough 0s so we account for the edges
  const padding = 5;
  const paddedInputImage = padImage(inputImage, padding);

  // Run enhancement twice
  const enhancedImage = enhanceImage(paddedInputImage, enhancementAlgorithm, 2);
  return getLitPixels(enhancedImage, 2);
};

const part2 = (input) => {
  const { enhancementAlgorithm, inputImage } = parseInput(input);

  // Pad the first image with enough 0s so we account for the edges
  const padding = 100;
  const paddedInputImage = padImage(inputImage, padding);

  // Run enhancement 50 times
  const enhancedImage = enhanceImage(
    paddedInputImage,
    enhancementAlgorithm,
    50
  );

  return getLitPixels(enhancedImage, padding);
};

export { part1, part2 };
